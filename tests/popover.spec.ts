import { test, expect } from "@playwright/test";
test("popover opens in theme scope, closes with Escape, and supports controlled state", async ({ page }) => {
	await page.goto("/docs/popover");
	const trigger = page.getByRole("button", { name: "Quick settings", exact: true });
	await trigger.click();
	const dialog = page.getByRole("dialog", { name: "Workspace settings", exact: true });
	await expect(dialog).toBeVisible();
	await expect(page.locator(".mds-portals .mds-popover")).toBeVisible();
	await expect(dialog.getByRole("textbox", { name: "Name", exact: true })).toBeFocused();
	await page.keyboard.press("Escape");
	await expect(dialog).toBeHidden();
	await expect(trigger).toBeFocused();
	await page.getByRole("button", { name: "View information", exact: true }).click();
	await expect(page.getByRole("dialog", { name: "Sync status", exact: true })).toBeVisible();
	await page.getByRole("button", { name: "Got it", exact: true }).click();
	await expect(page.getByRole("dialog", { name: "Sync status", exact: true })).toBeHidden();
});
