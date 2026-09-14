import { test, expect } from "@playwright/test";
import { execFileSync } from "node:child_process";
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
	await page.getByRole("button", { name: "Toggle reading direction" }).click();
	const root = page.locator(".mds-root").first();
	await expect(root).toHaveAttribute("dir", "rtl");
	const nav = await page.getByRole("navigation", { name: "Main navigation" }).boundingBox();
	const main = await page.locator("main").boundingBox();
	expect(nav!.x).toBeGreaterThan(main!.x);
	const tab = page.getByRole("tab", { name: "Settings", exact: true });
	await tab.focus();
	await page.keyboard.press("ArrowLeft");
	await expect(page.getByRole("tab", { name: "History", exact: true })).toHaveAttribute("aria-selected", "true");
	const control = page.getByRole("switch").first();
	await control.check();
	await expect(control.locator(".mds-switch-thumb")).toHaveCSS("transform", "matrix(1, 0, 0, 1, -14, 0)");
	await page.getByRole("button", { name: "Create policy", exact: true }).click();
	const select = page.getByRole("dialog").getByRole("combobox").first();
	await select.click();
	await expect(page.getByRole("listbox")).toHaveCSS("direction", "rtl");
	await page.keyboard.press("Escape");
	await page.keyboard.press("Escape");
	await page.setViewportSize({ width: 320, height: 900 });
	await page.emulateMedia({ reducedMotion: "reduce" });
	await page.getByRole("button", { name: "Open navigation" }).click();
	const drawer = page.getByRole("dialog");
	await expect(drawer).toHaveAttribute("data-side", "right");
	expect(Math.round((await drawer.boundingBox())!.x + (await drawer.boundingBox())!.width)).toBe(320);
	await drawer.getByRole("link", { name: "Button", exact: true }).click();
	await expect(drawer).toHaveCount(0);
	expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBeTruthy();
	await expect(page.locator(".docs-reference-detail pre").first()).toHaveCSS("direction", "ltr");
});
test("separate roots retain their own portal directions", async ({ page }) => {
	await page.goto("/isolation.html");
	await page.getByRole("button", { name: "Dark choice" }).click();
	await expect(page.getByRole("menu")).toHaveCSS("direction", "rtl");
	await page.keyboard.press("Escape");
	await page.getByRole("button", { name: "Custom choice" }).click();
	await expect(page.getByRole("menu")).toHaveCSS("direction", "ltr");
});
