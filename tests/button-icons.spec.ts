import { test, expect } from "@playwright/test";

test("button composes leading and trailing icons across sizes", async ({ page }) => {
	await page.goto("/docs/button");
	const example = page.getByRole("region", { name: "Interactive example" }).first();
	const button = example.getByRole("button", { name: "Add" });
	await expect(button.locator('.mds-button-icon[data-position="leading"]')).toHaveCount(1);
	await expect(button.locator('.mds-button-icon[data-position="trailing"]')).toHaveCount(1);
	await expect(button.locator(".mds-button-label")).toHaveText("Add");
	const [leading, trailing] = await Promise.all([
		button.locator('.mds-button-icon[data-position="leading"]').boundingBox(),
		button.locator('.mds-button-icon[data-position="trailing"]').boundingBox(),
	]);
	expect(leading?.width).toBe(trailing?.width);
	await expect(page.getByRole("cell", { name: "leadingIcon" })).toBeVisible();
	await expect(page.getByRole("cell", { name: "trailingIcon" })).toBeVisible();
});
