import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("Tabs are underlined content navigation; SegmentedControl owns size and pill choices", async ({ page }) => {
	await page.goto("/docs/tabs");
	const preview = page.getByRole("region", { name: "Interactive example" });
	const guide = preview.getByRole("tab", { name: "Guide", exact: true });
	const indicator = preview.locator(".mds-tab-indicator");
	await expect(indicator).toHaveCount(1);
	await expect(indicator).toHaveAttribute("data-visible", "true");
	const initialIndicatorBox = await indicator.boundingBox();
	await expect(indicator).toHaveCSS("border-radius", "999px");
	await expect(indicator).toHaveCSS("transition-property", "transform, width, opacity");
	await expect(indicator).toHaveCSS("transition-duration", "0.18s, 0.18s, 0.12s");
	await guide.click();
	await expect(preview.getByRole("tabpanel")).toHaveText("Design guide");
	await expect(guide).toHaveCSS("border-bottom-width", "0px");
	await expect(guide).toHaveCSS("border-radius", "0px");
	await expect(indicator).toHaveCSS("height", "2px");
	const guideBox = await guide.boundingBox();
	await expect.poll(async () => (await indicator.boundingBox())!.x).toBeGreaterThan(initialIndicatorBox!.x);
	const indicatorBox = await indicator.boundingBox();
	expect(Math.abs(indicatorBox!.width - guideBox!.width)).toBeLessThan(1);
	await expect(preview.locator(".mds-segment-indicator")).toHaveCount(0);
	expect((await new AxeBuilder({ page }).include(".docs-live-stage").analyze()).violations).toEqual([]);
	await page.goto("/docs/segmented-control");
	const shapeComparison = page.getByRole("region", { name: "Shape comparison" });
	const group = shapeComparison.getByRole("radiogroup").nth(1);
	await expect(group).toHaveAttribute("data-shape", "pill");
	await expect(group).toHaveCSS("border-radius", "999px");
	const largeGroup = page.getByRole("region", { name: "Size comparison" }).getByRole("radiogroup").nth(2);
	await expect(largeGroup).toHaveAttribute("data-size", "lg");
	await expect(largeGroup.getByRole("radio").first()).toHaveCSS("min-height", "44px");
});

test("TabList exposes boundary-aware scroll controls and reveals the active tab", async ({ page }) => {
	await page.goto("/docs/tabs");
	const preview = page.getByRole("region", { name: "Interactive example" });
	const shell = preview.locator(".mds-tabs-scroll-shell");
	const list = preview.getByRole("tablist");
	const indicator = preview.locator(".mds-tab-indicator");

	await expect(shell.getByRole("button", { name: /Scroll tabs/ })).toHaveCount(0);
	await shell.evaluate((element) => {
		(element as HTMLElement).style.width = "250px";
		for (const tab of element.querySelectorAll<HTMLElement>('[role="tab"]')) tab.style.width = "190px";
	});

	const left = shell.getByRole("button", { name: "Scroll tabs left" });
	const right = shell.getByRole("button", { name: "Scroll tabs right" });
	await expect(left).toBeVisible();
	await expect(right).toBeVisible();
	await expect(left).toBeDisabled();
	await expect(right).toBeEnabled();
	await expect(list).toHaveCSS("scrollbar-width", "none");
	await expect(shell).not.toHaveAttribute("data-can-scroll-left", "true");
	await expect(shell).toHaveAttribute("data-can-scroll-right", "true");
	expect(await shell.evaluate((element) => getComputedStyle(element, "::after").pointerEvents)).toBe("none");
	await expect.poll(() => shell.evaluate((element) => getComputedStyle(element, "::after").opacity)).toBe("1");

	await right.click();
	await expect.poll(() => list.evaluate((element) => element.scrollLeft)).toBeGreaterThan(100);
	await right.click();
	await expect.poll(() => list.evaluate((element) => element.scrollLeft)).toBeGreaterThan(190);
	await expect(left).toBeEnabled();
	await expect(shell).toHaveAttribute("data-can-scroll-left", "true");
	await expect(shell).not.toHaveAttribute("data-can-scroll-right", "true");
	await expect.poll(() => shell.evaluate((element) => getComputedStyle(element, "::before").opacity)).toBe("1");
	await expect.poll(() => shell.evaluate((element) => getComputedStyle(element, "::after").opacity)).toBe("0");

	await list.evaluate((element) => element.scrollTo({ left: 0, behavior: "auto" }));
	await expect(left).toBeDisabled();
	const usage = preview.getByRole("tab", { name: "Usage", exact: true });
	const guide = preview.getByRole("tab", { name: "Guide", exact: true });
	await usage.press("ArrowRight");
	await expect(guide).toHaveAttribute("data-state", "active");
	await expect.poll(() => list.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
	await expect(indicator).toHaveCount(1);
	await expect
		.poll(async () => {
			const [listBox, activeBox] = await Promise.all([list.boundingBox(), guide.boundingBox()]);
			return Boolean(
				listBox &&
					activeBox &&
					activeBox.x >= listBox.x - 1 &&
					activeBox.x + activeBox.width <= listBox.x + listBox.width + 1,
			);
		})
		.toBe(true);

	await page.emulateMedia({ reducedMotion: "reduce" });
	await expect(indicator).toHaveCSS("transition-duration", "0s");

	await list.evaluate((element) => element.setAttribute("data-orientation", "vertical"));
	await expect(shell).toHaveAttribute("data-orientation", "vertical");
	await expect(shell.getByRole("button", { name: /Scroll tabs/ })).toHaveCount(0);
});

test("scrollable TabList uses physical boundaries in RTL", async ({ page }) => {
	await page.goto("/docs/tabs");
	const preview = page.getByRole("region", { name: "Interactive example" });
	const shell = preview.locator(".mds-tabs-scroll-shell");
	const list = preview.getByRole("tablist");
	await list.evaluate((element) => {
		element.style.direction = "rtl";
	});
	await shell.evaluate((element) => {
		(element as HTMLElement).style.width = "250px";
		for (const tab of element.querySelectorAll<HTMLElement>('[role="tab"]')) tab.style.width = "190px";
	});

	const left = shell.getByRole("button", { name: "Scroll tabs left" });
	const right = shell.getByRole("button", { name: "Scroll tabs right" });
	await expect(left).toBeEnabled();
	await expect(right).toBeDisabled();
	await left.click();
	await expect.poll(() => list.evaluate((element) => element.scrollLeft)).toBeLessThan(0);
	await expect(right).toBeEnabled();
});
