import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const migration = readFileSync(
  new URL("../supabase/migrations/0007_posts_foundation.sql", import.meta.url),
  "utf8",
);

test("F3-A posts foundation keeps text posts bounded and state-honest", () => {
  assert.match(migration, /create table if not exists public\.posts/);
  assert.match(migration, /id uuid primary key default gen_random_uuid\(\)/);
  assert.match(migration, /author_id uuid not null references public\.profiles\(id\) on delete cascade/);
  assert.match(migration, /body text not null/);
  assert.match(migration, /visibility text not null default 'public'/);
  assert.match(migration, /char_length\(btrim\(body\)\) between 1 and 5000/);
  assert.match(migration, /visibility in \('public'\)/);
});

test("F3-A posts foundation narrows grants and enables RLS", () => {
  assert.match(migration, /alter table public\.posts enable row level security/);
  assert.match(migration, /revoke all on public\.posts from anon/);
  assert.match(migration, /revoke all on public\.posts from authenticated/);
  assert.match(migration, /grant select on public\.posts to authenticated/);
  assert.match(migration, /grant insert \(author_id, body, visibility\) on public\.posts to authenticated/);
  assert.match(migration, /grant update \(body\) on public\.posts to authenticated/);
  assert.match(migration, /grant delete on public\.posts to authenticated/);
});

test("F3-A posts RLS permits shared reads but only owner mutations", () => {
  assert.match(migration, /on public\.posts for select[\s\S]*?to authenticated[\s\S]*?using \(true\)/);
  assert.match(migration, /on public\.posts for insert[\s\S]*?with check \(\(select auth\.uid\(\)\) = author_id\)/);
  assert.match(migration, /on public\.posts for update[\s\S]*?using \(\(select auth\.uid\(\)\) = author_id\)[\s\S]*?with check \(\(select auth\.uid\(\)\) = author_id\)/);
  assert.match(migration, /on public\.posts for delete[\s\S]*?using \(\(select auth\.uid\(\)\) = author_id\)/);
});

test("F3-A posts foundation indexes ownership and stable feed cursors", () => {
  assert.match(migration, /posts_author_id_idx[\s\S]*?\(author_id\)/);
  assert.match(migration, /posts_feed_cursor_idx[\s\S]*?\(created_at desc, id desc\)/);
  assert.match(migration, /posts_touch_updated_at[\s\S]*?private\.touch_updated_at\(\)/);
});
