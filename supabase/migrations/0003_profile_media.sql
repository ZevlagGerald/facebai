-- FaceBai F2: profile avatar/cover Storage foundation.
-- Backward-compatible with existing profile rows: avatar_key and cover_key are nullable.
-- Media remains private to authenticated FaceBai users; writes are owner-folder scoped.

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'profile-media',
  'profile-media',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']::text[]
)
on conflict (id) do update
set
  name = excluded.name,
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Profile keys must always remain inside the owning user's media namespace.
-- Application-generated objects use UUID filenames and jpg/png/webp extensions.
alter table public.profiles
  drop constraint if exists profiles_avatar_key_owned,
  add constraint profiles_avatar_key_owned check (
    avatar_key is null
    or avatar_key ~ (
      '^' || id::text || '/avatar/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|png|webp)$'
    )
  ),
  drop constraint if exists profiles_cover_key_owned,
  add constraint profiles_cover_key_owned check (
    cover_key is null
    or cover_key ~ (
      '^' || id::text || '/cover/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|png|webp)$'
    )
  );

-- Profile media is visible only after FaceBai authentication.
drop policy if exists "authenticated users can read profile media" on storage.objects;
create policy "authenticated users can read profile media"
on storage.objects
for select
to authenticated
using (bucket_id = 'profile-media');

-- New objects must live under <auth.uid()>/avatar/... or <auth.uid()>/cover/...
-- Bucket MIME and size restrictions provide a second enforcement layer.
drop policy if exists "users upload own profile media" on storage.objects;
create policy "users upload own profile media"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'profile-media'
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and (storage.foldername(name))[2] in ('avatar', 'cover')
  and lower(storage.extension(name)) in ('jpg', 'png', 'webp')
);

-- Replacements use fresh object names instead of upsert. Users may clean up only
-- objects in their own UUID namespace.
drop policy if exists "users delete own profile media" on storage.objects;
create policy "users delete own profile media"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'profile-media'
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and (storage.foldername(name))[2] in ('avatar', 'cover')
);
