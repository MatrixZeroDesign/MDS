import { test, expect } from "@playwright/test";
test("sizes and colors share comparison examples with one code toggle", async ({ page }) => {
	await page.goto("/docs/avatar-group");
	const sizes = page.getByRole("region", { name: "Size comparison", exact: true });
	await expect(sizes.locator(".mds-avatar-group")).toHaveCount(3);
	await expect(sizes.getByRole("button", { name: "Code", exact: true })).toHaveCount(1);
	await sizes.getByRole("button", { name: "Code", exact: true }).click();
	await expect(sizes.locator("pre")).toContainText("size={item.value}");
	await page.goto("/docs/badge");
	const colors = page.getByRole("region", { name: "Color comparison", exact: true });
	await expect(colors.locator(".mds-badge")).toHaveCount(4);
	await expect(colors.getByRole("button", { name: "Code", exact: true })).toHaveCount(1);
});
test("comparison pages omit duplicate playground selectors", async ({ page }) => {
	for (const slug of ["atmosphere", "avatar-group", "button", "badge", "area-chart"]) {
		await page.goto("/docs/" + slug);
		await expect(page.locator(".docs-live-example").first()).toBeVisible();
		await expect(page.getByRole("group", { name: "Example settings", exact: true })).toHaveCount(0);
		await expect(
			page.locator(".docs-example-code").first().getByRole("button", { name: "Code", exact: true }),
		).toBeVisible();
	}
});
