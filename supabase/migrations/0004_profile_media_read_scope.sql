-- FaceBai F2: separate profile-media object reads from bucket listing.
-- Signed-in users may view profile images, but may only enumerate their own media namespace.

-- The previous broad SELECT policy allowed authenticated users to list every object
-- name in the private profile-media bucket. Replace it with operation-aware policies.
drop policy if exists "authenticated users can read profile media" on storage.objects;

drop policy if exists "authenticated users can read profile media objects" on storage.objects;
create policy "authenticated users can read profile media objects"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'profile-media'
  and storage.allow_any_operation(array[
    'object.get_authenticated_info',
    'object.get_authenticated'
  ])
);

drop policy if exists "users list own profile media" on storage.objects;
create policy "users list own profile media"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'profile-media'
  and storage.allow_only_operation('object.list')
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and (storage.foldername(name))[2] in ('avatar', 'cover')
);
