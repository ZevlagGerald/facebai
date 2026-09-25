-- FaceBai F2: allow private profile-media objects to be signed for display.
-- Migration 0004 split object reads from bucket listing, but omitted the
-- storage.object.sign / storage.object.sign_many operations used by
-- createSignedUrl() / createSignedUrls(). Supabase reports an RLS-hidden
-- object as NoSuchKey, so authenticated profile images became unavailable.

-- Keep listing owner-scoped in the separate "users list own profile media"
-- policy. This policy grants object read/sign operations only; it does not
-- broaden INSERT, DELETE, or list permissions.
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
    'object.sign_many'
  ])
);
