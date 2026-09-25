-- FaceBai F3-A: authenticated post data foundation.
-- Repository contract only until the owner separately authorizes applying this migration.

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  body text not null,
  visibility text not null default 'public',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint posts_body_length check (char_length(btrim(body)) between 1 and 5000),
  constraint posts_visibility_supported check (visibility in ('public'))
);

alter table public.posts enable row level security;

-- Public-schema privileges are narrowed deliberately. RLS and grants are both required.
revoke all on public.posts from anon;
revoke all on public.posts from authenticated;

grant select on public.posts to authenticated;
grant insert (author_id, body, visibility) on public.posts to authenticated;
grant update (body) on public.posts to authenticated;
grant delete on public.posts to authenticated;

create policy "authenticated users can read posts"
on public.posts for select
to authenticated
using (true);

create policy "users create own posts"
on public.posts for insert
to authenticated
with check ((select auth.uid()) = author_id);

create policy "users update own posts"
on public.posts for update
to authenticated
using ((select auth.uid()) = author_id)
with check ((select auth.uid()) = author_id);

create policy "users delete own posts"
on public.posts for delete
to authenticated
using ((select auth.uid()) = author_id);

-- Policy ownership lookups and feed keyset pagination both require leading indexes.
create index if not exists posts_author_id_idx
on public.posts (author_id);

create index if not exists posts_feed_cursor_idx
on public.posts (created_at desc, id desc);

drop trigger if exists posts_touch_updated_at on public.posts;
create trigger posts_touch_updated_at
before update on public.posts
for each row execute procedure private.touch_updated_at();
