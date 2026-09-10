import { test, expect } from "@playwright/test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { LineChart, DonutChart } from "../packages/charts/dist/index.js";

test("chart tables retain exact values and distinguish missing observations from zero", () => {
	const html = renderToStaticMarkup(
		createElement(LineChart, {
			title: "Observed requests",
			data: [
				{ label: "A", count: 0 },
				{ label: "B", count: null },
				{ label: "C", count: -1234.5 },
			],
			series: [{ key: "count", label: "Count" }],
			formatValue: (value) => `${value} requests`,
			labels: { missing: "Not measured" },
		}),
	);
	expect(html).toContain("0 requests");
	expect(html).toContain("-1234.5 requests");
	expect(html).toContain('aria-label="Not measured"');
	expect(html).not.toContain("mds-chart-empty");
});

test("donut rejects invalid and overflowing totals, while all-zero data is empty", () => {
	for (const values of [[-1], [Number.NaN], [Infinity], [Number.MAX_VALUE, Number.MAX_VALUE]]) {
		expect(() =>
			renderToStaticMarkup(
				createElement(DonutChart, {
					title: "Distribution",
					data: values.map((value, i) => ({ label: String(i), value })),
				}),
			),
		).toThrow(RangeError);
	}
	const html = renderToStaticMarkup(
		createElement(DonutChart, {
			title: "Distribution",
			data: [{ label: "A", value: 0 }],
			labels: { empty: "No observations" },
		}),
	);
	expect(html).toContain("No observations");
	expect(html).toContain("mds-chart-empty");
});

test("charts stay within narrow screens and expose the selected dataset as a table", async ({ page }) => {
	const errors: string[] = [];
	page.on("pageerror", (error) => errors.push(error.message));
	await page.goto("/");
	await page.getByRole("button", { name: "图表", exact: true }).click();
	const first = page.locator(".mds-chart").first();
	await expect(first.locator(".recharts-surface")).toBeVisible();
	await first.locator("summary").click();
	await expect(first.getByRole("table")).toContainText("1,240");
	await page.getByRole("radio", { name: "近24小时", exact: true }).click();
	await expect(first.getByRole("table")).toContainText("540");
	for (const width of [736, 390, 320]) {
		await page.setViewportSize({ width, height: 1000 });
		await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
		await expect(first.getByRole("table")).toBeVisible();
		const plot = first.locator(".mds-chart-plot");
		await expect.poll(async () => (await plot.boundingBox())?.width ?? 0).toBeGreaterThan(100);
	}
	expect(errors).toEqual([]);
});
