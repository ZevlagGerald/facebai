import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const page = readFileSync(new URL("../app/tambayan/page.tsx", import.meta.url), "utf8");
const shell = readFileSync(new URL("../app/components/social-shell.tsx", import.meta.url), "utf8");
const languageSwitcher = readFileSync(new URL("../app/components/language-switcher.tsx", import.meta.url), "utf8");
const css = readFileSync(new URL("../app/tambayan/tambayan.module.css", import.meta.url), "utf8");
const profilePage = readFileSync(new URL("../app/ako/page.tsx", import.meta.url), "utf8");
const publicProfilePage = readFileSync(new URL("../app/bai/[username]/page.tsx", import.meta.url), "utf8");
const editProfilePage = readFileSync(new URL("../app/ako/edit/page.tsx", import.meta.url), "utf8");
const editProfileForm = readFileSync(new URL("../app/components/profile-edit-form.tsx", import.meta.url), "utf8");
const wrangler = readFileSync(new URL("../wrangler.jsonc", import.meta.url), "utf8");

test("F2 GUI keeps primary navigation visible, labeled, localized, and state-honest", () => {
  assert.match(shell, /labelKey: "nav\.tambayan"[^\n]+icon: "home"[^\n]+href: "\/tambayan"/);
  assert.match(shell, /labelKey: "nav\.friends"[^\n]+comingSoon: true/);
  assert.match(shell, /labelKey: "nav\.groups"[^\n]+comingSoon: true/);
  assert.match(shell, /labelKey: "nav\.market"[^\n]+comingSoon: true/);
  assert.match(shell, /LanguageSwitcher locale=\{locale\}/);
  assert.match(shell, /t\("common\.notificationsComingSoon"\)/);
  assert.match(page, /t\("feed\.notificationsAria"\)/);
});

