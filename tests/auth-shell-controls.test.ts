import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const authShell = readFileSync("app/components/auth-shell.tsx", "utf8");
const authShellCss = readFileSync("app/components/auth-shell.module.css", "utf8");
const languageCss = readFileSync("app/components/language-switcher.module.css", "utf8");

test("auth language and theme controls share one governed flex container", () => {
  assert.match(authShell, /className=\{styles\.controls\}/);
  assert.match(authShellCss, /display:\s*flex/);
  assert.match(authShellCss, /gap:\s*10px/);
  assert.match(authShellCss, /right:\s*18px/);
  assert.match(authShellCss, /\.controls\s+:global\(\.theme-toggle\)[\s\S]*position:\s*static/);
});

test("auth language switcher no longer uses hard-coded viewport offsets", () => {
  const authRule = languageCss.match(/\.auth\s*\{([^}]*)\}/)?.[1] ?? "";

  assert.doesNotMatch(authRule, /position:\s*fixed/);
  assert.doesNotMatch(authRule, /right:/);
  assert.doesNotMatch(authRule, /top:/);
  assert.match(languageCss, /\.auth \.summary \{[^}]*min-height:\s*44px/);
});

test("mobile auth controls retain separated 44px targets", () => {
  assert.match(authShellCss, /@media \(max-width: 720px\)[\s\S]*gap:\s*8px/);
  assert.match(languageCss, /\.auth \.summary \{[^}]*width:\s*44px;[^}]*min-height:\s*44px/);
  assert.match(authShellCss, /\.theme-toggle\)[\s\S]*min-height:\s*44px/);
});
