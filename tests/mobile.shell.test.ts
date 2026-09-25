import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const shell = readFileSync(new URL("../app/components/social-shell.tsx", import.meta.url), "utf8");
const mobileCss = readFileSync(new URL("../app/components/social-shell-mobile.module.css", import.meta.url), "utf8");

test("F2 mobile shell uses a dedicated viewport-level five-destination bottom navigation", () => {
  assert.match(shell, /const mobileNav:[\s\S]*?labelKey: "nav\.profile"[\s\S]*?href: "\/ako"/);
  assert.match(shell, /<\/header>\s*<nav className=\{mobileStyles\.mobileBottomNav\}/);
  assert.match(mobileCss, /grid-template-columns: repeat\(5, minmax\(0, 1fr\)\)/);
  assert.match(mobileCss, /position: fixed/);
  assert.match(mobileCss, /bottom: 0/);
  assert.match(mobileCss, /safe-area-inset-bottom/);
});

test("F2 mobile shell removes the compressed desktop nav and full-width search row", () => {
  assert.match(shell, /className=\{`\$\{styles\.topnav\} \$\{mobileStyles\.desktopTopNav\}`\}/);
  assert.match(shell, /className=\{`\$\{styles\.search\} \$\{mobileStyles\.desktopSearch\}`\}/);
  assert.match(mobileCss, /\.desktopTopNav,[\s\S]*?\.desktopSearch[\s\S]*?display: none !important/);
  assert.match(shell, /className=\{mobileStyles\.mobileSearch\}/);
  assert.match(shell, /aria-label=\{`\$\{t\("nav\.searchPlaceholder"\)\}: \$\{t\("common\.comingSoon"\)\}`\}/);
});

test("F2 mobile future destinations stay state-honest without large PUHON badges", () => {
  assert.match(shell, /className=\{`\$\{mobileStyles\.mobileNavItem\} \$\{mobileStyles\.mobileNavDisabled\}`\}/);
  assert.match(shell, /aria-label=\{`\$\{label\}: \$\{helper\}, \$\{t\("common\.comingSoon"\)\}`\}/);
  assert.match(shell, /mobilePuhonDot/);
  assert.doesNotMatch(mobileCss, /mobilePuhon[^\n]*font-size/);
});

test("F2 mobile feed reserves safe space above fixed navigation", () => {
  assert.match(shell, /className=\{`\$\{styles\.layout\} \$\{mobileStyles\.mobileLayout\}`\}/);
  assert.match(mobileCss, /\.mobileLayout[\s\S]*?padding-bottom: calc\(84px \+ env\(safe-area-inset-bottom\)\)/);
});
