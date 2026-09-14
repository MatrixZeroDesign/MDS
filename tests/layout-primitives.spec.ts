import { expect, test } from "@playwright/test";

test("Grid, Divider and Typography expose their layout and semantic contracts", async ({ page }) => {
	await page.goto("/docs/grid");
	const grid = page.locator(".docs-live-stage .mds-grid").first();
	await expect(grid).toBeVisible();
	expect(await grid.locator(":scope > *").count()).toBe(3);
	expect(
		await grid.evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(" ").filter(Boolean).length),
	).toBeGreaterThan(1);

	await page.goto("/docs/divider");
	const horizontal = page.locator('.docs-live-stage .mds-divider[data-orientation="horizontal"]').first();
	const vertical = page.locator('.docs-live-stage .mds-divider[data-orientation="vertical"]').first();
	await expect(horizontal).toHaveAttribute("role", "separator");
	await expect(horizontal).toHaveAttribute("aria-orientation", "horizontal");
	await expect(vertical).toHaveAttribute("aria-orientation", "vertical");
	expect((await vertical.boundingBox())!.height).toBeGreaterThan((await vertical.boundingBox())!.width);

	await page.goto("/docs/typography");
	const title = page.locator('.docs-live-stage h2.mds-typography[data-variant="display"]').first();
	await expect(title).toHaveText("Clear ideas, carefully expressed.");
	const gutterTitle = page.locator(".docs-live-stage .mds-typography[data-gutter]").first();
	await expect(gutterTitle).toHaveAttribute("data-variant", "title");
	expect(
		await gutterTitle.evaluate((element) => Number.parseFloat(getComputedStyle(element).marginBottom)),
	).toBeGreaterThan(0);
	const decorativeDivider = page.locator('.docs-live-stage .mds-divider[role="none"]').first();
	await expect(decorativeDivider).toHaveAttribute("aria-hidden", "true");
});

test("global density compacts Navbar and NavDrawer", async ({ page }) => {
	await page.goto("/docs/navigation");
	const navbar = page.locator(".docs-live-stage .mds-navbar").first();
	const docsSidebarItem = page.locator(".docs-nav .mds-navitem").first();
	const docsNavbarItem = page.locator(".docs-primary-nav .mds-navitem").first();
	const comfortableNavbarHeight = (await navbar.boundingBox())!.height;
	const comfortableSidebarItemHeight = (await docsSidebarItem.boundingBox())!.height;
	const comfortableNavbarItemHeight = (await docsNavbarItem.boundingBox())!.height;
	await page.getByRole("button", { name: "Interface density", exact: true }).click();
	await page.getByRole("menuitemradio", { name: "Compact", exact: true }).click();
	await expect(page.locator(".mds-root").first()).toHaveAttribute("data-mds-density", "compact");
	const compactNavbarHeight = (await navbar.boundingBox())!.height;
	expect(compactNavbarHeight).toBeLessThan(comfortableNavbarHeight);
	expect((await docsSidebarItem.boundingBox())!.height).toBeLessThan(comfortableSidebarItemHeight);
	expect((await docsNavbarItem.boundingBox())!.height).toBeLessThan(comfortableNavbarItemHeight);

	await page.goto("/docs/nav-drawer");
	const drawerItem = page.locator(".docs-live-stage .mds-navdrawer-panel .mds-navitem").first();
	expect((await drawerItem.boundingBox())!.height).toBeLessThanOrEqual(36);

	await page.goto("/docs/nav-rail");
	const rail = page.locator(".docs-live-stage .mds-navrail").first();
	const railItem = rail.locator(".mds-navitem").first();
	await railItem.waitFor({ state: "visible" });
	const compactRailWidth = (await rail.boundingBox())!.width;
	const compactRailItemHeight = (await railItem.boundingBox())!.height;
	await page.getByRole("button", { name: "Interface density", exact: true }).click();
	await page.getByRole("menuitemradio", { name: "Comfortable", exact: true }).click();
	expect((await rail.boundingBox())!.width).toBeGreaterThan(compactRailWidth);
	expect((await railItem.boundingBox())!.height).toBeGreaterThan(compactRailItemHeight);
});

test("global density compacts MegaMenu triggers and content", async ({ page }) => {
	await page.goto("/docs/mega-menu");
	const trigger = page.locator(".docs-live-stage .mds-mega-menu-trigger").first();
	const comfortableTriggerHeight = (await trigger.boundingBox())!.height;
	await trigger.click();
	const content = page.locator(".docs-live-stage .mds-mega-menu-content").first();
	const link = content.locator(".mds-mega-menu-link").first();
	const comfortableLinkHeight = (await link.boundingBox())!.height;
	const comfortablePadding = await content.evaluate((element) =>
		Number.parseFloat(getComputedStyle(element).paddingTop),
	);
	await trigger.click();

	await page.getByRole("button", { name: "Interface density", exact: true }).click();
	await page.getByRole("menuitemradio", { name: "Compact", exact: true }).click();
	expect((await trigger.boundingBox())!.height).toBeLessThan(comfortableTriggerHeight);
	await trigger.click();
	const compactContent = page.locator(".docs-live-stage .mds-mega-menu-content").first();
	const compactLink = compactContent.locator(".mds-mega-menu-link").first();
	await expect(compactLink).toBeVisible();
	expect((await compactLink.boundingBox())!.height).toBeLessThan(comfortableLinkHeight);
	expect(
		await compactContent.evaluate((element) => Number.parseFloat(getComputedStyle(element).paddingTop)),
	).toBeLessThan(comfortablePadding);
});

