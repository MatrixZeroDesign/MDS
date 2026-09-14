import { test, expect } from "@playwright/test";
test("mega menu escapes preview and switches sections", async ({ page }) => {
	await page.goto("/docs/mega-menu");
	const stage = page.locator(".docs-live-stage").first();
	await stage.getByRole("button", { name: "Products", exact: true }).click();
	const link = stage.getByRole("link", { name: "Components Consistent actions", exact: true });
	await expect(link).toBeVisible();
	expect(
		await link.evaluate((el) => {
			const r = el.getBoundingClientRect();
			return el.contains(document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2));
		}),
	).toBe(true);
	await expect(stage).toHaveCSS("overflow-y", "visible");
	await stage.getByRole("button", { name: "Resources", exact: true }).focus();
	await page.keyboard.press("Enter");
	await expect(stage.getByRole("link", { name: "Getting started", exact: true })).toBeVisible();
	await page.keyboard.press("Escape");
	await expect(stage.getByRole("link", { name: "Getting started", exact: true })).toBeHidden();
});
test("spotlight filters and executes with the keyboard", async ({ page }) => {
	await page.goto("/docs/spotlight");
	await page.getByRole("button", { name: "Quick search", exact: true }).first().click();
	const input = page.getByRole("combobox", { name: "Search actions", exact: true });
	await input.fill("settings");
	await expect(page.getByRole("option")).toHaveCount(1);
	await input.press("Enter");
	await expect(page.getByRole("dialog")).toBeHidden();
	await expect(page.getByRole("status").filter({ hasText: "Open settings" })).toBeVisible();
});
test("feature highlight dismisses and respects reduced motion", async ({ page }) => {
	await page.goto("/docs/feature-highlight");
	const hint = page.locator(".mds-feature-highlight").first();
	await page.emulateMedia({ reducedMotion: "reduce" });
	expect(await hint.evaluate((el) => getComputedStyle(el, "::before").animationName)).toBe("none");
	await hint.getByRole("button").click();
	await expect(hint).not.toHaveAttribute("data-active", "true");
});
