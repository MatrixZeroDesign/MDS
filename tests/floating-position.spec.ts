import { test, expect, type Locator, type Page } from "@playwright/test";

async function expectAnchoredAfterScroll(page: Page, trigger: Locator, surface: Locator) {
	await expect(surface).toBeVisible();
	await page.waitForTimeout(250);
	const offset = async () => {
		const triggerBox = await trigger.boundingBox();
		const surfaceBox = await surface.boundingBox();
		return Math.round(surfaceBox!.y - (triggerBox!.y + triggerBox!.height));
	};
	const before = await offset();
	await page.evaluate(() => window.scrollBy(0, 40));
	await expect.poll(offset).toBe(before);
}

test("popover follows its trigger when the document scrolls", async ({ page }) => {
	await page.goto("/docs/popover");
	const trigger = page.getByRole("button", { name: "Quick settings", exact: true });
	await trigger.click();
	const surface = page.getByRole("dialog", { name: "Workspace settings" });
	await expect(surface).toHaveAttribute("data-placement", "bottom-start");
	await expectAnchoredAfterScroll(page, trigger, surface);
});

test("tooltip follows its trigger and stays within the viewport", async ({ page }) => {
	await page.goto("/docs/tooltip");
	const trigger = page
		.getByRole("region", { name: "Interactive example" })
		.getByRole("button", { name: "Local save", exact: true });
	await trigger.focus();
	const tooltip = page.getByRole("tooltip");
	await expect(tooltip).toBeVisible();
	const before = await Promise.all([trigger.boundingBox(), tooltip.boundingBox()]);
	await page.evaluate(() => window.scrollBy(0, 40));
	await expect
		.poll(async () => {
			const [triggerBox, tooltipBox] = await Promise.all([trigger.boundingBox(), tooltip.boundingBox()]);
			return Math.round(tooltipBox!.y - triggerBox!.y) === Math.round(before[1]!.y - before[0]!.y);
		})
		.toBeTruthy();
	const box = await tooltip.boundingBox();
	expect(box!.x).toBeGreaterThanOrEqual(8);
	expect(box!.x + box!.width).toBeLessThanOrEqual((await page.evaluate(() => innerWidth)) - 8);
});

test("select and dropdown use the shared anchored positioning behavior", async ({ page }) => {
	await page.goto("/docs/select");
	const select = page.locator(".docs-live-stage .mds-select-trigger").first();
	await select.click();
	await expectAnchoredAfterScroll(page, select, page.getByRole("listbox"));
	await page.keyboard.press("Escape");

	await page.goto("/docs/dropdown-menu");
	const menuTrigger = page
		.getByRole("region", { name: "Interactive example" })
		.getByRole("button", { name: "Actions", exact: true });
	await menuTrigger.click();
	await expectAnchoredAfterScroll(page, menuTrigger, page.getByRole("menu"));
});

test("explicit and automatic placements resolve through the shared engine", async ({ page }) => {
	await page.goto("/docs/tooltip");
	const immediate = page
		.getByRole("region", { name: "Immediate tooltip" })
		.getByRole("button", { name: "Local save", exact: true });
	await immediate.focus();
	await expect(page.getByRole("tooltip")).toHaveAttribute("data-placement", "right");

	await page.goto("/docs/popover");
	const trigger = page.getByRole("button", { name: "View information", exact: true });
	await trigger.click();
	const surface = page.getByRole("dialog", { name: "Sync status" });
	await expect(surface).toHaveAttribute("data-align", "start");
	const [triggerBox, viewport, actualSide] = await Promise.all([
		trigger.boundingBox(),
		page.evaluate(() => ({ width: innerWidth, height: innerHeight })),
		surface.getAttribute("data-side"),
	]);
	const spaces = {
		top: triggerBox!.y,
		bottom: viewport.height - triggerBox!.y - triggerBox!.height,
		left: triggerBox!.x,
		right: viewport.width - triggerBox!.x - triggerBox!.width,
	};
	const expectedSide = Object.entries(spaces).sort(([, first], [, second]) => second - first)[0][0];
	expect(actualSide).toBe(expectedSide);
});
