import { test, expect, type Locator, type Page } from "@playwright/test";

async function chooseThemePreset(page: Page, dialog: Locator, label: string, option: string) {
	const select = dialog.getByRole("combobox", { name: label, exact: true });
	if (await select.count()) {
		await select.click();
		await page.getByRole("option", { name: option, exact: true }).click();
		return;
	}
	await dialog
		.getByRole("radiogroup", { name: label, exact: true })
		.getByRole("radio", { name: option, exact: true })
		.click();
}

const customPresetOptions = {
	neutral: "warm",
	scaling: "110%",
	surface: "translucent",
	contrast: "high",
	motion: "expressive",
	typeScale: "editorial",
};

async function expectCustomPresetTokens(root: Locator) {
	await expect(root).toHaveCSS("--mds-bg", "light-dark(#faf8f4, #1a1713)");
	await expect(root).toHaveCSS("--mds-scale", "1.1");
	await expect(root).toHaveCSS("--mds-surface-backdrop", "blur(16px) saturate(140%)");
	await expect(root).toHaveCSS("--mds-focus-width", "3px");
	await expect(root).toHaveCSS("--mds-duration-slow", "360ms");
	await expect(root).toHaveCSS("--mds-type-title-base", "28px");
}

type DialogBox = { x: number; y: number; width: number; height: number };

async function switchThemeTab(dialog: Locator, name: string, reference?: DialogBox) {
	const tab = dialog.getByRole("tab", { name, exact: true });
	await tab.click();
	await expect(tab).toHaveAttribute("data-state", "active");
	if (!reference) return;
	await expect
		.poll(async () => {
			const current = await dialog.boundingBox();
			if (!current) return Number.POSITIVE_INFINITY;
			return Math.max(
				Math.abs(current.x - reference.x),
				Math.abs(current.y - reference.y),
				Math.abs(current.width - reference.width),
				Math.abs(current.height - reference.height),
			);
		})
		.toBeLessThanOrEqual(1);
}

test("docs default to system, react to system changes and remember explicit choices", async ({ page }) => {
	await page.emulateMedia({ colorScheme: "dark" });
	await page.goto("/system");
	const root = page.locator(".mds-root").first();
	await expect(root).toHaveAttribute("data-mds-mode", "system");
	await expect(root).toHaveCSS("color-scheme", "dark");
	await page.emulateMedia({ colorScheme: "light" });
	await expect(root).toHaveCSS("color-scheme", "light");
	await page.getByRole("button", { name: "Toggle color theme" }).click();
	await page.getByRole("menuitemradio", { name: "Dark", exact: true }).click();
	await expect(root).toHaveAttribute("data-mds-mode", "dark");
	await page.reload();
	await expect(root).toHaveAttribute("data-mds-mode", "dark");
	await page.getByRole("button", { name: "Toggle color theme" }).click();
	await page.getByRole("menuitemradio", { name: "Follow system", exact: true }).click();
	await page.reload();
	await expect(root).toHaveAttribute("data-mds-mode", "system");
	await expect(root).toHaveCSS("color-scheme", "light");
	await page.getByRole("button", { name: "Color palette" }).click();
	const paletteMenu = page.locator(".docs-palette-menu");
	await expect(paletteMenu.locator(".docs-palette-option")).toHaveCount(6);
	await expect(paletteMenu.locator(".docs-palette-preview-mode")).toHaveCount(12);
	await expect(
		paletteMenu.getByRole("menuitemradio", { name: "Monochrome", exact: true }).locator('[data-mds-mode="light"]'),
	).toHaveCSS("background-color", "rgb(248, 248, 247)");
	await expect(
		paletteMenu.getByRole("menuitemradio", { name: "Monochrome", exact: true }).locator('[data-mds-mode="dark"]'),
	).toHaveCSS("background-color", "rgb(23, 23, 23)");
	await page.getByRole("menuitemradio", { name: "Monochrome", exact: true }).click();
	await expect(root).toHaveAttribute("data-mds-palette", "mono");
	await expect(root).toHaveCSS("--mds-accent", "#202020");
	await page.emulateMedia({ colorScheme: "dark" });
	await expect(root).toHaveCSS("--mds-accent", "#eeeeee");
	await page.setViewportSize({ width: 320, height: 900 });
	await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBeTruthy();
});

