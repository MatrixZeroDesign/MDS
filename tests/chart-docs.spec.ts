import { test, expect } from "@playwright/test";
import ts from "typescript";
test("every gallery chart has matching executable example code and a type-specific API link", async ({ page }) => {
	await page.goto("/charts?lang=zh");
	const cards = page.locator(".docs-grid > .docs-card");
	await expect(cards).toHaveCount(7);
	for (const card of await cards.all()) {
		await card.locator("details.docs-code > summary").click();
		const code = await card.locator("details.docs-code code").innerText();
		expect(code).toContain("export default function Example");
		const output = ts.transpileModule(code, { compilerOptions: { jsx: ts.JsxEmit.ReactJSX }, reportDiagnostics: true });
		expect(output.diagnostics).toEqual([]);
		await expect(card.getByRole("link", { name: "Chart API →" })).toHaveAttribute("href", /^\/charts\//);
	}
	await page.getByRole("radio", { name: "近24小时", exact: true }).click();
	await expect(cards.first().locator("details.docs-code code")).toContainText("540");
	const nav = page.getByRole("navigation", { name: "主导航" });
	for (const name of ["LineChart", "AreaChart", "BarChart", "DonutChart"]) {
		await nav.getByRole("link", { name: new RegExp(name + "$"), exact: true }).click();
		await expect(page.getByRole("heading", { name: new RegExp(name + "$"), exact: true })).toBeVisible();
		await expect(page.getByRole("region", { name: "交互示例" }).locator(".mds-chart")).toBeVisible();
		await expect(page.getByRole("heading", { name: "API", exact: true })).toBeVisible();
		await expect(page.locator(".docs-reference-detail pre code").first()).toContainText(`import { ${name} }`);
		await expect(
			page.getByRole("navigation", { name: "全站导航" }).getByRole("link", { name: "图表", exact: true }),
		).toHaveAttribute("aria-current", "page");
	}
	await page.reload();
	await expect(page.getByRole("heading", { name: /DonutChart$/, exact: true })).toBeVisible();
	await page.setViewportSize({ width: 320, height: 900 });
	await page.getByRole("button", { name: /打开导航|Open navigation/ }).click();
	await page
		.getByRole("dialog")
		.getByRole("link", { name: /BarChart$/, exact: true })
		.click();
	await expect(page.getByRole("dialog")).toHaveCount(0);
	await expect(page.getByRole("heading", { name: /BarChart$/, exact: true })).toBeVisible();
	expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBeTruthy();
});
