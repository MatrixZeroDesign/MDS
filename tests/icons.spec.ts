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
	await page.setViewportSize({ width: 320, height: 900 });
	await page.goto("/?lang=zh#icons");
	await expect(page.locator(".docs-icon-tile")).toHaveCount(iconCatalog.length);
	await page.getByRole("textbox", { name: "搜索图标" }).fill("搜索");
	await expect(page.getByRole("button", { name: /^Search / })).toBeVisible();
	await page.getByRole("textbox", { name: "搜索图标" }).fill("zzzzzz");
	await expect(page.getByText("未找到匹配的图标，试试其他关键词或分类。")).toBeVisible();
	await page.getByRole("button", { name: "清除筛选" }).click();
	await page.getByRole("combobox", { name: "图标分类" }).click();
	await page.getByRole("option", { name: /安全/ }).click();
	const count = await page.locator(".docs-icon-tile").count();
	expect(count).toBeGreaterThan(10);
	expect(count).toBeLessThan(iconCatalog.length);
	await expect(page.getByRole("listbox")).toHaveCount(0);
	await expect(page.getByRole("combobox", { name: "图标分类" })).toBeFocused();
	await page.locator(".docs-icon-tile").first().focus();
	await page.keyboard.press("Enter");
	await expect(page.getByRole("dialog")).toBeVisible();
	expect(await page.getByRole("dialog").evaluate((node) => node.scrollWidth <= node.clientWidth + 1)).toBeTruthy();
	await expect(page.getByRole("dialog").locator("code")).toContainText("from '@matrixzero/icons'");
	await page.getByRole("dialog").getByRole("button", { name: "复制用法" }).focus();
	await page.keyboard.press("Escape");
	await expect(page.getByRole("dialog")).not.toBeVisible();
	await expect(page.locator(".docs-icon-tile").first()).toBeFocused();
});

test("filled variants use explicit geometry without changing decorative semantics", () => {
	const paired = iconCatalog.filter((entry) => "variants" in entry && entry.variants.includes("filled"));
	expect(paired.map((entry) => entry.name).sort()).toEqual(["Bell", "Bookmark", "Flag", "Heart", "Star"]);
	for (const entry of paired) {
		const Icon = Icons[entry.name];
		const outline = renderToStaticMarkup(createElement(Icon, { variant: "outlined" }));
		const filled = renderToStaticMarkup(createElement(Icon, { variant: "filled" }));
		expect(filled).toContain('data-variant="filled"');
		expect(filled).toContain('fill="currentColor" stroke="none"');
		expect(filled).toContain('aria-hidden="true"');
		expect(filled.match(/ d="[^"]+"/g)).not.toEqual(outline.match(/ d="[^"]+"/g));
	}
	const unsupported = renderToStaticMarkup(createElement(Icons.Share, { variant: "filled" }));
	expect(unsupported).toContain('data-variant="outlined"');
	expect(unsupported).toEqual(renderToStaticMarkup(createElement(Icons.Share)));
});

test("icon variants filter the catalog and toggle controls expose selected state", async ({ page }) => {
	await page.goto("/#icons");
	const like = page.getByRole("button", { name: "Like", exact: true });
	await expect(like).toHaveAttribute("aria-pressed", "false");
	await expect(like.locator("svg")).toHaveAttribute("data-variant", "outlined");
	await like.click();
	await expect(like).toHaveAttribute("aria-pressed", "true");
	await expect(like.locator("svg")).toHaveAttribute("data-variant", "filled");
	await like.focus();
	await page.keyboard.press("Space");
	await expect(like).toHaveAttribute("aria-pressed", "false");
	await page.getByRole("radio", { name: "Filled", exact: true }).click();
	await expect(page.locator(".docs-icon-tile")).toHaveCount(5);
	await page.getByRole("button", { name: /^Heart / }).click();
	await expect(page.getByRole("dialog").locator("pre")).toContainText('variant="filled"');
	await expect(page.locator(".docs-icon-preview svg")).toHaveCount(4);
	for (const preview of await page.locator(".docs-icon-preview svg").all())
		await expect(preview).toHaveAttribute("data-variant", "filled");
	await page.keyboard.press("Escape");
	await page.getByRole("radio", { name: "Outlined", exact: true }).click();
	await page.getByRole("textbox", { name: "Search icons" }).fill("share");
	await expect(page.getByRole("button", { name: /^Share Communication$/ })).toBeVisible();
});
