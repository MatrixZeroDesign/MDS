import { test, expect } from "@playwright/test";
import { execFileSync } from "node:child_process";
import AxeBuilder from "@axe-core/playwright";
import { useArabicDirection } from "./test-utils";
test("empty state preserves image semantics and legacy icon compatibility", () => {
	const [markup, legacy] = JSON.parse(
		execFileSync(
			process.execPath,
			[
				"--input-type=module",
				"-e",
				`import {createElement as h} from 'react';import {renderToStaticMarkup as render} from 'react-dom/server';import {EmptyState} from './packages/ui/dist/index.js';console.log(JSON.stringify([render(h(EmptyState,{title:'Empty',thumbnail:h('img',{src:'diagram.svg',alt:'Folder structure'}),icon:'Old icon'})),render(h(EmptyState,{title:'Empty',icon:'Old icon'}))]));`,
			],
			{ encoding: "utf8" },
		),
	);
	expect(markup).toContain('alt="Folder structure"');
	expect(markup).not.toContain("aria-hidden");
	expect(markup).not.toContain("Old icon");
	expect(legacy).toContain("mds-empty-icon");
});
test("empty state thumbnail variants render at narrow RTL widths", async ({ page }) => {
	await page.goto("/docs/empty-state");
	const preview = page.getByRole("region", { name: "Interactive example" });
	await expect(preview.locator(".mds-empty-thumbnail")).toHaveCSS("width", "96px");
	const comparison = page.getByRole("region", { name: "Size comparison" });
	await expect(comparison.locator(".mds-empty-thumbnail")).toHaveCount(3);
	await expect(comparison.locator(".mds-empty-thumbnail").last()).toHaveCSS("width", "160px");
	await expect(
		page.getByRole("region", { name: "Thumbnail: Icon" }).locator(".mds-empty-thumbnail svg"),
	).toHaveAttribute("viewBox", "0 0 24 24");
	const none = page.getByRole("region", { name: "Thumbnail: None" });
	await expect(none.locator(".mds-empty-thumbnail")).toHaveCount(0);
	await expect(none.getByRole("heading", { name: "No matches" })).toBeVisible();
	await useArabicDirection(page);
	await page.setViewportSize({ width: 320, height: 900 });
	expect((await new AxeBuilder({ page }).include(".mds-empty").analyze()).violations).toEqual([]);
});
