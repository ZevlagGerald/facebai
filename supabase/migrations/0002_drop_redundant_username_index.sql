-- FaceBai F1: the UNIQUE constraint on profiles.username already provides
-- a unique btree index suitable for username equality lookups.
drop index if exists public.profiles_username_idx;
