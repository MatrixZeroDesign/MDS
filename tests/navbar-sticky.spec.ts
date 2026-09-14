import { test, expect } from "@playwright/test";
test("navbar remains at the scroll container top", async ({ page }) => {
	await page.goto("/docs/navigation");
	const region = page.getByRole("region", { name: "Sticky navigation demo", exact: true });
	const bar = region.locator(".mds-navbar");
	await expect(bar).toBeVisible();
	const before = await bar.boundingBox();
	await region.evaluate((el) => {
		el.scrollTop = 220;
	});
	const after = await bar.boundingBox();
	expect(Math.abs(after!.y - before!.y)).toBeLessThan(1);
	await expect(bar).toHaveCSS("position", "sticky");
	await expect(page.locator(".docs-live-example").first().locator(".mds-navbar")).not.toHaveAttribute(
		"data-sticky",
		"true",
	);
});
test("scroll-aware navbar hides down, reveals up and restores keyboard access", async ({ page }) => {
	await page.goto("/docs/navigation");
	const region = page.getByRole("region", { name: "Scroll-aware navigation demo", exact: true });
	const bar = region.locator(".mds-navbar");
	await expect(bar).toBeVisible();
	await region.evaluate((el) => {
		el.scrollTop = 240;
	});
	await expect(bar).toHaveAttribute("data-scroll-hidden", "true");
	await region.evaluate((el) => {
		el.scrollTop = 180;
	});
	await expect(bar).not.toHaveAttribute("data-scroll-hidden", "true");
	await region.evaluate((el) => {
		el.scrollTop = 300;
	});
	await expect(bar).toHaveAttribute("data-scroll-hidden", "true");
	await bar.getByRole("link").first().focus();
	await expect(bar).not.toHaveAttribute("data-scroll-hidden", "true");
});
test("docs site header hides on page scroll and reappears on scroll up", async ({ page }) => {
	await page.goto("/docs/navigation");
	await page.getByRole("region", { name: "Scroll-aware navigation demo", exact: true }).waitFor();
	const bar = page.locator(".docs-top");
	await expect(bar).toHaveAttribute("data-sticky", "true");
	await page.evaluate(() => window.scrollTo(0, 600));
	await expect(bar).toHaveAttribute("data-scroll-hidden", "true");
	await page.evaluate(() => window.scrollTo(0, 450));
	await expect(bar).not.toHaveAttribute("data-scroll-hidden", "true");
	await expect(bar).toBeVisible();
	await expect.poll(async () => Math.abs((await bar.boundingBox())!.y)).toBeLessThan(2);
});