test("global density compacts lists, tabs and data rows", async ({ page }) => {
	await page.goto("/docs/selection-list");
	const selectionItem = page.locator(".docs-live-stage .mds-selection-list-item").first();
	await selectionItem.waitFor({ state: "visible" });
	const comfortableSelectionHeight = (await selectionItem.boundingBox())!.height;
	await page.getByRole("button", { name: "Interface density", exact: true }).click();
	await page.getByRole("menuitemradio", { name: "Compact", exact: true }).click();
	expect((await selectionItem.boundingBox())!.height).toBeLessThan(comfortableSelectionHeight);

	await page.goto("/docs/list");
	const listItem = page.locator(".docs-live-stage .mds-list-item").first();
	await listItem.waitFor({ state: "visible" });
	const compactListHeight = (await listItem.boundingBox())!.height;
	await page.getByRole("button", { name: "Interface density", exact: true }).click();
	await page.getByRole("menuitemradio", { name: "Comfortable", exact: true }).click();
	expect((await listItem.boundingBox())!.height).toBeGreaterThan(compactListHeight);

	await page.goto("/docs/tabs");
	const tab = page.locator(".docs-live-stage .mds-tab").first();
	await tab.waitFor({ state: "visible" });
	const comfortableTabHeight = (await tab.boundingBox())!.height;
	await page.getByRole("button", { name: "Interface density", exact: true }).click();
	await page.getByRole("menuitemradio", { name: "Compact", exact: true }).click();
	expect((await tab.boundingBox())!.height).toBeLessThan(comfortableTabHeight);

	await page.goto("/docs/data-table");
	const rowCell = page.locator(".docs-live-stage .mds-data-table tbody td").first();
	await rowCell.waitFor({ state: "visible" });
	expect((await rowCell.boundingBox())!.height).toBe(40);
	await page.getByRole("button", { name: "Interface density", exact: true }).click();
	await page.getByRole("menuitemradio", { name: "Comfortable", exact: true }).click();
	expect((await rowCell.boundingBox())!.height).toBe(48);
});

test("header preference menus give every option a recognizable visual", async ({ page }) => {
	await page.goto("/home");
	for (const [label, marker] of [
		["Change language", "svg, .docs-language-mark"],
		["Interface density", "svg"],
		["Toggle color theme", "svg"],
		["Color palette", ".docs-palette-preview"],
	] as const) {
		await page.getByRole("button", { name: label, exact: true }).click();
		const options = page.locator('.mds-menu[data-state="open"] [role="menuitemradio"]');
		await expect(options.first()).toBeVisible();
		for (const option of await options.all()) await expect(option.locator(marker).first()).toBeVisible();
		await page.keyboard.press("Escape");
	}
});

test("nested Anchor indicator stays on the root guide line", async ({ page }) => {
	await page.goto("/docs/container");
	const anchor = page.getByRole("navigation", { name: "On this page" });
	const nestedLink = anchor.getByRole("link", { name: "Basic example", exact: true });
	const activeDuringScroll = await nestedLink.evaluate(async (link) => {
		(link as HTMLAnchorElement).click();
		const samples: string[] = [];
		for (let frame = 0; frame < 30; frame += 1) {
			await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
			const current = link.closest(".mds-anchor")!.querySelector('a[aria-current="location"]');
			samples.push(current?.textContent?.trim() ?? "");
		}
		return [...new Set(samples.filter(Boolean))];
	});
	expect(activeDuringScroll).toEqual(["Basic example"]);
	await expect(nestedLink).toHaveAttribute("aria-current", "location");
	const delta = await nestedLink.evaluate((link) => {
		const anchorRect = link.closest(".mds-anchor")!.getBoundingClientRect();
		const linkRect = link.getBoundingClientRect();
		const indicator = getComputedStyle(link, "::before");
		const indicatorCenter = linkRect.left + Number.parseFloat(indicator.left) + Number.parseFloat(indicator.width) / 2;
		return Math.abs(indicatorCenter - anchorRect.left);
	});
	expect(delta).toBeLessThanOrEqual(2);
});

test("Toast can stay inside a content region", async ({ page }) => {
	await page.goto("/docs/toast");
	const example = page.getByLabel("Inline notification");
	await example.getByRole("button", { name: "Check for updates", exact: true }).click();
	const toaster = example.locator('.mds-toaster[data-placement="inline"]');
	await expect(toaster).toBeVisible();
	await expect(toaster).toHaveCSS("position", "relative");
	await expect(toaster.getByRole("button", { name: "Update now", exact: true })).toBeVisible();
	await expect(toaster.getByRole("button", { name: "Dismiss notification", exact: true })).toBeVisible();
});
