import { test, expect } from "@playwright/test";
test("docs default to system, react to system changes and remember explicit choices", async ({ page }) => {
	await page.emulateMedia({ colorScheme: "dark" });
	await page.goto("/#system");
	const root = page.locator(".mds-root").first();
	await expect(root).toHaveAttribute("data-mds-mode", "system");
	await expect(root).toHaveCSS("color-scheme", "dark");
	await page.emulateMedia({ colorScheme: "light" });
	await expect(root).toHaveCSS("color-scheme", "light");
	await page.getByRole("button", { name: "Toggle color theme" }).click();
	await page.getByRole("menuitemradio", { name: "Dark", exact: true }).click();
	await expect(root).toHaveAttribute("data-mds-mode", "dark");
	await page.reload();
	await expect(root).toHaveAttribute("data-mds-mode", "dark");
	await page.getByRole("button", { name: "Toggle color theme" }).click();
	await page.getByRole("menuitemradio", { name: "Follow system", exact: true }).click();
	await page.reload();
	await expect(root).toHaveAttribute("data-mds-mode", "system");
	await expect(root).toHaveCSS("color-scheme", "light");
	await page.getByRole("button", { name: "Color palette" }).click();
	await page.getByRole("menuitem", { name: "Monochrome", exact: true }).click();
	await expect(root).toHaveAttribute("data-mds-palette", "mono");
	await expect(root).toHaveCSS("--mds-accent", "#202020");
	await page.emulateMedia({ colorScheme: "dark" });
	await expect(root).toHaveCSS("--mds-accent", "#eeeeee");
	await page.setViewportSize({ width: 320, height: 900 });
	expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBeTruthy();
});
test("invalid or unavailable theme storage falls back safely", async ({ page }) => {
	await page.addInitScript(() => {
		localStorage.setItem("mds.docs.mode", "invalid");
		Storage.prototype.setItem = () => {
			throw new Error("Storage unavailable");
		};
	});
	await page.goto("/#docs/start");
	await expect(page.locator(".mds-root").first()).toHaveAttribute("data-mds-mode", "system");
	await page.getByRole("button", { name: "Toggle color theme" }).click();
	await page.getByRole("menuitemradio", { name: "Light", exact: true }).click();
	await expect(page.locator(".mds-root").first()).toHaveAttribute("data-mds-mode", "light");
});
