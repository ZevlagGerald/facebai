import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  buildPostFeedCursorFilter,
  encodePostFeedCursor,
  parsePostFeedCursor,
  POST_FEED_PAGE_SIZE,
} from "../lib/posts/feed.ts";

const page = readFileSync(new URL("../app/tambayan/page.tsx", import.meta.url), "utf8");
const feed = readFileSync(new URL("../app/components/post-feed.tsx", import.meta.url), "utf8");
const feedCss = readFileSync(new URL("../app/components/post-feed.module.css", import.meta.url), "utf8");
const i18n = readFileSync(new URL("../lib/i18n/f3-posts.ts", import.meta.url), "utf8");
const databaseTypes = readFileSync(new URL("../lib/database.types.ts", import.meta.url), "utf8");

test("F3-C cursor contract is bounded, deterministic, and rejects malformed input", () => {
  assert.equal(POST_FEED_PAGE_SIZE, 20);

  const cursor = {
    createdAt: "2026-09-25T19:30:00.123456+00:00",
    id: "123e4567-e89b-42d3-a456-426614174000",
  };
  const encoded = encodePostFeedCursor(cursor);

  assert.deepEqual(parsePostFeedCursor(encoded), cursor);
  assert.equal(parsePostFeedCursor("not-a-cursor"), null);
  assert.equal(parsePostFeedCursor("2026-09-25T19:30:00Z~not-a-uuid"), null);
  assert.equal(parsePostFeedCursor("2026-09-25T19:30:00Z,or(id.gt.x)~123e4567-e89b-42d3-a456-426614174000"), null);
  assert.equal(
    buildPostFeedCursorFilter(cursor),
    "created_at.lt.2026-09-25T19:30:00.123456+00:00,and(created_at.eq.2026-09-25T19:30:00.123456+00:00,id.lt.123e4567-e89b-42d3-a456-426614174000)",
  );
});

test("F3-C reads only public posts in stable newest-first keyset order", () => {
  assert.match(page, /\.from\("posts"\)/);
  assert.match(page, /profiles!posts_author_id_fkey\(username, display_name\)/);
  assert.match(page, /\.eq\("visibility", "public"\)/);
  assert.match(page, /\.order\("created_at", \{ ascending: false \}\)/);
  assert.match(page, /\.order\("id", \{ ascending: false \}\)/);
  assert.match(page, /\.limit\(POST_FEED_PAGE_SIZE \+ 1\)/);
  assert.match(page, /postsQuery = postsQuery\.or\(buildPostFeedCursorFilter\(cursor\)\)/);
  assert.match(page, /encodePostFeedCursor\(\{ createdAt: lastVisibleRow\.created_at, id: lastVisibleRow\.id \}\)/);
});

test("F3-C database types retain the posts-to-profiles relationship used by the feed", () => {
  assert.match(databaseTypes, /posts: \{/);
  assert.match(databaseTypes, /foreignKeyName: "posts_author_id_fkey"/);
  assert.match(databaseTypes, /referencedRelation: "profiles"/);
  assert.match(databaseTypes, /referencedColumns: \["id"\]/);
});

test("F3-C distinguishes feed failure, empty feed, and real post rendering", () => {
  assert.match(page, /const feedLoadFailed = Boolean\(postsError\) \|\| authorIntegrityFailed/);
  assert.match(page, /t3\("feed\.loadFailedTitle"\)/);
  assert.match(page, /role="alert"/);
  assert.match(page, /<PostFeed[\s\S]*?posts=\{posts\}[\s\S]*?nextCursor=\{nextCursor\}/);
  assert.match(feed, /posts\.length === 0/);
  assert.match(feed, /t\("feed\.emptyTitle"\)/);
  assert.match(feed, /<article className=\{styles\.postCard\} key=\{post\.id\}>/);
  assert.match(feed, /\{post\.body\}/);
  assert.match(feed, /@\{post\.author\.username\}/);
  assert.match(feed, /<time className=\{styles\.timestamp\} dateTime=\{post\.createdAt\}>/);
});

test("F3-C paginates honestly without silently truncating older posts", () => {
  assert.match(feed, /aria-label=\{t\("feed\.paginationLabel"\)\}/);
  assert.match(feed, /query: \{ cursor: nextCursor \}/);
  assert.match(feed, /t\("feed\.olderPosts"\)/);
  assert.match(feed, /t\("feed\.newestPosts"\)/);
  assert.match(feed, /t\("feed\.noOlderTitle"\)/);
  assert.match(page, /if \(rawCursor && !cursor\) redirect\("\/tambayan"\)/);
});

test("F3-C keeps the feed read-only and leaves F3-D/F4 interactions out of scope", () => {
  assert.doesNotMatch(feed, /deletePost|editPost|updatePost|reaction|comment|likeCount|commentCount/);
  assert.doesNotMatch(feed, /<button/);
  assert.match(feedCss, /min-height: 44px/);
  assert.match(feedCss, /white-space: pre-wrap/);
  assert.match(feedCss, /@media \(max-width: 560px\)/);
});

test("F3-C localizes feed loading, empty, pagination, and completion states", () => {
  assert.match(i18n, /"feed\.listLabel"/);
  assert.match(i18n, /"feed\.emptyTitle"/);
  assert.match(i18n, /"feed\.emptyBody"/);
  assert.match(i18n, /"feed\.loadFailedTitle"/);
  assert.match(i18n, /"feed\.loadFailedBody"/);
  assert.match(i18n, /"feed\.paginationLabel"/);
  assert.match(i18n, /"feed\.olderPosts"/);
  assert.match(i18n, /"feed\.newestPosts"/);
  assert.match(i18n, /"feed\.noOlderTitle"/);
  assert.match(i18n, /const ceb:/);
  assert.match(i18n, /const tl:/);
  assert.match(i18n, /const en:/);
});
