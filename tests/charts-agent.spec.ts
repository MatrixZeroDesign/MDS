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
	await page.goto("/#system");
	await page.getByRole("link", { name: "图表", exact: true }).click();
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

test("donut tooltip paints above its center total", async ({ page }) => {
	await page.goto("/#charts");
	const donut = page.locator(".mds-chart-donut");
	await donut.scrollIntoViewIfNeeded();
	const point = await donut
		.locator(".recharts-pie-sector path")
		.first()
		.evaluate((path: SVGPathElement) => {
			const point = path.getPointAtLength(path.getTotalLength() * 0.25);
			const screen = new DOMPoint(point.x, point.y).matrixTransform(path.getScreenCTM()!);
			return { x: screen.x, y: screen.y };
		});
	await page.mouse.move(point.x, point.y);
	await expect(donut.locator(".mds-chart-tooltip")).toBeVisible();
	await expect(donut.locator(".mds-chart-tooltip")).toContainText("64");
	// Enable hit testing on these noninteractive layers only while checking actual overlapping paint order.
	const tooltipWins = await donut.evaluate((plot) => {
		const tip = plot.querySelector<HTMLElement>(".recharts-tooltip-wrapper")!;
		const total = plot.querySelector<HTMLElement>(".mds-chart-total")!;
		const a = tip.getBoundingClientRect(),
			b = total.getBoundingClientRect();
		const left = Math.max(a.left, b.left),
			right = Math.min(a.right, b.right);
		const top = Math.max(a.top, b.top),
			bottom = Math.min(a.bottom, b.bottom);
		if (left >= right || top >= bottom) throw new Error("Tooltip regression fixture must overlap the total");
		tip.style.pointerEvents = "auto";
		total.style.pointerEvents = "auto";
		const front = document.elementFromPoint((left + right) / 2, (top + bottom) / 2);
		tip.style.removeProperty("pointer-events");
		total.style.removeProperty("pointer-events");
		return tip.contains(front);
	});
	expect(tooltipWins).toBe(true);
});

test("dataset motion keeps exact geometry and values, and cancels when reduced motion is enabled", async ({ page }) => {
	await page.emulateMedia({ reducedMotion: "no-preference" });
	await page.addInitScript(() => {
		const animate = Element.prototype.animate;
		Element.prototype.animate = function (...args) {
			const animation = animate.apply(this, args);
			if (this.matches(".recharts-line, .recharts-area, .recharts-bar, .recharts-pie")) animation.pause();
			return animation;
		};
	});
	await page.goto("/#charts");
	const first = page.locator(".mds-chart").first();
	await expect(first.locator(".recharts-line-curve").first()).toBeVisible();
	await first.locator("summary").click();
	await page.getByRole("radio", { name: "近24小时", exact: true }).click();
	await expect(first.getByRole("table")).toContainText("540");
	const curve = first.locator(".recharts-line-curve").first();
	const committedPath = await curve.getAttribute("d");
	expect(committedPath).toBeTruthy();
	const mark = first.locator(".recharts-line").first();
	expect(await mark.evaluate((el) => el.getAnimations().some((a) => a.playState === "paused"))).toBe(true);
	await page.emulateMedia({ reducedMotion: "reduce" });
	await expect.poll(() => mark.evaluate((el) => el.getAnimations().length)).toBe(0);
	await expect(curve).toHaveAttribute("d", committedPath!);
	await page.getByRole("radio", { name: "近7天", exact: true }).click();
	await expect(first.getByRole("table")).toContainText("1,240");
	expect(await mark.evaluate((el) => el.getAnimations().length)).toBe(0);
});
