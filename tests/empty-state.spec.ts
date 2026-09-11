import { test, expect } from "@playwright/test";
import { execFileSync } from "node:child_process";
import AxeBuilder from "@axe-core/playwright";
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
test("empty state thumbnail options update the preview and source at narrow RTL widths", async ({ page }) => {
	await page.goto("/#docs/empty-state");
	const preview = page.getByRole("region", { name: "Interactive example" });
	await expect(preview.locator(".mds-empty-thumbnail")).toHaveCSS("width", "96px");
	await page.getByRole("combobox", { name: "Size", exact: true }).click();
	await page.getByRole("option", { name: "Large", exact: true }).click();
	await expect(preview.locator(".mds-empty-thumbnail")).toHaveCSS("width", "160px");
	await expect(page.locator(".docs-reference-detail pre")).toContainText('thumbnailSize = "lg"');
	await page.getByRole("button", { name: "Toggle reading direction" }).click();
	await page.setViewportSize({ width: 320, height: 900 });
	expect((await new AxeBuilder({ page }).include(".mds-empty").analyze()).violations).toEqual([]);
	await page.getByRole("combobox", { name: "Thumbnail", exact: true }).click();
	await page.getByRole("option", { name: "Icon", exact: true }).click();
	await expect(preview.locator(".mds-empty-thumbnail svg")).toHaveAttribute("viewBox", "0 0 24 24");
	await page.getByRole("combobox", { name: "Thumbnail", exact: true }).click();
	await page.getByRole("option", { name: "None", exact: true }).click();
	await expect(preview.locator(".mds-empty-thumbnail")).toHaveCount(0);
	await expect(preview.getByRole("heading", { name: "No matches" })).toBeVisible();
});
