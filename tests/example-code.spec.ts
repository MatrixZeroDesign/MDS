import { test, expect } from "@playwright/test";
test("each example has independently toggled code", async ({ page }) => {
	await page.goto("/docs/button");
	const examples = page.locator(".docs-live-example");
	await examples.first().waitFor();
	expect(await examples.count()).toBeGreaterThan(2);
	await expect(examples.nth(0).locator("pre")).toBeHidden();
	await expect(examples.nth(1).locator("pre")).toBeHidden();
	await examples.nth(1).getByRole("button", { name: "Code", exact: true }).click();
	await expect(examples.nth(1).locator("pre")).toBeVisible();
	await expect(examples.nth(0).locator("pre")).toBeHidden();
	await expect(examples.nth(1).locator("pre")).toContainText("variant={item.value}");
	await examples.nth(1).getByRole("button", { name: "Code", exact: true }).click();
	await expect(examples.nth(1).locator("pre")).toBeHidden();
});
