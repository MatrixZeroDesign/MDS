import { test, expect } from "@playwright/test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import * as Icons from "../packages/icons/dist/index.js";
import { iconCatalog } from "../packages/icons/dist/catalog.js";
test("icon catalog matches all unique drawings and preserves accessibility", () => {
	expect(iconCatalog.length).toBeGreaterThanOrEqual(320);
	expect(iconCatalog.map((i) => i.name).sort()).toEqual(Object.keys(Icons).sort());
	const drawings = new Map<string, string>();
	for (const item of iconCatalog) {
		const Icon = Icons[item.name];
		const svg = renderToStaticMarkup(createElement(Icon));
		expect(svg).toContain('aria-hidden="true"');
		expect(svg).toContain('viewBox="0 0 24 24"');
		expect(svg).not.toContain("NaN");
		expect(drawings.get(svg), item.name + " duplicates " + drawings.get(svg)).toBeUndefined();
		drawings.set(svg, item.name);
		const labelled = renderToStaticMarkup(
			createElement(Icon, { "aria-label": item.name, size: 24, absoluteStrokeWidth: true }),
		);
		expect(labelled).toContain('role="img"');
		expect(labelled).not.toContain("aria-hidden");
		expect(item.keywords.length).toBeGreaterThan(0);
	}
});
test("icon search understands Chinese, category filters and keyboard usage dialogs", async ({ page }) => {
	await page.goto("/#icons");
	await expect(page.locator(".docs-icon-tile")).toHaveCount(320);
	await page.getByRole("textbox", { name: "搜索图标" }).fill("搜索");
	await expect(page.getByRole("button", { name: /^Search / })).toBeVisible();
	await page.getByRole("textbox", { name: "搜索图标" }).fill("zzzzzz");
	await expect(page.getByText("未找到匹配的图标，试试其他关键词或分类。")).toBeVisible();
	await page.getByRole("button", { name: "清除筛选" }).click();
	await page.getByRole("combobox", { name: "图标分类" }).selectOption("security");
	const count = await page.locator(".docs-icon-tile").count();
	expect(count).toBeGreaterThan(10);
	expect(count).toBeLessThan(320);
	await page.locator(".docs-icon-tile").first().focus();
	await page.keyboard.press("Enter");
	await expect(page.getByRole("dialog")).toBeVisible();
	await expect(page.getByRole("dialog").locator("code")).toContainText("from '@matrixzero/icons'");
	await page.keyboard.press("Escape");
	await expect(page.getByRole("dialog")).not.toBeVisible();
});
