# FaceBai Data Model — Initial Production Schema

Status: architecture baseline, not yet migrated

## Identity separation

`auth.users` remains owned by Supabase Auth.

Application tables reference `auth.users.id` by UUID. Public profile data and private account data are separated so an accidental profile query cannot expose email, date of birth or other private fields.

## Core tables

### profiles
- id uuid PK -> auth.users.id
- username text/citext UNIQUE NOT NULL
- display_name text NOT NULL
- bio text
- avatar_media_id uuid nullable
- cover_media_id uuid nullable
- location_label text nullable
- profile_visibility enum: public | bai_only | private
- created_at timestamptz
- updated_at timestamptz

### account_private
- user_id uuid PK -> auth.users.id
- date_of_birth date
- age_assurance_status
- locale
- timezone
- onboarding_completed_at
- deletion_requested_at nullable

Never expose `account_private` through public profile APIs.

### bai_relationships
Represents friendship-style connections.
- id uuid PK
- requester_id uuid
- addressee_id uuid
- status: pending | accepted | declined | cancelled
- created_at
- responded_at nullable

Constraints:
- requester != addressee
- one canonical relationship per unordered user pair
- blocked users cannot create or accept requests

### user_blocks
- blocker_id uuid
- blocked_id uuid
- created_at
- UNIQUE(blocker_id, blocked_id)

### user_mutes
- muter_id uuid
- muted_id uuid
- created_at

### posts
- id uuid PK
- author_id uuid
- group_id uuid nullable
- body text nullable
- visibility: public | bai_only | private | group
- status: active | removed | deleted
- created_at
- updated_at
- deleted_at nullable

Indexes:
- (author_id, created_at DESC, id DESC)
- (created_at DESC, id DESC) partial where status='active'
- visibility-aware indexes as query plans require

### post_media
- id uuid PK
- post_id uuid
- owner_id uuid
- object_key text UNIQUE
- media_type
- mime_type
- width int
- height int
- byte_size bigint
- alt_text text nullable
- sort_order smallint
- status: pending | ready | rejected | deleted
- created_at

### reactions
- id uuid PK
- user_id uuid
- post_id uuid
- reaction_type: lami | love | haha | wow | sad | angry
- created_at
- UNIQUE(user_id, post_id)

### comments
- id uuid PK
- post_id uuid
- author_id uuid
- parent_comment_id uuid nullable
- body text NOT NULL
- status: active | removed | deleted
- created_at
- updated_at
- deleted_at nullable

For MVP, nested replies are limited to one reply level in the UI even if the schema can represent deeper trees.

### saved_posts
- user_id uuid
- post_id uuid
- created_at
- UNIQUE(user_id, post_id)

### stories
- id uuid PK
- author_id uuid
- media_id uuid
- caption text nullable
- visibility: public | bai_only
- created_at
- expires_at
- deleted_at nullable

### groups
- id uuid PK
- owner_id uuid
- slug text UNIQUE
- name text
- description text
- visibility: public | private
- avatar_media_id uuid nullable
- cover_media_id uuid nullable
- created_at

### group_memberships
- group_id uuid
- user_id uuid
- role: owner | admin | moderator | member
- status: pending | active | banned
- joined_at
- UNIQUE(group_id, user_id)

### notifications
- id uuid PK
- recipient_id uuid
- actor_id uuid nullable
- type
- entity_type
- entity_id uuid nullable
- payload jsonb (small, non-authoritative presentation metadata only)
- read_at nullable
- created_at

Durable truth stays in normalized tables; notification JSON is not an authorization source.

### reports
- id uuid PK
- reporter_id uuid
- target_type: user | post | comment | group | message
- target_id uuid
- reason_code
- details text nullable
- status: open | reviewing | actioned | rejected
- created_at
- resolved_at nullable
- resolver_id uuid nullable

### moderation_actions
- id uuid PK
- moderator_id uuid
- target_type
- target_id uuid
- action_type
- reason
- metadata jsonb
- created_at

### admin_audit_log
Append-only security/audit events for privileged operations.

## Deferred messaging schema

Do not implement chat until core account/post/report/block flows are qualified. Planned tables:
- conversations
- conversation_members
- messages
- message_receipts

Message authorization must enforce membership and blocks in the database/server path.

## Feed query contract

Initial home feed is a parameterized/RPC query returning only posts visible to the authenticated viewer. It must account for:
- post visibility
- accepted Bai relationship
- group membership
- author blocks in either direction
- moderation/deletion status

Pagination uses an opaque cursor backed by `created_at + id`, not OFFSET for deep scrolling.

## RLS principles

Every exposed table uses deny-by-default RLS. Examples:
- profile UPDATE: only `auth.uid() = id`
- post INSERT: only authenticated author = `auth.uid()`
- post UPDATE/DELETE: only author unless separate privileged moderation path
- reactions/comments: actor must be authenticated and able to view the target post
- blocks/mutes/saved posts: only owner can read/write own rows
- reports: reporter can create/read limited own reports; moderators use privileged policy/controlled server path

Exact SQL policies are implemented and tested in migrations, not left as documentation assumptions.
