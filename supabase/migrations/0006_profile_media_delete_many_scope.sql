-- FaceBai F2: allow owner-scoped replacement cleanup through Storage remove().
-- Supabase's batch delete route runs under storage.object.delete_many and executes
-- DELETE ... RETURNING *. With operation-aware SELECT policies, the row must also
-- be visible to that delete operation or Storage returns an empty successful result.
--
-- Keep the actual DELETE authorization owner-scoped in the existing
-- "users delete own profile media" policy. This SELECT policy only lets the
-- delete route see rows it may then attempt to delete; it does not broaden
-- INSERT, DELETE, or bucket-list permissions.
drop policy if exists "authenticated users can read profile media objects" on storage.objects;
create policy "authenticated users can read profile media objects"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'profile-media'
  and storage.allow_any_operation(array[
    'object.get_authenticated_info',
    'object.get_authenticated',
    'object.sign',
    'object.sign_many',
    'object.delete_many'
  ])
);
