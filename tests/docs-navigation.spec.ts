import { test, expect } from "@playwright/test";
test("desktop navigation stays single-line with an anchored collapse control", async ({ page }) => {
	await page.goto("/#system");
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
	const first = await nav.getByRole("button", { name: "Foundations & components", exact: true }).boundingBox();
	expect(head!.y + head!.height).toBeLessThanOrEqual(first!.y);
	await expect(page.getByText("Built with the real package", { exact: true })).toHaveCount(0);
	await toggle.click();
	await expect(toggle).toBeFocused();
	await expect(toggle).toHaveAttribute("aria-expanded", "false");
	await nav.getByRole("button", { name: "Documentation", exact: true }).click();
	await expect(page).toHaveURL(/#docs$/);
	await toggle.click();
	await expect(toggle).toHaveAttribute("aria-expanded", "true");
});
test("tablet and mobile navigation use the same unclipped labels and close after routing", async ({ page }) => {
	for (const width of [800, 320]) {
		await page.setViewportSize({ width, height: 900 });
		await page.goto("/#system");
		await page.reload();
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

test("site sections own their secondary navigation and retain deep links", async ({ page }) => {
	await page.goto("/");
	await page.getByRole("button", { name: "Change language" }).click();
	const primary = page.getByRole("navigation", { name: "Site navigation" });
	await expect(primary.getByRole("link")).toHaveCount(5);
	await expect(primary.getByRole("link", { name: "Home", exact: true })).toHaveAttribute("aria-current", "page");
	await expect(page.getByRole("navigation", { name: "Main navigation" })).toHaveCount(0);
	await primary.getByRole("link", { name: "Components", exact: true }).click();
	const secondary = page.getByRole("navigation", { name: "Main navigation" });
	await expect(secondary.locator(".mds-navitem")).toHaveCount(2);
	await expect(secondary.getByRole("button", { name: "Charts", exact: true })).toHaveCount(0);
	await primary.getByRole("link", { name: "Showcase" }).click();
	await secondary.getByRole("button", { name: "Policy workspace" }).click();
	await expect(primary.getByRole("link", { name: "Showcase" })).toHaveAttribute("aria-current", "page");
	await page.goBack();
	await expect(page.getByRole("heading", { name: "Showcase", exact: true })).toBeVisible();
	await page.goto("/#docs/avatar-group");
	await page.reload();
	await expect(page.getByRole("heading", { name: "AvatarGroup", exact: true })).toBeVisible();
	await expect(
		page.getByRole("navigation", { name: "全站导航" }).getByRole("link", { name: "组件", exact: true }),
	).toHaveAttribute("aria-current", "page");
});
