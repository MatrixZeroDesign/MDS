import { test, expect } from "@playwright/test";
for (const width of [390, 1440]) {
	test(`robotics map keeps visible marker icons at ${width}px`, async ({ page }) => {
		await page.setViewportSize({ width, height: 900 });
		await page.emulateMedia({ reducedMotion: "reduce" });
		await page.goto("/showcase-robotics");
		const map = page.locator(".sc-robotics-map");
		await expect(map.getByText("Pickup", { exact: true })).toBeVisible();
		await expect(map.getByText("Destination", { exact: true })).toBeVisible();
		await expect(map.getByText("AMR-07", { exact: true })).toBeVisible();
		for (const icon of await map.locator(".sc-robotics-node > svg, .sc-robotics-position > svg").all()) {
			await expect(icon).toHaveCSS("position", "static");
			await expect(icon).toHaveCSS("stroke-dasharray", "none");
			const box = await icon.boundingBox();
			expect(box!.width).toBeGreaterThanOrEqual(15);
			expect(box!.width).toBeLessThanOrEqual(18);
		}
	});
}
