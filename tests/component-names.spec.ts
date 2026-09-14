import { test, expect } from "@playwright/test";
test("Chinese component and chart names lead menus and page titles while API exports remain unchanged", async ({
	page,
}) => {
	await page.goto("/docs/button?lang=zh");
	await expect(
		page.getByRole("navigation", { name: "主导航" }).getByRole("link", { name: "按钮 Button", exact: true }),
	).toBeVisible();
	await expect(page.getByRole("heading", { name: "按钮 Button", exact: true })).toBeVisible();
	await expect(page.locator(".docs-reference-detail pre").first()).toContainText("import { Button }");
	await page.goto("/charts/line-chart?lang=zh");
	await expect(
		page.getByRole("navigation", { name: "主导航" }).getByRole("link", { name: "折线图 LineChart", exact: true }),
	).toBeVisible();
	await expect(page.getByRole("heading", { name: "折线图 LineChart", exact: true })).toBeVisible();
	await page.getByRole("button", { name: "Change language" }).click();
	await page.getByRole("menuitemradio", { name: /English/ }).click();
	await expect(page.getByRole("heading", { name: "LineChart", exact: true })).toBeVisible();
});
