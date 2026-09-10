import { test, expect } from "@playwright/test";
test("desktop navigation stays single-line with an anchored collapse control", async ({ page }) => {
	await page.goto("/");
	await page.getByRole("button", { name: "Change language" }).click();
	const nav = page.getByRole("navigation", { name: "Main navigation" });
	const toggle = nav.getByRole("button", { name: "Toggle navigation width" });
	const sizes = await nav
		.locator(".mds-navitem")
		.evaluateAll((items) => items.map((el) => el.getBoundingClientRect().height));
	expect(new Set(sizes).size).toBe(1);
	expect(
		await nav
			.locator(".mds-navitem-label")
			.evaluateAll((items) => items.every((el) => el.scrollWidth <= el.clientWidth)),
	).toBeTruthy();
	const head = await toggle.boundingBox();
	const first = await nav.getByRole("button", { name: "Components", exact: true }).boundingBox();
	expect(head!.y + head!.height).toBeLessThanOrEqual(first!.y);
	await expect(page.getByText("Built with the real package", { exact: true })).toHaveCount(0);
	await toggle.click();
	await expect(toggle).toBeFocused();
	await expect(toggle).toHaveAttribute("aria-expanded", "false");
	await nav.getByRole("button", { name: "Charts", exact: true }).click();
	await expect(page).toHaveURL(/#charts$/);
	await toggle.click();
	await expect(toggle).toHaveAttribute("aria-expanded", "true");
});
test("tablet and mobile navigation use the same unclipped labels and close after routing", async ({ page }) => {
	for (const width of [800, 320]) {
		await page.setViewportSize({ width, height: 900 });
		await page.goto("/");
		await page.getByRole("button", { name: "Change language" }).click();
		await page.getByRole("button", { name: "Open navigation" }).click();
		const drawer = page.getByRole("dialog", { name: "Workspace navigation" });
		await expect(drawer).toBeVisible();
		expect(
			await drawer
				.locator(".mds-navitem-label")
				.evaluateAll((items) => items.every((el) => el.scrollWidth <= el.clientWidth)),
		).toBeTruthy();
		await drawer.getByRole("button", { name: "Documentation", exact: true }).click();
		await expect(drawer).toHaveCount(0);
		await expect(page).toHaveURL(/#docs$/);
	}
});
