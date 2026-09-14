import { test, expect } from "@playwright/test";
test("clean routes support direct load, refresh, links, history and legacy URLs", async ({ page }) => {
	await page.goto("/docs/nav-rail");
	await expect(page.getByRole("heading", { name: "NavRail / NavItem / NavLink", exact: true })).toBeVisible();
	await page.reload();
	await expect(page.locator(".docs-live-example")).toHaveCount(3);
	const second = page.locator(".docs-live-example").nth(1);
	await expect(second.getByRole("radio")).toHaveCount(0);
	await expect(second.locator(".mds-navrail")).toHaveAttribute("data-collapsed", "true");
	await expect(second.getByRole("button", { name: "Copy code", exact: true })).toBeVisible();
	await second.getByRole("link", { name: "Theme settings", exact: true }).click();
	await expect(page).toHaveURL(/\/docs\/theme$/);
	await page.goBack();
	await expect(page).toHaveURL(/\/docs\/nav-rail$/);
	await page.goto("/#docs/button");
	await expect(page).toHaveURL(/\/docs\/button$/);
	await expect(page.locator(".docs-live-example").first()).toBeVisible();
});
