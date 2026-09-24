-- FaceBai F1: authenticated identity/profile foundation.
-- Run against a dedicated non-production Supabase project first.

create extension if not exists citext;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username citext not null unique,
  display_name text not null,
  bio text not null default '',
  avatar_key text,
  cover_key text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_username_format check (username::text ~ '^[a-z0-9][a-z0-9._]{2,29}$'),
  constraint profiles_display_name_length check (char_length(display_name) between 2 and 80),
  constraint profiles_bio_length check (char_length(bio) <= 500)
);

create table if not exists public.account_private (
  user_id uuid primary key references auth.users(id) on delete cascade,
  date_of_birth date not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.account_private enable row level security;

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

create policy "users update own private account data"
on public.account_private for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create or replace function public.handle_new_facebai_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
declare
  requested_username text;
  requested_name text;
  requested_dob date;
begin
  requested_username := lower(trim(coalesce(new.raw_user_meta_data ->> 'username', '')));
  requested_name := trim(coalesce(new.raw_user_meta_data ->> 'full_name', ''));
  requested_dob := nullif(new.raw_user_meta_data ->> 'date_of_birth', '')::date;

  if requested_username !~ '^[a-z0-9][a-z0-9._]{2,29}$' then
    raise exception 'invalid username';
  end if;
  if char_length(requested_name) < 2 or char_length(requested_name) > 80 then
    raise exception 'invalid display name';
  end if;
  if requested_dob is null then
    raise exception 'date of birth required';
  end if;

  insert into public.profiles (id, username, display_name)
  values (new.id, requested_username, requested_name);

  insert into public.account_private (user_id, date_of_birth)
  values (new.id, requested_dob);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_facebai_user();

create index if not exists profiles_username_idx on public.profiles (username);
