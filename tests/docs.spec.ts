import { iconCatalog } from "../packages/icons/dist/catalog.js";
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("AI documentation publishes every guide, example, type reference and icon without requiring JavaScript", async ({
	request,
}) => {
	const index = await request.get("/llms.txt");
	expect(index.ok()).toBeTruthy();
	expect(await index.text()).toContain("docs/manifest.json");
	const manifest = await (await request.get("/docs/manifest.json")).json();
	expect(manifest.components.length).toBeGreaterThanOrEqual(38);
	const full = await (await request.get("/llms-full.txt")).text();
	for (const component of manifest.components) {
		const response = await request.get("/" + component.markdown);
		expect(response.ok()).toBeTruthy();
		const markdown = await response.text();
		expect(markdown).toContain("## Usage");
		expect(markdown).toContain("## Pitfalls");
		const example = await (await request.get("/" + component.example)).text();
		expect(markdown).toContain(example.trim());
		expect(full).toContain(example.trim());
		expect(example).toContain("export default function Example");
	}
	for (const path of [...manifest.guides, ...manifest.api]) expect((await request.get("/" + path)).ok()).toBeTruthy();
	const icons = await (await request.get("/" + manifest.icons)).json();
	expect(icons).toHaveLength(iconCatalog.length);
	expect(icons[0].keywords.length).toBeGreaterThan(0);
	expect(icons.find((icon: { name: string }) => icon.name === "Heart").variants).toContain("filled");
	expect(manifest.components.find((c: { slug: string }) => c.slug === "icons").exports).toHaveLength(
		iconCatalog.length,
	);
});
test("component guides retain deep links, keyboard navigation and readable mobile layout", async ({ page }) => {
	await page.goto("/?lang=zh#docs/dialog");
	await expect(page.getByRole("heading", { name: /Dialog$/, exact: true })).toBeVisible();
	await expect(page.getByRole("region", { name: "交互示例" })).toBeVisible();
	await expect(page.getByRole("link", { name: "Markdown ↗", exact: true })).toHaveAttribute(
		"href",
		"./docs/components/dialog.md",
	);
	await page.getByRole("link", { name: /^(选择器 )?Select$/, exact: true }).click();
	await expect(page).toHaveURL(/#docs\/select$/);
	await page.reload();
	await expect(page.getByRole("heading", { name: /^(选择器 )?Select$/, exact: true })).toBeVisible();
	const results = await new AxeBuilder({ page }).analyze();
	expect(results.violations).toEqual([]);
	await page.setViewportSize({ width: 320, height: 900 });
	expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBeTruthy();
	await page.getByRole("link", { name: "Markdown ↗", exact: true }).focus();
	await expect(page.getByRole("link", { name: "Markdown ↗", exact: true })).toBeFocused();
});
