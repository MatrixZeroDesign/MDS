import { test, expect } from "@playwright/test";
import { useArabicDirection } from "./test-utils";
for (const rtl of [false, true])
	test(`segmented overflow scrolls without changing selection ${rtl ? "RTL" : "LTR"}`, async ({ page }) => {
		await page.setViewportSize({ width: 390, height: 844 });
		await page.emulateMedia({ reducedMotion: "reduce" });
		await page.goto("/showcase-smart-home");
		if (rtl) await useArabicDirection(page);
		const group = page.locator(".sc-smart-room-filter");
		const shell = group.locator("..");
		const selected = await group.locator('[data-state="checked"]').getAttribute("value");
		const arrow = shell.getByRole("button").filter({ visible: true });
		await expect(arrow).toHaveCount(2);
		await expect(group).toHaveCSS("scrollbar-width", "none");
		const start = await group.evaluate((el) => el.scrollLeft);
		await arrow.nth(rtl ? 0 : 1).click();
		await expect.poll(() => group.evaluate((el) => el.scrollLeft)).not.toBe(start);
		await expect(group.locator('[data-state="checked"]')).toHaveAttribute("value", selected!);
		const last = group.getByRole("radio").last();
		await last.click();
		const indicator = group.locator(".mds-segment-indicator");
		await expect
			.poll(async () => Math.abs((await last.boundingBox())!.x - (await indicator.boundingBox())!.x))
			.toBeLessThan(1);
		const tops = await group
			.getByRole("radio")
			.evaluateAll((items) => items.map((item) => item.getBoundingClientRect().top));
		expect(new Set(tops).size).toBe(1);
		await page.setViewportSize({ width: 1800, height: 1000 });
		await expect(shell.getByRole("button")).toHaveCount(0);
	});
