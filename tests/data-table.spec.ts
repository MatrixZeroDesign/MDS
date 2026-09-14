import { test, expect } from "@playwright/test";
test("data table virtualizes, sorts and retains selection across scroll", async ({ page }) => {
	await page.goto("/docs/data-table");
	const table = page.locator(".mds-data-table").first();
	const viewport = page.locator(".mds-data-table-viewport").first();
	await expect(table).toHaveAttribute("aria-rowcount", "10001");
	expect(await table.locator("tbody tr").count()).toBeLessThan(40);
	await table.getByRole("checkbox", { name: "Select Project 1", exact: true }).check();
	await viewport.evaluate((el) => {
		el.scrollTop = el.scrollHeight;
	});
	await expect(table.getByRole("checkbox", { name: "Select Project 10000", exact: true })).toBeVisible();
	expect(await table.locator("tbody tr").count()).toBeLessThan(40);
	await viewport.evaluate((el) => {
		el.scrollTop = 0;
	});
	await expect(table.getByRole("checkbox", { name: "Select Project 1", exact: true })).toBeChecked();
	await table.getByRole("button", { name: "ID", exact: true }).click();
	await table.getByRole("button", { name: "ID", exact: true }).click();
	await expect(table.locator("th[aria-sort=descending]")).toContainText("ID");
	await expect(table.getByRole("checkbox", { name: "Select Project 10000", exact: true })).toBeVisible();
});
test("pinned columns, details, grouping and row actions work", async ({ page }) => {
	await page.goto("/docs/data-table");
	const pinned = page.getByRole("table", { name: "Projects · pinned", exact: true });
	const before = await pinned.locator('tbody td[data-pinned="start"]').first().boundingBox();
	await pinned.locator("..").evaluate((el) => {
		el.scrollLeft = 250;
	});
	const after = await pinned.locator('tbody td[data-pinned="start"]').first().boundingBox();
	expect(Math.abs(after!.x - before!.x)).toBeLessThan(1);
	const expanded = page.getByRole("table", { name: "Projects · expanded", exact: true });
	await expanded.getByRole("button", { name: "Expand details: Design workspace", exact: true }).click();
	await expect(expanded.getByText("Project details stay within the table context.")).toBeVisible();
	await expect(
		page.getByRole("table", { name: "Projects · grouped", exact: true }).getByText("Design (2)", { exact: true }),
	).toBeVisible();
	const actions = page.getByRole("table", { name: "Projects · actions", exact: true });
	await actions.getByText("Design workspace", { exact: true }).click();
	await expect(page.getByRole("status").filter({ hasText: "Open: Design workspace" })).toBeVisible();
	await actions.getByRole("button", { name: "Edit", exact: true }).first().click();
	await expect(page.getByRole("status").filter({ hasText: "Edit: Design workspace" })).toBeVisible();
});