test("home hero uses the available width on large screens", async ({ page }) => {
	await page.setViewportSize({ width: 2704, height: 934 });
	await page.goto("/home");
	const title = page.getByRole("heading", { name: "Make room for good design.", exact: true });
	const metrics = await title.evaluate((element) => {
		const style = getComputedStyle(element);
		return { height: element.getBoundingClientRect().height, lineHeight: Number.parseFloat(style.lineHeight) };
	});
	expect(metrics.height).toBeLessThan(metrics.lineHeight * 1.35);
});

test("desktop content surface uses a complete large-radius silhouette", async ({ page }) => {
	await page.goto("/home");
	const surface = page.locator(".docs-main");
	const layout = page.locator(".docs-layout");
	const corners = await surface.evaluate((element) => {
		const style = getComputedStyle(element);
		return [
			style.borderTopLeftRadius,
			style.borderTopRightRadius,
			style.borderBottomRightRadius,
			style.borderBottomLeftRadius,
		];
	});
	expect(new Set(corners).size).toBe(1);
	expect(Number.parseFloat(corners[0])).toBeGreaterThan(0);
	await expect(layout).toHaveCSS("padding", "16px");
	await expect(layout).toHaveCSS("gap", "16px");
});

test("home page responds visibly to global density", async ({ page }) => {
	await page.goto("/home");
	const intro = page.locator(".home-intro");
	const card = page.locator(".home-type-card");
	const comfortableMargin = Number.parseFloat(
		await intro.evaluate((element) => getComputedStyle(element).marginBottom),
	);
	const comfortablePadding = Number.parseFloat(await card.evaluate((element) => getComputedStyle(element).paddingTop));
	await page.getByRole("button", { name: "Interface density", exact: true }).click();
	await page.getByRole("menuitemradio", { name: "Compact", exact: true }).click();
	await expect(page.locator(".mds-root").first()).toHaveAttribute("data-mds-density", "compact");
	expect(Number.parseFloat(await intro.evaluate((element) => getComputedStyle(element).marginBottom))).toBeLessThan(
		comfortableMargin,
	);
	expect(Number.parseFloat(await card.evaluate((element) => getComputedStyle(element).paddingTop))).toBeLessThan(
		comfortablePadding,
	);
});

test("design links to the theme builder and uses only global density", async ({ page }) => {
	await page.goto("/design");
	await expect(page.locator(".docs-page-heading .docs-muted")).toHaveCount(0);
	await expect(page.getByRole("link", { name: "Open theme builder", exact: true })).toHaveAttribute(
		"href",
		"/theme-builder",
	);
	await expect(page.getByRole("button", { name: "Interface density", exact: true })).toBeVisible();
	await expect(page.locator(".docs-type .mds-choice-trigger")).toHaveCount(0);
	const skill = page.getByRole("link", { name: "Download MDS skill", exact: true });
	await expect(skill).toHaveAttribute("download", "MDS-SKILL.md");
	const response = await page.request.get(
		await skill.getAttribute("href").then((href) => new URL(href!, page.url()).href),
	);
	expect(response.ok()).toBeTruthy();
	expect(await response.text()).toContain("name: mds");
});

