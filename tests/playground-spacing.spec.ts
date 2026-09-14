import { test, expect } from "@playwright/test";
test("comparison examples expose real props and matching copyable code", async ({ page }) => {
	await page.goto("/docs/button");
	const variants = page.getByRole("region", { name: "Variant comparison" });
	await expect(variants.locator('[data-variant="contrast"]')).toBeVisible();
	await variants.getByRole("button", { name: "Code", exact: true }).click();
	await expect(variants.locator("pre")).toContainText('value: "contrast"');
	const sizes = page.getByRole("region", { name: "Size comparison" });
	await expect(sizes.locator('[data-size="lg"]')).toBeVisible();
	const shapes = page.getByRole("region", { name: "Shape comparison" });
	await expect(shapes.locator('[data-shape="pill"]').first()).toBeVisible();
	await page.goto("/docs/callout");
	const colors = page.getByRole("region", { name: "Color comparison" });
	await expect(colors.locator('[data-tone="success"]')).toBeVisible();
	await page.setViewportSize({ width: 320, height: 900 });
	expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBeTruthy();
});
for (const width of [1280, 320]) {
	for (const rtl of [false, true]) {
		test(`form, dialog and sheet examples separate inputs from actions at ${width}px ${rtl ? "RTL" : "LTR"}`, async ({
			page,
		}) => {
			await page.emulateMedia({ reducedMotion: "reduce" });
			await page.setViewportSize({ width, height: 1000 });
			for (const slug of ["select", "native-select", "dialog", "side-sheet"]) {
				await page.goto("/docs/" + slug);
				if (rtl) await page.getByRole("button", { name: "Toggle reading direction" }).click();
				const overlay = slug === "dialog" || slug === "side-sheet";
				const preview = page.getByRole("region", { name: "Interactive example" });
				if (overlay) await preview.getByRole("button", { name: "Edit", exact: true }).click();
				const area = overlay ? page.getByRole("dialog") : preview;
				const field = area.locator(".mds-field");
				const action = area.getByRole("button", { name: overlay ? "Done" : "Reset", exact: true });
				await expect(field).toBeVisible();
				await expect(action).toBeVisible();
				const a = await field.boundingBox();
				const b = await action.boundingBox();
				expect(b!.y - a!.y - a!.height).toBeGreaterThanOrEqual(15);
				expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBeTruthy();
				if (overlay) await page.keyboard.press("Escape");
			}
		});
	}
}
