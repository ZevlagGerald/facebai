# FaceBai GUI Voice & Social Shell Standard

Status: F2 baseline

## Product voice

FaceBai uses conversational Bisaya/Cebuano flavor without translating every control literally. Familiar social actions must remain understandable; humor belongs primarily in navigation labels, reactions, confirmations, empty states, loading states, and secondary microcopy.

The product voice must be:
- warm and social
- recognizably Bisaya
- playful without becoming vulgar
- understandable to first-time users
- clear for security, privacy, abuse, account, and irreversible actions

## Canonical social GUI terms

| Function | Visible FaceBai label | Supporting copy / notes |
| --- | --- | --- |
| Home feed | Tambayan | `Unsa'y istorya nimo ron, Bai?` |
| Friends | Mga Bai | Use `Bai Requests` for friend requests |
| Groups | Pundok | `Mga Bai nga parehas og trip.` |
| Messages | Istorya | Future module |
| Notifications | Hoy! | Accessible label remains `Notifications` |
| Search | Pangitaa | `Pangitaa ang imong Bai...` |
| Profile | Ako | Profile / social identity |
| Photos | Mga Litrato | Photo module |
| Entertainment | Lingaw | Future entertainment/video surface |
| Marketplace | Bai & Sell | Must display `PUHON` until implemented |
| Logout | Lakaw sa ko | Account action remains explicit in accessible label/context |
| Comment | Sulti | Future post interaction |
| Save | Tipigi | Future post interaction |
| Retry | Usba daw | Error recovery |
| Cancel | Ayaw sa | Safe non-destructive cancellation |

## Signature microcopy vocabulary

Approved recurring expressions:
- Bai
- Puhon
- Kuan
- Pag sure oi?
- Mao ba?!
- Sus
- Hala
- Ambot
- Atik
- Sige

Use these sparingly. Do not place meme language on every control.

## Reactions — planned

- Ganahan — thumbs up
- Gugma — heart
- HAHAHA — laugh
- Mao ba?! — surprise
- Hala... — sad / concern
- Lagot — angry

These labels are FaceBai product copy. Do not copy Facebook's reaction artwork.

## State copy

Loading:
- `Kadiyot lang, Bai...`
- `Kuan sa... loading pa.`

Empty feed:
- `Hilom lagi diri, Bai. Ikaw sa una.`

Empty notifications:
- `Hilom pa. Walay nangitag gubot.`

Search empty state:
- `Ambot asa na siya, Bai. Wala mi'y nakita.`

Generic error:
- `Sus, naay nisipyat.`

Destructive confirmation:
- `Pag sure oi?`
- Follow immediately with a plain-language explanation of what will be deleted and whether it can be restored.

Feature unavailable:
- `Puhon pa ni, Bai.`

## Bai & Sell

Canonical Marketplace parody/product name:

**Bai & Sell**

Until the Marketplace module exists, it must never appear as a working commerce surface. It must be clearly marked:

- `PUHON`
- `COMING SOON`

Canonical teaser copy:

`Palit. Baligya. Hangyo gamay. Walay atik.`

`Pangita og sulit nga deal gikan sa mga Bai sa imong lugar.`

Disabled CTA:

`Puhon pa`

Secondary copy:

`Tigoma sa ang budget, Bai.`

## Safety and clarity rule

Do not use joke-only labels for:
- password/security changes
- privacy controls
- blocking
- reporting abuse
- deleting accounts
- legal consent
- financial/payment actions

For those surfaces, use clear primary language. Meme copy may appear only as secondary supporting text when it cannot obscure the consequence.

## Accessibility rule

Visible humorous labels must keep plain semantic meaning in accessible labels when needed. Examples:
- `Hoy!` -> `aria-label="Notifications"`
- `Bai & Sell` -> supporting description `Marketplace, coming soon`
- `Lakaw sa ko` -> contextual logout form/action

## Current F2 shell scope

The F2 shell establishes only navigation vocabulary, product personality, responsive layout, and explicit coming-soon states. It does not create fake posts, fake friend counts, marketplace inventory, notification events, groups, or messaging state.

Database-backed social features advance in separate bounded tranches.
