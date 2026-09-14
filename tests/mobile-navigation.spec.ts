import { test, expect } from "@playwright/test";
import { useArabicDirection } from "./test-utils";

for (const width of [320, 390, 760]) {
	for (const route of ["theme-builder", "showcase-chatbot"]) {
		test(`${route} uses an accessible mobile drawer at ${width}px`, async ({ page }) => {
			await page.setViewportSize({ width, height: 844 });
			await page.goto(`/${route}`);
			const trigger = page.locator(route === "theme-builder" ? ".docs-theme-preview-menu" : ".sc-chatbot-menu");
			await expect(trigger).toBeVisible();
			await trigger.click();
			const dialog = page.getByRole("dialog");
			await expect(dialog).toBeVisible();
			const bounds = await dialog.boundingBox();
			expect(bounds!.width).toBeLessThanOrEqual(width);
			await page.keyboard.press("Escape");
			await expect(dialog).toBeHidden();
			await expect(trigger).toBeFocused();
			await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBeTruthy();
			if (route === "showcase-chatbot") {
				const composer = page.getByRole("textbox", { name: "Message Matrix Assistant", exact: true });
				await composer.fill("Plan a launch");
				await page.getByRole("button", { name: "Send message", exact: true }).click();
				await expect(composer).toHaveValue("");
			}
			await useArabicDirection(page);
			await trigger.click();
			await expect(dialog).toBeVisible();
			await page.keyboard.press("Escape");
			await page.setViewportSize({ width: 1440, height: 1000 });
			await expect(trigger).toHaveCount(0);
			await expect(
				page.locator(route === "theme-builder" ? ".docs-theme-preview-navigation" : ".sc-chatbot-sidebar"),
			).toBeVisible();
		});
	}
}

test("mobile site navigation has a single surface and a branded title", async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto("/theme-builder");
	await page.getByRole("button", { name: "Open navigation", exact: true }).click();
	await page.mouse.move(380, 800);
	const drawer = page.getByRole("dialog", { name: "MDS", exact: true });
	await expect(drawer).toBeVisible();
	await expect(drawer.locator(".mds-navdrawer-panel")).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
	const inactive = drawer.getByRole("button", { name: "Home", exact: true });
	await expect(inactive).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
	const active = drawer.getByRole("button", { name: "Design", exact: true });
	await expect(active).toHaveAttribute("aria-current", "page");
	await expect(active).not.toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
	await page.keyboard.press("Escape");
	await expect(drawer).toBeHidden();
});
