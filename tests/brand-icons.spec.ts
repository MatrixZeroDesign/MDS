import { expect, test } from "@playwright/test";

test("brand catalog keeps a normalized frame and usable mobile layout", async ({ page }) => {
	await page.goto("/icons");
	await page.getByRole("tab", { name: "Brand icons" }).click();
	const library = page.locator(".docs-brand-library");
	const initialStatus = library.getByRole("status");
	await expect(initialStatus).toContainText("matching brands");
	const totalBrands = Number.parseInt(await initialStatus.innerText(), 10);
	expect(totalBrands).toBeGreaterThanOrEqual(340);
	const initialTiles = await library.locator(".docs-brand-tile").count();
	expect(initialTiles).toBeLessThan(totalBrands);
	await expect(library.locator(".docs-brand-icon-color img").first()).toHaveAttribute("loading", "lazy");
	await expect(library.locator(".docs-brand-icon-color img").first()).toHaveAttribute("decoding", "async");
	await library.locator(".docs-brand-load-sentinel").scrollIntoViewIfNeeded();
	await expect.poll(() => library.locator(".docs-brand-tile").count()).toBeGreaterThan(initialTiles);

	const frames = library.locator(".docs-brand-icon-frame > .docs-brand-icon-color");
	for (let index = 0; index < 20; index += 1) {
		const size = await frames.nth(index).evaluate((element) => ({
			width: getComputedStyle(element).inlineSize,
			height: getComputedStyle(element).blockSize,
		}));
		expect(size).toEqual({ width: "32px", height: "32px" });
	}

	const search = page.getByLabel("Search brand icons");
	for (const brand of ["CrowdStrike", "Databricks", "Xiaomi", "WooCommerce"]) {
		await search.fill(brand);
		await expect(library.getByRole("status")).toContainText("matching brands");
		await expect(library.getByRole("button", { name: new RegExp(brand, "i") }).first()).toBeVisible();
	}
	await search.fill("CrowdStrike");
	const crowdStrike = library.getByRole("button", { name: /CrowdStrike/ });
	await expect(crowdStrike.locator('[data-format="mark"]')).toBeVisible();
	await crowdStrike.click();
	const crowdStrikeDialog = page.getByRole("dialog", { name: "CrowdStrike" });
	await expect(crowdStrikeDialog.getByText("Wordmark", { exact: true })).toBeVisible();
	await expect(crowdStrikeDialog).toContainText('format="wordmark"');
	const wordmark = crowdStrikeDialog.locator('[data-format="wordmark"]').first();
	const wordmarkSize = await wordmark.evaluate((element) => ({
		width: element.getBoundingClientRect().width,
		height: element.getBoundingClientRect().height,
	}));
	expect(wordmarkSize.width).toBeGreaterThan(wordmarkSize.height * 5);
	const wordmarkPanel = crowdStrikeDialog.locator(".docs-brand-wordmark-preview");
	const usageHeading = crowdStrikeDialog.locator(".docs-brand-usage-heading");
	const [panelBox, headingBox] = await Promise.all([wordmarkPanel.boundingBox(), usageHeading.boundingBox()]);
	expect(headingBox!.y - panelBox!.y - panelBox!.height).toBeGreaterThanOrEqual(20);
	await page.keyboard.press("Escape");
	await search.fill("OpenAI");
	await expect(library.getByRole("status")).toContainText("1 matching brands");
	const openAI = library.getByRole("button", { name: /OpenAI/ });
	const restingBorder = await openAI.evaluate((element) => getComputedStyle(element).borderColor);
	await openAI.click();
	const dialog = page.getByRole("dialog", { name: "OpenAI" });
	await expect(dialog).toContainText("import { OpenAI } from '@matrixzero/brand-icons';");
	await page.keyboard.press("Escape");
	await expect(openAI).not.toBeFocused();
	await expect(openAI).not.toHaveAttribute("aria-pressed", /.*/);
	expect(await openAI.evaluate((element) => getComputedStyle(element).borderColor)).toBe(restingBorder);
	await expect(openAI.locator(".docs-brand-name")).toHaveAttribute("data-variant", "body-sm");
	await expect(openAI.locator(".docs-brand-name")).toHaveAttribute("data-tone", "muted");
	await expect(openAI.locator(".docs-brand-component")).toHaveAttribute("data-variant", "caption");
	await expect(openAI.locator(".docs-brand-component")).toHaveAttribute("data-tone", "muted");
	await openAI.press("Enter");
	await page.keyboard.press("Escape");
	await expect(openAI).toBeFocused();
	await page.getByRole("radio", { name: "Monochrome" }).click();
	const mask = await page
		.locator(".docs-brand-icon-frame > .docs-brand-icon-color > span")
		.evaluate((element) => getComputedStyle(element).maskImage);
	expect(mask).not.toBe("none");

	await page.setViewportSize({ width: 390, height: 844 });
	await expect(page.locator(".docs-brand-grid")).toHaveCSS("grid-template-columns", /\S+px \S+px/);
	expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBeTruthy();
});

test("site status presents MDS as ready for product work", async ({ page }) => {
	await page.goto("/home");
	await expect(page.getByText("MDS is ready for building products.")).toBeVisible();
	await expect(page.getByText(/preview|demo data/i)).toHaveCount(0);
});
