import { test, expect } from "@playwright/test";
test("playground controls update real props and matching copyable code, then reset", async ({ page }) => {
	await page.goto("/#docs/button");
	const controls = page.getByRole("group", { name: "Example settings" });
	for (const [label, option] of [
		["Variant", "Contrast"],
		["Size", "Large"],
		["Shape", "Pill"],
	]) {
		await controls.getByRole("combobox", { name: label, exact: true }).click();
		await page.getByRole("option", { name: option, exact: true }).click();
	}
	const button = page.locator(".docs-live-stage").getByRole("button", { name: "Add", exact: true });
	await expect(button).toHaveAttribute("data-variant", "contrast");
	await expect(button).toHaveAttribute("data-size", "lg");
	await expect(button).toHaveAttribute("data-shape", "pill");
	for (const value of ['variant = "contrast"', 'size = "lg"', 'shape = "pill"'])
		await expect(page.locator(".docs-reference-detail pre")).toContainText(value);
	await controls.getByRole("button", { name: "Reset", exact: true }).click();
	await expect(button).toHaveAttribute("data-size", "md");
	await page.goto("/#docs/callout");
	await controls.getByRole("combobox", { name: "Color" }).click();
	await page.getByRole("option", { name: "Success", exact: true }).click();
	await expect(page.locator(".docs-live-stage .mds-callout")).toHaveAttribute("data-tone", "success");
	await expect(page.locator(".docs-reference-detail pre")).toContainText('tone = "success"');
	await page.setViewportSize({ width: 320, height: 900 });
	expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBeTruthy();
});
test("form, dialog and sheet examples separate inputs from actions at all sizes and directions", async ({ page }) => {
	await page.emulateMedia({ reducedMotion: "reduce" });
	for (const width of [1280, 320])
		for (const rtl of [false, true]) {
			await page.setViewportSize({ width, height: 1000 });
			for (const slug of ["select", "native-select", "dialog", "side-sheet"]) {
				await page.goto("/#docs/" + slug);
				await page.reload();
				if (rtl) await page.getByRole("button", { name: "Toggle reading direction" }).click();
				const overlay = slug === "dialog" || slug === "side-sheet";
				if (overlay) await page.locator(".docs-live-stage").getByRole("button", { name: "Edit", exact: true }).click();
				const area = overlay ? page.getByRole("dialog") : page.locator(".docs-live-stage");
				const field = area.locator(".mds-field");
				const action = area.getByRole("button", { name: overlay ? "Done" : "Reset", exact: true });
				const a = await field.boundingBox(),
					b = await action.boundingBox();
				expect(b!.y - a!.y - a!.height).toBeGreaterThanOrEqual(15);
				expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBeTruthy();
				if (overlay) await page.keyboard.press("Escape");
			}
		}
});
