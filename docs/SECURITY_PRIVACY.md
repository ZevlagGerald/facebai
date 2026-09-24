# FaceBai Security and Privacy Baseline

Date: 2026-09-24

FaceBai handles identity, social relationships, user-generated content and behavioral interaction data. Security/privacy are product requirements, not post-launch cleanup.

## Security baseline

### Authentication
- managed authentication provider; do not implement password hashing/session cryptography manually
- verified email required before public posting
- Cloudflare Turnstile on signup and abuse-sensitive auth flows
- rate-limit login, password reset, registration and username/email lookup behavior
- generic auth errors to avoid account enumeration
- secure, HttpOnly, SameSite cookies through supported SSR auth integration
- reauthentication for password/email/security-sensitive changes
- support session revocation/logout from all devices before public launch

### Authorization
- deny by default
- server-side authorization on every mutation
- PostgreSQL RLS on every exposed app table
- public UUID/object IDs never imply permission
- admin/moderator role checks enforced server-side and logged

### Media/user-generated content
- initial public uploads restricted to JPEG/PNG/WebP
- file-size and pixel-dimension caps
- validate content type and decodeability; never trust filename extension
- opaque generated object keys
- strip/avoid exposing original filenames and unnecessary metadata
- short-lived upload authorization
- separate pending/ready/rejected states
- report/remove/block workflows exist before public beta
- video/file attachments deferred until additional scanning/moderation controls exist

### Abuse controls
Rate limits for:
- registrations
- login attempts
- friend/Bai requests
- post/comment/reaction creation
- reports
- media uploads
- search enumeration

Add anomaly logging for bursts, repeated failures and privileged actions.

### Application security
Qualification includes tests for:
- IDOR/broken object authorization
- RLS bypass attempts
- CSRF where applicable
- XSS from posts/comments/profile fields
- SQL/RPC injection
- malicious URLs
- oversized/malformed uploads
- unauthorized media reads
- privilege escalation
- account enumeration
- blocked-user data leakage

## Privacy by design

### Data minimization
Public profile:
- username
- display name
- chosen avatar/cover
- optional bio
- optional coarse location label

Private account data:
- email/auth identities
- date of birth/age assurance data
- security/session metadata
- moderation/account history as required

Never expose birth date or email simply because a user profile is visible.

### User controls required for beta
- profile visibility
- post visibility
- block Bai
- mute Bai
- delete own post/comment
- account deactivation/deletion request
- privacy notice access
- community standards/report content

Data export and full account deletion workflow are release requirements before broad public launch.

### Feed privacy
Initial feed is chronological and relationship/visibility based. Avoid opaque behavioral profiling in the first release. If recommendation/ranking is later introduced, document its inputs, privacy basis and user controls before activation.

## Philippine compliance workstream

Before public beta:
- identify the legal Personal Information Controller/operator
- designate privacy/DPO responsibility
- create a data inventory and retention schedule
- produce Privacy Notice, Terms of Service and Community Standards
- assess/register FaceBai's Data Processing System with the National Privacy Commission as applicable
- document processors/subprocessors and cross-border data transfers
- establish security-incident/breach handling and annual reporting process as applicable
- establish data-subject request process
- document child/minor handling and age-assurance policy

Because FaceBai is a social/digital platform with regular personal-data processing, do not assume a small-team exemption removes NPC obligations. Formal Philippine legal/privacy review is required before public launch.

## Minor users

Initial beta recommendation: restrict the beta to adults (18+) while privacy, moderation, age assurance, reporting and child-safety controls are being qualified. Expanding to minors requires a dedicated review and implementation tranche; do not silently allow a child-oriented onboarding path.

## Logging

Security logs must avoid storing passwords, auth secrets, raw tokens or unnecessary sensitive personal data. Admin/moderator actions are auditable. Retention periods must be documented rather than indefinite by default.

## Secret handling

- no secrets in repository
- production secrets only in approved secret/environment stores
- Supabase secret/service credentials never shipped to browser
- R2 write/admin credentials never shipped to browser
- public/publishable keys are treated according to provider design but remain paired with RLS/least privilege