test("custom theme builder previews, applies and persists an accent color", async ({ page }) => {
	await page.goto("/home");
	await page.getByRole("button", { name: "Color palette", exact: true }).click();
	await page.getByRole("menuitem", { name: /Make your theme/ }).click();
	await page.waitForURL("**/theme-builder");

	const dialog = page.locator(".docs-theme-builder-page");
	await expect(dialog).toBeVisible();
	await expect(dialog.locator(".docs-theme-builder-mode")).toHaveCount(1);
	const previewMode = dialog.getByRole("radiogroup", { name: "Preview mode", exact: true });
	await expect(previewMode.getByRole("radio", { name: "Light", exact: true })).toBeChecked();
	await expect(dialog.getByRole("navigation", { name: "Preview navigation", exact: true })).toBeVisible();
	const drawerItemHeight = await dialog
		.locator(".docs-theme-preview-navigation .mds-navitem")
		.first()
		.evaluate((element) => element.getBoundingClientRect().height);
	const drawerIconPositions = await dialog
		.locator(".docs-theme-preview-navigation .mds-navitem-icon")
		.evaluateAll((elements) =>
			elements.map((element) => {
				const bounds = element.getBoundingClientRect();
				return { x: bounds.left + bounds.width / 2, y: bounds.top + bounds.height / 2 };
			}),
		);
	await dialog.getByRole("button", { name: "Collapse navigation", exact: true }).click();
	await expect(dialog.locator(".docs-theme-preview-shell")).toHaveAttribute("data-nav-collapsed", "true");
	await expect(dialog.locator(".docs-theme-preview-navigation")).toHaveAttribute("data-collapsed", "true");
	expect(
		await dialog
			.locator(".docs-theme-preview-navigation .mds-navitem-label")
			.first()
			.evaluate((element) => element.getBoundingClientRect().width),
	).toBeLessThanOrEqual(1);
	expect(
		await dialog
			.locator(".docs-theme-preview-navigation .mds-navitem")
			.first()
			.evaluate((element) => element.getBoundingClientRect().height),
	).toBeCloseTo(drawerItemHeight, 0);
	const railIconPositions = await dialog
		.locator(".docs-theme-preview-navigation .mds-navitem-icon")
		.evaluateAll((elements) =>
			elements.map((element) => {
				const bounds = element.getBoundingClientRect();
				return { x: bounds.left + bounds.width / 2, y: bounds.top + bounds.height / 2 };
			}),
		);
	expect(railIconPositions).toHaveLength(drawerIconPositions.length);
	for (const [index, position] of railIconPositions.entries()) {
		expect(position.x).toBeCloseTo(drawerIconPositions[index].x, 0);
		expect(position.y).toBeCloseTo(drawerIconPositions[index].y, 0);
	}
	await dialog.getByRole("button", { name: "Expand navigation", exact: true }).click();
	await previewMode.getByRole("radio", { name: "Dark", exact: true }).click();
	await expect(dialog.locator(".docs-theme-builder-mode")).toHaveAttribute("data-mds-mode", "dark");
	await previewMode.getByRole("radio", { name: "Light", exact: true }).click();
	await expect(dialog.locator(".docs-theme-contrast-status")).toBeVisible();
	await expect(dialog.getByText("Accent fails WCAG AA")).toHaveCount(0);
	await dialog.getByLabel("Choose accent color", { exact: true }).fill("#d13c75");
	await chooseThemePreset(page, dialog, "Neutral tone", "Warm");
	await switchThemeTab(dialog, "Style");
	const previewTitle = dialog.locator('.docs-theme-builder-mode .mds-typography[data-variant="title-sm"]').first();
	const standardTitleSize = Number.parseFloat(
		await previewTitle.evaluate((element) => getComputedStyle(element).fontSize),
	);
	await dialog.getByRole("radio", { name: "Rounded", exact: true }).click();
	await dialog.getByRole("combobox", { name: "Typeface", exact: true }).click();
	await expect(page.getByRole("option", { name: "Humanist sans", exact: true })).toBeVisible();
	await expect(page.getByRole("option", { name: "Geometric sans", exact: true })).toBeVisible();
	await expect(page.getByRole("option", { name: "Classic serif", exact: true })).toBeVisible();
	await page.getByRole("option", { name: "Editorial serif", exact: true }).click();
	const previewCard = dialog.locator(".docs-theme-preview-card");
	const solidSurface = await previewCard.evaluate((element) => {
		const style = getComputedStyle(element);
		return { background: style.backgroundColor, backdrop: style.backdropFilter, shadow: style.boxShadow };
	});
	await chooseThemePreset(page, dialog, "Surface style", "Translucent");
	const translucentSurface = await previewCard.evaluate((element) => {
		const style = getComputedStyle(element);
		return { background: style.backgroundColor, backdrop: style.backdropFilter, shadow: style.boxShadow };
	});
	expect(solidSurface.backdrop).toBe("none");
	expect(translucentSurface.backdrop).toContain("blur(16px)");
	expect(translucentSurface.background).not.toBe(solidSurface.background);
	expect(translucentSurface.shadow).not.toBe(solidSurface.shadow);
	await chooseThemePreset(page, dialog, "Type scale", "Editorial");
	await expect
		.poll(async () => Number.parseFloat(await previewTitle.evaluate((element) => getComputedStyle(element).fontSize)))
		.toBeGreaterThan(standardTitleSize);
	const [standardControlHeight, standardChipHeight] = await Promise.all([
		dialog
			.locator(".docs-theme-builder-mode .mds-input")
			.first()
			.evaluate((element) => element.getBoundingClientRect().height),
		dialog
			.locator(".docs-theme-builder-mode .mds-chip")
			.first()
			.evaluate((element) => element.getBoundingClientRect().height),
	]);
	await switchThemeTab(dialog, "Behavior");
	await chooseThemePreset(page, dialog, "UI scale", "110%");
	const [previewInputHeight, previewButtonHeight, previewChipHeight] = await Promise.all([
		dialog
			.locator(".docs-theme-builder-mode .mds-input")
			.first()
			.evaluate((element) => element.getBoundingClientRect().height),
		dialog
			.locator(".docs-theme-builder-mode .docs-theme-preview-action .mds-button")
			.first()
			.evaluate((element) => element.getBoundingClientRect().height),
		dialog
			.locator(".docs-theme-builder-mode .mds-chip")
			.first()
			.evaluate((element) => element.getBoundingClientRect().height),
	]);
	expect(previewButtonHeight).toBeCloseTo(previewInputHeight, 0);
	expect(previewInputHeight).toBeGreaterThan(standardControlHeight);
	expect(previewChipHeight).toBeGreaterThan(standardChipHeight);
	await chooseThemePreset(page, dialog, "Interface density", "Compact");
	await chooseThemePreset(page, dialog, "Contrast", "High");
	await chooseThemePreset(page, dialog, "Motion", "Expressive");
	await switchThemeTab(dialog, "Use in your app");
	const setup = dialog.locator(".docs-theme-setup code");
	await expect(setup).toContainText('shape: "rounded"');
	await expect(setup).toContainText('neutral: "warm"');
	await expect(setup).toContainText('scaling: "110%"');
	await expect(setup).toContainText('surface: "translucent"');
	await expect(setup).toContainText('contrast: "high"');
	await expect(setup).toContainText('motion: "expressive"');
	await expect(setup).toContainText('typeScale: "editorial"');
	await expect(setup).toContainText('density="compact"');
	await switchThemeTab(dialog, "Brand");
	await expect(dialog.getByRole("button", { name: "Apply theme" })).toBeDisabled();
	await dialog.getByRole("checkbox", { name: /Accept MDS suggested color/ }).click();
	const appliedPrimary = await dialog.getByLabel("Choose accent color", { exact: true }).inputValue();
	expect(appliedPrimary).not.toBe("#d13c75");
	await expect(dialog.getByRole("checkbox", { name: /Accept MDS suggested color/ })).toBeChecked();
	await dialog.getByRole("checkbox", { name: /Accept MDS suggested color/ }).click();
	await expect(dialog.getByLabel("Choose accent color", { exact: true })).toHaveValue("#d13c75");
	await expect(dialog.getByRole("button", { name: "Apply theme" })).toBeDisabled();
	await dialog.getByRole("checkbox", { name: /Accept MDS suggested color/ }).click();
	const applyTheme = dialog.getByRole("button", { name: "Apply theme" });
	await applyTheme.click();
	await expect(applyTheme).toBeDisabled();
	const resetTheme = dialog.getByRole("button", { name: "Reset to defaults", exact: true });
	await resetTheme.click();
	await expect(dialog.getByLabel("Choose accent color", { exact: true })).toHaveValue("#202020");
	await expect(applyTheme).toBeEnabled();

	const root = page.locator(".docs-app");
	await expect(root).toHaveAttribute("data-custom-theme", "true");
	await expect(root).not.toHaveAttribute("data-mds-palette");
	await expect.poll(() => page.evaluate(() => localStorage.getItem("mds.docs.custom-primary"))).toBe(appliedPrimary);
	await expect.poll(() => page.evaluate(() => localStorage.getItem("mds.docs.custom-radius"))).toBe("14");
	await expect.poll(() => page.evaluate(() => localStorage.getItem("mds.docs.custom-font"))).toBe("serif");
	await expect
		.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem("mds.docs.custom-options") ?? "null")))
		.toEqual(customPresetOptions);
	await expect(root).toHaveCSS("--mds-radius", "14px");
	await expect(root).toHaveAttribute("data-mds-density", "compact");
	await expectCustomPresetTokens(root);
	await page.reload();
	await expect(root).toHaveAttribute("data-custom-theme", "true");
	await expect.poll(() => page.evaluate(() => localStorage.getItem("mds.docs.palette"))).toBe("custom");
	await expect.poll(() => page.evaluate(() => localStorage.getItem("mds.docs.density"))).toBe("compact");
	await expect
		.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem("mds.docs.custom-options") ?? "null")))
		.toEqual(customPresetOptions);
	await expectCustomPresetTokens(root);
});

