import { test, expect } from "@playwright/test";
import { execFileSync } from "node:child_process";
import { useArabicDirection } from "./test-utils";
test("nested direction inherits and explicit roots remain isolated", async () => {
	const html = execFileSync(
		process.execPath,
		[
			"--input-type=module",
			"-e",
			`import React from 'react';import {renderToStaticMarkup} from 'react-dom/server';import {ThemeProvider} from './packages/ui/dist/index.js';console.log(renderToStaticMarkup(React.createElement(ThemeProvider,{dir:'rtl'},React.createElement(ThemeProvider,{'data-testid':'inherited'},'rtl'),React.createElement(ThemeProvider,{dir:'ltr','data-testid':'override'},'ltr'))));`,
		],
		{ encoding: "utf8" },
	);
	expect(html).toMatch(/data-testid="inherited" dir="rtl"/);
	expect(html).toMatch(/data-testid="override" dir="ltr"/);
});
test("RTL mirrors navigation and switch movement, and tabs follow direction-aware keys", async ({ page }) => {
	await page.goto("/system");
	await useArabicDirection(page);
	const root = page.locator(".mds-root").first();
	await expect(root).toHaveAttribute("dir", "rtl");
	await expect(page.getByRole("button", { name: "Toggle reading direction" })).toHaveCount(0);
	const nav = await page.locator(".docs-nav").boundingBox();
	const main = await page.locator("main").boundingBox();
	expect(nav!.x).toBeGreaterThan(main!.x);
	await page.goto("/docs/tabs");
	const tabs = page.locator(".docs-live-stage .mds-tabs").first();
	const tab = tabs.getByRole("tab").nth(0);
	await tab.focus();
	await page.keyboard.press("ArrowLeft");
	await expect(tabs.getByRole("tab").nth(1)).toHaveAttribute("aria-selected", "true");
	await page.goto("/docs/switch");
	const control = page.locator(".docs-live-stage [role='switch']").first();
	await control.check();
	await expect(control.locator(".mds-switch-thumb")).toHaveCSS("transform", "matrix(1, 0, 0, 1, -14, 0)");
	await page.goto("/docs/select?lang=ar");
	await page.locator(".docs-live-example").first().locator(".mds-select-trigger").click();
	await expect(page.getByRole("listbox")).toHaveCSS("direction", "rtl");
	await page.keyboard.press("Escape");
	await page.setViewportSize({ width: 320, height: 900 });
	await page.emulateMedia({ reducedMotion: "reduce" });
	await page.locator(".docs-mobile-menu").click();
	const drawer = page.getByRole("dialog");
	await expect(drawer).toHaveAttribute("data-side", "right");
	expect(Math.round((await drawer.boundingBox())!.x + (await drawer.boundingBox())!.width)).toBe(320);
	await drawer.locator(".mds-navitem").first().click();
	await expect(drawer).toHaveCount(0);
	expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBeTruthy();
	await page.goto("/docs/button?lang=ar");
	await expect(page.locator(".docs-reference-detail pre").first()).toHaveCSS("direction", "ltr");
	await page.getByRole("button", { name: "Change language" }).click();
	await page.getByRole("menuitemradio", { name: "English", exact: true }).click();
	await expect(root).toHaveAttribute("dir", "ltr");
});
test("separate roots retain their own portal directions", async ({ page }) => {
	await page.goto("/isolation.html");
	await page.getByRole("button", { name: "Dark choice" }).click();
	await expect(page.getByRole("menu")).toHaveCSS("direction", "rtl");
	await page.keyboard.press("Escape");
	await page.getByRole("button", { name: "Custom choice" }).click();
	await expect(page.getByRole("menu")).toHaveCSS("direction", "ltr");
});
