import { test, expect } from "@playwright/test";
test("new visits and example code default to English", async ({ page }) => {
	await page.goto("/docs/button");
	await expect(page.getByRole("navigation", { name: "Site navigation" })).toBeVisible();
	await expect(
		page.getByRole("region", { name: "Interactive example" }).getByRole("button", { name: "Add", exact: true }),
	).toBeVisible();
	await expect(page.locator(".docs-reference-detail pre").first()).toContainText('locale = "en"');
	await expect(page.locator("html")).toHaveAttribute("lang", "en");
	await page.getByRole("button", { name: "Change language" }).click();
	await page.getByRole("menuitemradio", { name: /简体中文/ }).click();
	await expect(
		page.getByRole("region", { name: "交互示例" }).getByRole("button", { name: "添加", exact: true }),
	).toBeVisible();
	await expect(page.locator(".docs-reference-detail pre").first()).toContainText('locale = "zh"');
});
