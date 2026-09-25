import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("FaceBai governance public surface", () => {
  test("login keeps essential controls usable and governed", async ({ page }) => {
    await page.goto("/login", { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("textbox", { name: /email/i })).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();

    const submit = page.locator("[data-auth-submit]");
    await expect(submit).toBeVisible();
    await expect(submit).toHaveAttribute("data-facebai-action", "true");

    const box = await submit.boundingBox();
    expect(box).not.toBeNull();
    expect(box.height).toBeGreaterThanOrEqual(44);
  });

  test("reduced motion suppresses nonessential transition time", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/login", { waitUntil: "domcontentloaded" });

    const duration = await page.locator("[data-auth-submit]").evaluate((element) =>
      Number.parseFloat(getComputedStyle(element).transitionDuration || "0"),
    );

    expect(duration).toBeLessThanOrEqual(0.001);
  });

  test("login has no serious or critical axe violations in FaceBai-owned UI", async ({ page }) => {
    await page.goto("/login", { waitUntil: "domcontentloaded" });

    const results = await new AxeBuilder({ page })
      .exclude(".turnstile-widget")
      .analyze();

    const blocking = results.violations.filter((violation) =>
      violation.impact === "critical" || violation.impact === "serious",
    );

    expect(blocking, JSON.stringify(blocking, null, 2)).toEqual([]);
  });
});