test("F2 GUI V2.1 uses separated social surfaces and distinct future-state semantics", () => {
  assert.match(css, /--social-canvas: #f5f2e9/);
  assert.match(css, /--social-surface: #fffdf8/);
  assert.match(css, /--social-puhon-bg: #fff1bd/);
  assert.match(css, /:global\(html\[data-theme='dark'\]\) \.shell/);
  assert.match(css, /--social-canvas: #111713/);
  assert.match(css, /--social-surface: #1d2721/);
  assert.match(css, /--social-surface-raised: #243028/);
  assert.doesNotMatch(css, /--social-canvas: #0b1f17/);
});

test("F2 GUI V2.1 composer communicates with icons and localized actions", () => {
  assert.match(page, /SocialIcon name="photo"/);
  assert.match(page, /SocialIcon name="friends"/);
  assert.match(page, /SocialIcon name="sparkles"/);
  assert.match(page, /className=\{styles\.composerState\}>\{t\("common\.puhon"\)\}/);
  assert.match(css, /\.composerActionIcon/);
});

test("F2 authenticated Tambayan never fabricates identity when profile loading fails", () => {
  assert.match(page, /\{ data: profile, error: profileError \} = await supabase/);
  assert.match(page, /if \(profileError \|\| !profile\)/);
  assert.match(page, /role="alert"/);
  assert.match(page, /ti\("profile\.loadFailedTitle"\)/);
  assert.match(page, /href="\/tambayan"[\s\S]*?ti\("common\.retry"\)/);
  assert.match(page, /const displayName = profile\.display_name\.trim\(\)/);
  assert.match(page, /const username = profile\.username/);
  assert.doesNotMatch(page, /profile\?\.display_name\?\.trim\(\) \|\| "Bai"/);
  assert.doesNotMatch(page, /profile\?\.username \|\| "bai"/);
});

test("F2 public profile distinguishes lookup failure from a true missing profile", () => {
  assert.match(publicProfilePage, /\{ data: profile, error: profileError \}/);
  assert.match(publicProfilePage, /if \(profileError\) \{[\s\S]*?<SocialShell/);
  assert.match(publicProfilePage, /ti\("profile\.publicLoadFailedTitle"\)/);
  assert.match(publicProfilePage, /href=\{`\/bai\/\$\{requestedUsername\}`\}[\s\S]*?ti\("common\.retry"\)/);
  assert.match(publicProfilePage, /if \(!profile\) notFound\(\)/);
});

test("F2 GUI V2.2 uses viewport workspace while keeping the feed readable", () => {
  assert.match(css, /max-width: 1820px/);
  assert.match(css, /grid-template-columns: minmax\(260px, 1fr\) minmax\(0, 720px\) minmax\(300px, 1fr\)/);
  assert.match(css, /\.leftRail \{ max-width: 310px; justify-self: start; \}/);
  assert.match(css, /\.rightRail \{ max-width: 340px; justify-self: end; \}/);
  assert.match(css, /grid-template-columns: minmax\(330px, 1fr\) auto minmax\(330px, 1fr\)/);
  assert.match(shell, /className=\{styles\.headerLeft\}/);
});

test("F2 GUI V2.2 differentiates destinations with stable semantic icon colors", () => {
  assert.match(css, /--icon-friends: #3f7fdd/);
  assert.match(css, /--icon-groups: #7b61d1/);
  assert.match(css, /--icon-market: #168f79/);
  assert.match(css, /--icon-photos: #d45f82/);
  assert.match(css, /--icon-fun: #c88713/);
  assert.match(shell, /data-tone=\{item\.tone\}/);
  assert.match(css, /\.railIcon\[data-tone='photos'\]/);
});

test("F2 header disclosures are exclusive so language and account cannot remain open together", () => {
  assert.match(shell, /<details className=\{styles\.accountMenu\} name="facebai-header-menu">/);
  assert.match(languageSwitcher, /name=\{variant === "social" \? "facebai-header-menu" : undefined\}/);
});

test("F2 shell keeps governed logout accessible inside the account menu", () => {
  assert.match(shell, /className=\{styles\.accountMenu\}/);
  assert.match(shell, /<form action=\{logout\}>/);
  assert.match(shell, /<AuthSubmitButton[\s\S]*?className=\{styles\.logout\}[\s\S]*?idleLabel=\{t\("common\.logout"\)\}[\s\S]*?pendingLabel=\{ti\("common\.loggingOut"\)\}/);
  assert.match(css, /\.accountPopover/);
  assert.match(css, /\.logout:focus-visible/);
});

test("F2 GUI retains engineered responsive gates and mobile bottom navigation", () => {
  assert.match(css, /@media \(max-width: 1400px\)/);
  assert.match(css, /@media \(max-width: 1080px\)/);
  assert.match(css, /@media \(max-width: 860px\)/);
  assert.match(css, /@media \(max-width: 720px\)/);
  assert.match(css, /grid-template-columns: repeat\(4, 1fr\)/);
});

test("F2 profile separates social identity from governed focused editing and keeps future content honest", () => {
  assert.match(profilePage, /actionHref="\/ako\/edit"/);
  assert.doesNotMatch(profilePage, /<form action=\{updateProfile/);
  assert.match(profilePage, /t\("profile\.postsAndFeed"\)/);
  assert.match(editProfilePage, /<ProfileEditForm/);
  assert.match(editProfileForm, /useActionState\(updateProfileWithState, initialState\)/);
  assert.match(editProfileForm, /AuthSubmitButton/);
  assert.match(editProfileForm, /GovernedDialog/);
  assert.match(editProfilePage, /ProfileMediaUploader kind="avatar"/);
  assert.match(editProfilePage, /ProfileMediaUploader kind="cover"/);
});

test("Cloudflare Preview configuration carries version metadata separately from production", () => {
  assert.match(wrangler, /"version_metadata"\s*:\s*\{\s*"binding"\s*:\s*"CF_VERSION_METADATA"\s*\}/s);
  assert.match(wrangler, /"previews"\s*:\s*\{\s*"version_metadata"\s*:\s*\{\s*"binding"\s*:\s*"CF_VERSION_METADATA"\s*\}\s*\}/s);
  assert.match(wrangler, /"preview_urls"\s*:\s*true/);
});
