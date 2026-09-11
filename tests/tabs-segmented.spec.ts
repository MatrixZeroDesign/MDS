import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("segmented Tabs retain panel semantics, sliding geometry, RTL and reduced motion", async ({ page }) => {
	await page.goto("/#docs/tabs");
	const preview = page.getByRole("region", { name: "Interactive example" });
	const list = preview.getByRole("tablist");
	const usage = preview.getByRole("tab", { name: "Usage", exact: true });
	const guide = preview.getByRole("tab", { name: "Guide", exact: true });
	const indicator = list.locator(".mds-segment-indicator");
	await expect(list).toHaveAttribute("data-variant", "segmented");
	const aligned = async () => {
		await expect
			.poll(async () => {
				const a = await indicator.boundingBox();
				const b = await list.locator('[data-state="active"]').boundingBox();
				return !!a && !!b && Math.abs(a.x - b.x) < 1 && Math.abs(a.width - b.width) < 1;
			})
			.toBeTruthy();
	};
	await aligned();
	await guide.click();
	await expect(preview.getByRole("tabpanel")).toHaveText("Design guide");
	await aligned();
	await usage.focus();
	await page.keyboard.press("ArrowRight");
	await expect(guide).toBeFocused();
	await aligned();
	await page.getByRole("button", { name: "Toggle reading direction" }).click();
	await usage.focus();
	await page.keyboard.press("ArrowLeft");
	await expect(guide).toBeFocused();
	await aligned();
	await page.emulateMedia({ reducedMotion: "reduce" });
	await expect(indicator).toHaveCSS("transition-duration", "0s");
	expect((await new AxeBuilder({ page }).include(".docs-live-stage").analyze()).violations).toEqual([]);
	const settings = page.getByRole("group", { name: "Example settings" });
	await settings.getByRole("combobox").first().click();
	await page.getByRole("option", { name: "Default", exact: true }).click();
	await expect(indicator).toHaveCount(0);
	await expect(list).toHaveAttribute("data-variant", "default");
});
