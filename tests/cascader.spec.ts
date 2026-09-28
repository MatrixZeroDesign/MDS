import { expect, test } from "@playwright/test";

test("cascader branch indicators use readable MDS icons in both directions", async ({ page }) => {
	await page.goto("/docs/cascader?lang=en");
	await page.locator(".mds-cascader > .mds-select-trigger").first().click();
	const china = page.getByRole("button", { name: "China", exact: true });
	const icon = china.locator(".mds-cascader-expand-icon");
	await expect(icon).toBeVisible();
	await expect(icon).toHaveAttribute("width", "18");
	await expect(icon).toHaveAttribute("height", "18");
	await expect(china).not.toContainText("›");

	await page.goto("/docs/cascader?lang=ar");
	await page.locator(".mds-cascader > .mds-select-trigger").first().click();
	const rtlBranch = page
		.locator(".mds-cascader-option")
		.filter({ has: page.locator(".mds-cascader-expand-icon") })
		.first();
	await expect(rtlBranch.locator(".mds-cascader-expand-icon")).toBeVisible();
	await expect(rtlBranch).not.toContainText("‹");
});
