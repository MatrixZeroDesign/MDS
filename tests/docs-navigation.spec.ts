import { test, expect } from "@playwright/test";
test("desktop documentation navigation stays expanded with readable labels", async ({ page }) => {
	await page.goto("/system?lang=zh");
	await page.getByRole("button", { name: "Change language" }).click();
	await page.getByRole("menuitemradio", { name: /English/ }).click();
	const nav = page.getByRole("navigation", { name: "Main navigation" });
	const toggle = nav.getByRole("button", { name: "Toggle navigation width" });
	const sizes = await nav
		.locator(".docs-component-navigation > a")
		.evaluateAll((items) => items.map((el) => el.getBoundingClientRect().height));
	expect(new Set(sizes).size).toBe(1);
	expect(
		await nav
			.locator(".docs-component-label")
			.evaluateAll((items) => items.every((el) => el.scrollWidth <= el.clientWidth)),
	).toBeTruthy();
	await expect(toggle).toHaveCount(0);
	await expect(nav).not.toHaveAttribute("data-collapsed");
	await expect(page.getByText("Built with the real package", { exact: true })).toHaveCount(0);
	await nav.getByRole("link", { name: "Getting started", exact: true }).click();
	await expect(page).toHaveURL(/\/docs\/start$/);
});
test("tablet and mobile navigation use the same unclipped labels and close after routing", async ({ page }) => {
	for (const width of [800, 320]) {
		await page.setViewportSize({ width, height: 900 });
		await page.goto("/system?lang=zh");
		await page.reload();
		await page.getByRole("button", { name: "Change language" }).click();
		await page.getByRole("menuitemradio", { name: /English/ }).click();
		await page.getByRole("button", { name: "Open navigation" }).click();
		const drawer = page.getByRole("dialog", { name: "Workspace navigation" });
		await expect(drawer).toBeVisible();
		expect(
			await drawer
				.locator(".docs-component-label")
				.evaluateAll((items) => items.every((el) => el.scrollWidth <= el.clientWidth)),
		).toBeTruthy();
		await drawer.getByRole("link", { name: "Getting started", exact: true }).click();
		await expect(drawer).toHaveCount(0);
		await expect(page).toHaveURL(/\/docs\/start$/);
	}
});

test("site sections own their secondary navigation and retain deep links", async ({ page }) => {
	await page.goto("/?lang=zh");
	await page.getByRole("button", { name: "Change language" }).click();
	await page.getByRole("menuitemradio", { name: /English/ }).click();
	const primary = page.getByRole("navigation", { name: "Site navigation" });
	await expect(primary.getByRole("link")).toHaveCount(6);
	await expect(primary.getByRole("link", { name: "Home", exact: true })).toHaveAttribute("aria-current", "page");
	await expect(page.getByRole("navigation", { name: "Main navigation" })).toHaveCount(0);
	await primary.getByRole("link", { name: "Components", exact: true }).click();
	const secondary = page.getByRole("navigation", { name: "Main navigation" });
	await expect.poll(() => secondary.locator(".docs-component-navigation a").count()).toBeGreaterThan(35);
	await expect(secondary.getByRole("button", { name: "Charts", exact: true })).toHaveCount(0);
	await primary.getByRole("link", { name: "Showcase" }).click();
	await secondary.getByRole("link", { name: "Policy workspace" }).click();
	await expect(primary.getByRole("link", { name: "Showcase" })).toHaveAttribute("aria-current", "page");
	await page.goBack();
	await expect(page.getByRole("heading", { name: "Showcase", exact: true })).toBeVisible();
	await page.goto("/docs/avatar-group?lang=zh");
	await page.reload();
	await expect(page.getByRole("heading", { name: /AvatarGroup$/, exact: true })).toBeVisible();
	await expect(
		page.getByRole("navigation", { name: "全站导航" }).getByRole("link", { name: "组件", exact: true }),
	).toHaveAttribute("aria-current", "page");
});

test("component drawer links open live examples and API without a nested directory", async ({ page }) => {
	await page.goto("/docs/start?lang=zh");
	const nav = page.getByRole("navigation", { name: "主导航" });
	await nav.getByRole("link", { name: "主题与动效", exact: true }).click();
	await expect(page.getByRole("heading", { name: "主题隔离与品牌契约" })).toBeVisible();
	await nav.getByRole("textbox", { name: "搜索组件文档" }).fill("Button");
	await nav.getByRole("link", { name: /^(按钮 )?Button$/, exact: true }).click();
	const preview = page.getByRole("region", { name: "交互示例" });
	await preview.getByRole("button", { name: "添加" }).click();
	await expect(preview.getByRole("status").filter({ hasText: "1" })).toHaveText("1");
	await expect(page.getByRole("heading", { name: "API", exact: true })).toBeVisible();
	await expect(page.locator(".docs-reference-index")).toHaveCount(0);
	await page.setViewportSize({ width: 320, height: 900 });
	await page.getByRole("button", { name: "打开导航" }).click();
	const drawer = page.getByRole("dialog");
	await drawer.getByRole("textbox", { name: "搜索组件文档" }).fill("AvatarGroup");
	await drawer.getByRole("link", { name: /AvatarGroup$/, exact: true }).click();
	await expect(drawer).toHaveCount(0);
	await expect(page.getByRole("heading", { name: /AvatarGroup$/, exact: true })).toBeVisible();
	await expect(page.getByRole("region", { name: "交互示例" }).getByRole("group")).toBeVisible();
});