test("custom theme generator keeps extreme accent colors at WCAG AA contrast", async ({ page }) => {
	await page.goto("/home");
	await page.getByRole("button", { name: "Color palette", exact: true }).click();
	await page.getByRole("menuitem", { name: /Make your theme/ }).click();
	await page.waitForURL("**/theme-builder");
	const dialog = page.locator(".docs-theme-builder-page");
	const colorInput = dialog.getByLabel("Choose accent color", { exact: true });
	const previewMode = dialog.getByRole("radiogroup", { name: "Preview mode", exact: true });

	for (const color of ["#ffffff", "#000000", "#ffff00", "#d13c75"]) {
		await colorInput.fill(color);
		if (color === "#ffffff") {
			await expect(dialog.getByText("Accent fails WCAG AA", { exact: true })).toBeVisible();
			await expect(dialog.getByText("Accent passes WCAG AA", { exact: true })).toHaveCount(0);
			await expect(dialog.getByRole("button", { name: "Apply theme" })).toBeDisabled();
			await dialog.getByRole("checkbox", { name: /Accept MDS suggested color/ }).click();
			await expect(colorInput).not.toHaveValue(color);
			await expect(dialog.getByRole("button", { name: "Apply theme" })).toBeEnabled();
		} else if (color === "#000000") {
			await expect(dialog.getByRole("checkbox", { name: /Accept MDS suggested color/ })).toHaveCount(0);
			await expect(dialog.getByRole("button", { name: "Apply theme" })).toBeEnabled();
		}
		for (const mode of ["light", "dark"]) {
			await previewMode.getByRole("radio", { name: mode === "light" ? "Light" : "Dark", exact: true }).click();
			await expect(dialog.locator(".docs-theme-builder-mode")).toHaveAttribute("data-mds-mode", mode);
			const readContrast = () =>
				dialog.locator(".docs-theme-builder-mode").evaluate((element) => {
					const parse = (value: string) =>
						value
							.match(/[\d.]+/g)!
							.slice(0, 3)
							.map(Number);
					const luminance = (value: string) => {
						const channels = parse(value).map((channel) => {
							const normalized = channel / 255;
							return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
						});
						return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
					};
					const ratio = (a: string, b: string) => {
						const values = [luminance(a), luminance(b)].sort((x, y) => y - x);
						return (values[0] + 0.05) / (values[1] + 0.05);
					};
					const surface = getComputedStyle(element);
					const button = getComputedStyle(element.querySelector(".docs-theme-preview-action .mds-button")!);
					return {
						accentOnCanvas: ratio(button.backgroundColor, surface.backgroundColor),
						textOnAccent: ratio(button.color, button.backgroundColor),
					};
				});
			await expect
				.poll(async () => (await readContrast()).accentOnCanvas)
				.toBeGreaterThanOrEqual(mode === "dark" ? 6 : 4.5);
			const result = await readContrast();
			expect(result.textOnAccent, `${color} ${mode} button text`).toBeGreaterThanOrEqual(4.5);
		}
	}
});
test("invalid or unavailable theme storage falls back safely", async ({ page }) => {
	await page.addInitScript(() => {
		localStorage.setItem("mds.docs.mode", "invalid");
		Storage.prototype.setItem = () => {
			throw new Error("Storage unavailable");
		};
	});
	await page.goto("/docs/start");
	await expect(page.locator(".mds-root").first()).toHaveAttribute("data-mds-mode", "system");
	await page.getByRole("button", { name: "Toggle color theme" }).click();
	await page.getByRole("menuitemradio", { name: "Light", exact: true }).click();
	await expect(page.locator(".mds-root").first()).toHaveAttribute("data-mds-mode", "light");
});
