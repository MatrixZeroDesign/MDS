import { test, expect } from "@playwright/test";

test("theme example gives every color scope its own matching surface", async ({ page }) => {
	await page.goto("/docs/theme");

	const stage = page.getByRole("region", { name: "Interactive example" }).locator(".docs-live-stage");
	const lightPreview = stage.locator('[data-mds-mode="light"]').first();
	const darkPreview = stage.locator('[data-mds-mode="dark"]').first();
	const nestedPanel = stage.locator('[data-mds-mode="light"]').nth(1);
	const nestedDarkScope = nestedPanel.locator('[data-mds-mode="dark"]');

	await expect(lightPreview).toHaveCSS("background-color", "rgb(255, 255, 255)");
	await expect(lightPreview).toHaveCSS("color", "rgb(36, 36, 36)");
	await expect(darkPreview).toHaveCSS("background-color", "rgb(34, 34, 34)");
	await expect(darkPreview).toHaveCSS("color", "rgb(243, 243, 243)");
	await expect(nestedDarkScope).toHaveCSS("background-color", "rgb(34, 34, 34)");
	await expect(nestedDarkScope).toHaveCSS("color", "rgb(243, 243, 243)");
	await expect(nestedDarkScope).toHaveCSS("border-radius", "0px");
});

test("palette comparison renders paired light and dark surfaces", async ({ page }) => {
	await page.goto("/docs/theme");

	const example = page.getByRole("region", { name: "Palette comparison" });
	const cards = example.locator(".docs-theme-palette-card");
	await expect(cards).toHaveCount(6);

	const firstCard = cards.first();
	const lightSurface = firstCard.locator('[data-mds-mode="light"]');
	const darkSurface = firstCard.locator('[data-mds-mode="dark"]');
	await expect(lightSurface).toHaveCSS("background-color", "rgb(255, 255, 255)");
	await expect(lightSurface).toHaveCSS("color", "rgb(36, 36, 36)");
	await expect(darkSurface).toHaveCSS("background-color", "rgb(34, 34, 34)");
	await expect(darkSurface).toHaveCSS("color", "rgb(243, 243, 243)");
	await expect(lightSurface).toHaveCSS("border-radius", "0px");
	await expect(darkSurface).toHaveCSS("border-radius", "0px");
});

test("creator preview keeps contrast on hover inside a dark theme scope", async ({ page }) => {
	await page.goto("/showcase-creator");
	const preview = page.getByRole("button", { name: "Play A slower morning in Kyoto" });
	await expect(preview).toHaveAttribute("data-variant", "contrast");
	await preview.hover();
	const colors = await preview.evaluate((element) => {
		const style = getComputedStyle(element);
		return { background: style.backgroundColor, foreground: style.color };
	});
	expect(colors.background).not.toBe(colors.foreground);
	expect(colors.background).not.toBe("rgb(34, 34, 34)");
	expect(colors.foreground).toBe("rgb(34, 34, 34)");
});
