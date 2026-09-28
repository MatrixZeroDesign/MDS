import { expect, test } from "@playwright/test";

async function expectCentered(button: import("@playwright/test").Locator) {
	const geometry = await button.evaluate((node) => {
		const icon = node.querySelector("svg, .mds-button-icon");
		if (!(icon instanceof HTMLElement || icon instanceof SVGElement)) return null;
		const buttonRect = node.getBoundingClientRect();
		const iconRect = icon.getBoundingClientRect();
		return {
			x: Math.abs(buttonRect.left + buttonRect.width / 2 - (iconRect.left + iconRect.width / 2)),
			y: Math.abs(buttonRect.top + buttonRect.height / 2 - (iconRect.top + iconRect.height / 2)),
			width: buttonRect.width,
			height: buttonRect.height,
		};
	});
	expect(geometry).not.toBeNull();
	expect(geometry!.x).toBeLessThanOrEqual(0.5);
	expect(geometry!.y).toBeLessThanOrEqual(0.5);
	expect(geometry!.width).toBe(geometry!.height);
}

test("IconButton centers its icon at every supported size", async ({ page }) => {
	await page.goto("/docs/icon-button?lang=en");
	const buttons = page.getByRole("region", { name: "Size comparison" }).getByRole("button", { name: "Add" });
	await expect(buttons).toHaveCount(3);
	for (let index = 0; index < 3; index += 1) await expectCentered(buttons.nth(index));
});

test("Dialog and side sheet close actions use the shared centered IconButton", async ({ page }) => {
	for (const slug of ["dialog", "side-sheet"] as const) {
		await page.goto(`/docs/${slug}?lang=en`);
		const triggerName = slug === "dialog" ? "Preview product tour" : "Edit";
		await page.getByRole("region", { name: "Interactive example" }).getByRole("button", { name: triggerName }).click();
		const close = page.getByRole("button", { name: "Close" }).last();
		await expect(close).toHaveClass(/mds-icon-button/);
		await expectCentered(close);
		await close.click();
	}
});
