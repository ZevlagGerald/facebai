-- FaceBai F1: authenticated identity/profile foundation.
-- Apply to the dedicated non-production FaceBai Supabase project first.

create schema if not exists private;
revoke all on schema private from public;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique,
  display_name text not null,
  bio text not null default '',
  avatar_key text,
  cover_key text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_username_format check (username ~ '^[a-z0-9][a-z0-9._]{2,29}$'),
  constraint profiles_display_name_length check (char_length(display_name) between 2 and 80),
  constraint profiles_bio_length check (char_length(bio) <= 500)
);

create table if not exists public.account_private (
  user_id uuid primary key references auth.users(id) on delete cascade,
  date_of_birth date not null,
  terms_accepted_at timestamptz not null,
  privacy_accepted_at timestamptz not null,
  legal_version text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.account_private enable row level security;

-- Supabase's public-schema default privileges are intentionally narrowed here.
revoke all on public.profiles from anon;
revoke all on public.account_private from anon;
revoke all on public.profiles from authenticated;
revoke all on public.account_private from authenticated;

grant select on public.profiles to authenticated;
grant update (username, display_name, bio, avatar_key, cover_key) on public.profiles to authenticated;
grant select on public.account_private to authenticated;

create policy "authenticated users can read profiles"
on public.profiles for select
to authenticated
using (true);

create policy "users update own profile"
on public.profiles for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create policy "users read own private account data"
on public.account_private for select
to authenticated
using ((select auth.uid()) = user_id);

-- Date of birth and legal acceptance are immutable through the public Data API.
-- Future legal/age changes must use controlled server-side procedures and audit logging.

create or replace function private.handle_new_facebai_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  requested_username text;
  requested_name text;
  requested_dob date;
  accepted_terms boolean;
  accepted_privacy boolean;
  requested_legal_version text;
begin
  requested_username := lower(trim(coalesce(new.raw_user_meta_data ->> 'username', '')));
  requested_name := trim(coalesce(new.raw_user_meta_data ->> 'full_name', ''));
  requested_dob := nullif(new.raw_user_meta_data ->> 'date_of_birth', '')::date;
  accepted_terms := coalesce((new.raw_user_meta_data ->> 'accepted_terms')::boolean, false);
  accepted_privacy := coalesce((new.raw_user_meta_data ->> 'accepted_privacy')::boolean, false);
  requested_legal_version := trim(coalesce(new.raw_user_meta_data ->> 'legal_version', ''));

  if requested_username !~ '^[a-z0-9][a-z0-9._]{2,29}$' then
    raise exception 'invalid username';
  end if;
  if char_length(requested_name) < 2 or char_length(requested_name) > 80 then
    raise exception 'invalid display name';
  end if;
  if requested_dob is null then
    raise exception 'date of birth required';
  end if;
  if requested_dob > (current_date - interval '18 years')::date then
    raise exception 'private beta requires age 18 or older';
  end if;
  if requested_dob < date '1900-01-01' then
    raise exception 'invalid date of birth';
  end if;
  if not accepted_terms or not accepted_privacy then
    raise exception 'legal acceptance required';
  end if;
  if requested_legal_version <> '2026-09-24' then
    raise exception 'unsupported legal version';
  end if;

  insert into public.profiles (id, username, display_name)
  values (new.id, requested_username, requested_name);

  insert into public.account_private (
    user_id,
    date_of_birth,
    terms_accepted_at,
    privacy_accepted_at,
    legal_version
  ) values (
    new.id,
    requested_dob,
    now(),
    now(),
    requested_legal_version
  );

  return new;
end;
$$;

revoke all on function private.handle_new_facebai_user() from public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure private.handle_new_facebai_user();

create or replace function private.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

revoke all on function private.touch_updated_at() from public;

drop trigger if exists profiles_touch_updated_at on public.profiles;
create trigger profiles_touch_updated_at
before update on public.profiles
for each row execute procedure private.touch_updated_at();

drop trigger if exists account_private_touch_updated_at on public.account_private;
create trigger account_private_touch_updated_at
before update on public.account_private
for each row execute procedure private.touch_updated_at();

create index if not exists profiles_username_idx on public.profiles (username);
