import { test, expect } from "@playwright/test";
test("documentation locales are exclusive and Banner is a page-top strip", async ({ page }) => {
	await page.goto("/?lang=zh#docs/banner");
	const stage = page.locator(".docs-live-stage");
	await expect(stage.getByRole("region", { name: "服务通知" })).toBeVisible();
	const banner = stage.locator(".mds-banner");
	const copy = stage.getByRole("heading", { name: "工作区" });
	expect((await banner.boundingBox())!.y).toBeLessThan((await copy.boundingBox())!.y);
	expect((await banner.boundingBox())!.height).toBeLessThanOrEqual(56);
	await expect(banner).toHaveCSS("border-radius", "0px");
	await expect(stage).not.toContainText("Maintenance");
	await page.getByRole("button", { name: "Change language" }).click();
	await expect(stage.getByRole("region", { name: "Service notice" })).toBeVisible();
	await expect(stage).not.toContainText("维护");
	const english = await page.locator(".docs-reference-detail").evaluate((el) => {
		const c = el.cloneNode(true) as HTMLElement;
		c.querySelectorAll("pre,code").forEach((n) => n.remove());
		return c.textContent;
	});
	expect(english).not.toMatch(/\p{Script=Han}/u);
	await page.goto("/?lang=zh#docs/dialog");
	await expect(stage.getByRole("button", { name: "Edit", exact: true })).toBeVisible();
	await stage.getByRole("button", { name: "Edit", exact: true }).click();
	await expect(page.getByRole("dialog").getByRole("button", { name: "Done" })).toBeVisible();
	await page.keyboard.press("Escape");
	await expect(page.locator(".docs-reference-detail")).toHaveCSS("max-width", "840px");
	await page.setViewportSize({ width: 320, height: 900 });
	expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBeTruthy();
});
