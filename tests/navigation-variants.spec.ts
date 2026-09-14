import { test, expect } from "@playwright/test";
test("drawer standard stays inline; modal closes and restores focus", async ({ page }) => {
	await page.goto("/docs/nav-drawer");
	const stage = page.getByLabel("Interactive example").locator(".docs-live-stage");
	await expect(stage.getByRole("navigation", { name: "Workspace navigation" })).toBeVisible();
	await expect(stage.getByRole("button", { name: "Open navigation", exact: true })).toHaveCount(0);
	await stage.getByRole("button", { name: "Docs", exact: true }).click();
	await expect(stage.getByRole("button", { name: "Docs", exact: true })).toHaveAttribute("aria-current", "page");
	await stage.getByRole("radio", { name: "Modal", exact: true }).click();
	const trigger = stage.getByRole("button", { name: "Open navigation", exact: true });
	await trigger.click();
	await expect(page.getByRole("dialog", { name: "Matrix", exact: true })).toBeVisible();
	await page.keyboard.press("Escape");
	await expect(trigger).toBeFocused();
});
test("navbar and rail examples are separate", async ({ page }) => {
	await page.goto("/docs/navigation");
	const navbarStage = page.getByLabel("Interactive example").locator(".docs-live-stage");
	await expect(navbarStage.locator(".mds-navbar")).toBeVisible();
	await expect(navbarStage.locator(".mds-navrail")).toHaveCount(0);
	await page.goto("/docs/nav-rail");
	const rail = page.getByLabel("Interactive example").locator(".mds-navrail");
	await expect(rail).toBeVisible();
	await expect(rail.locator(".mds-navitem-icon")).toHaveCount(3);
	await rail.getByRole("button", { name: "Knowledge and documentation", exact: true }).click();
	await expect(rail.getByRole("button", { name: "Knowledge and documentation", exact: true })).toHaveAttribute(
		"aria-current",
		"page",
	);
});
test("drawer and rail retain the same selected destination", async ({ page }) => {
	await page.goto("/docs/nav-drawer");
	const stage = page.getByLabel("Interactive example").locator(".docs-live-stage");
	await stage.getByRole("button", { name: "Docs", exact: true }).click();
	await stage.getByRole("radio", { name: "Rail", exact: true }).click();
	await expect(stage.locator(".mds-navrail")).toBeVisible();
	await expect(stage.getByRole("button", { name: "Docs", exact: true })).toHaveAttribute("aria-current", "page");
	await stage.getByRole("radio", { name: "Standard", exact: true }).click();
	await expect(stage.getByRole("button", { name: "Docs", exact: true })).toHaveAttribute("aria-current", "page");
});
test("rail uses short labels and reveals the full label on keyboard focus", async ({ page }) => {
	await page.goto("/docs/nav-rail");
	const stage = page.getByLabel("Interactive example").locator(".docs-live-stage");
	const item = stage.getByRole("button", { name: "Knowledge and documentation", exact: true });
	await expect(item.locator(".mds-navitem-label")).toHaveText("Knowledge");
	await page.keyboard.press("Tab");
	await item.focus();
	await expect(page.getByRole("tooltip")).toContainText("Knowledge and documentation");
	const heights = await page
		.getByLabel("Interactive example")
		.locator(".mds-navitem")
		.evaluateAll((items) => items.map((item) => item.getBoundingClientRect().height));
	expect(new Set(heights).size).toBe(1);
});
test("icon-only rail preserves accessible names, selection and tooltips", async ({ page }) => {
	await page.goto("/docs/nav-rail");
	const stage = page.getByLabel("Icon-only navigation links").locator(".docs-live-stage");
	const rail = stage.locator(".mds-navrail");
	await expect(rail).toHaveAttribute("data-collapsed", "true");
	const item = rail.getByRole("link", { name: "Navigation rail documentation", exact: true });
	await expect(item).toHaveAttribute("aria-current", "page");
	await expect(item.locator(".mds-navitem-label")).toHaveCSS("clip-path", "inset(50%)");
	const box = await item.boundingBox();
	expect(box!.width).toBeGreaterThanOrEqual(44);
	expect(box!.height).toBeGreaterThanOrEqual(44);
	await item.focus();
	await expect(page.getByRole("tooltip")).toContainText("Navigation rail documentation");
});
