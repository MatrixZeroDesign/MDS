import { test, expect } from "@playwright/test";
test("segmented indicator slides between actual option bounds and respects RTL and reduced motion", async ({
	page,
}) => {
	await page.goto("/docs/segmented-control");
	const group = page.getByRole("region", { name: "Interactive example" }).getByRole("radiogroup", { name: "Billing" });
	const indicator = group.locator(".mds-segment-indicator");
	const annual = group.getByRole("radio", { name: "Annual", exact: true });
	await expect(indicator).toBeVisible();
	const start = (await indicator.boundingBox())!.x;
	await annual.click();
	await expect
		.poll(async () => Math.abs((await indicator.boundingBox())!.x - (await annual.boundingBox())!.x))
		.toBeLessThan(1);
	expect((await indicator.boundingBox())!.x).not.toBe(start);
	await expect(indicator).toHaveCSS("transition-duration", "0.2s, 0.2s, 0.2s");
	await page.getByRole("button", { name: "Toggle reading direction" }).click();
	await expect
		.poll(async () => Math.abs((await indicator.boundingBox())!.x - (await annual.boundingBox())!.x))
		.toBeLessThan(1);
	await page.emulateMedia({ reducedMotion: "reduce" });
	await expect(indicator).toHaveCSS("transition-duration", "0s");
	await annual.focus();
	await page.keyboard.press("ArrowRight");
	const selected = group.locator('[role="radio"][data-state="checked"]');
	await expect
		.poll(async () => Math.abs((await indicator.boundingBox())!.x - (await selected.boundingBox())!.x))
		.toBeLessThan(1);
	await page.setViewportSize({ width: 320, height: 900 });
	await expect
		.poll(async () => Math.abs((await indicator.boundingBox())!.width - (await selected.boundingBox())!.width))
		.toBeLessThan(1);
});
