import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { useArabicDirection } from "./test-utils";
test("Form preserves validation, prevents duplicate async submissions, focuses errors and resets", async ({ page }) => {
	await page.goto("/docs/form");
	const preview = page.getByRole("region", { name: "Interactive example" });
	const form = preview.locator("form");
	const name = preview.getByRole("textbox", { name: "Workspace name" });
	const save = preview.getByRole("button", { name: "Save", exact: true });
	await save.click();
	await expect(name).toBeFocused();
	await expect(form).not.toHaveAttribute("aria-busy", "true");
	await name.fill("admin");
	await preview.getByRole("textbox", { name: "Email", exact: true }).fill("user@example.com");
	await form.evaluate((el) => {
		el.setAttribute("data-submissions", "0");
		el.addEventListener("formdata", (event) => {
			el.setAttribute("data-submissions", String(Number(el.getAttribute("data-submissions")) + 1));
			el.setAttribute("data-intent", (event as FormDataEvent).formData.get("intent") as string);
		});
	});
	await save.click();
	await expect(save).toBeDisabled();
	await expect(form).toHaveAttribute("aria-busy", "true");
	await form.evaluate((el) => (el as HTMLFormElement).requestSubmit());
	await expect(form).toHaveAttribute("data-submissions", "1");
	await expect(form).toHaveAttribute("data-intent", "save");
	await expect(preview.getByRole("link", { name: "This name is already taken. Choose another." })).toBeVisible();
	await expect(name).toBeFocused();
	await expect(name).toHaveAttribute("aria-invalid", "true");
	await preview.getByRole("link", { name: "This name is already taken. Choose another." }).click();
	await expect(name).toBeFocused();
	expect((await new AxeBuilder({ page }).include(".mds-form").analyze()).violations).toEqual([]);
	await name.fill("Matrix");
	await save.click();
	await expect(preview.getByRole("status").filter({ hasText: "Saved." })).toHaveText("Saved.");
	await preview.getByRole("button", { name: "Reset", exact: true }).click();
	await expect(name).toHaveValue("");
	await expect(preview.getByRole("status").filter({ hasText: "Saved." })).toHaveCount(0);
});
test("Form recovers from rejected submission promises", async ({ page }) => {
	await page.goto("/docs/form");
	const preview = page.getByRole("region", { name: "Interactive example" });
	await preview.getByRole("textbox", { name: "Workspace name" }).fill("offline");
	await preview.getByRole("textbox", { name: "Email", exact: true }).fill("user@example.com");
	await preview.getByRole("button", { name: "Save", exact: true }).click();
	await expect(preview.getByRole("alert")).toHaveText("Unable to save. Please try again.");
	await preview.getByRole("textbox", { name: "Workspace name" }).fill("Matrix");
	await preview.getByRole("button", { name: "Save", exact: true }).click();
	await expect(preview.getByRole("status").filter({ hasText: "Saved." })).toHaveText("Saved.");
	await expect(preview.getByRole("alert")).toHaveCount(0);
});
test("API tables separate contracts, defaults and explanations and scroll on narrow screens", async ({ page }) => {
	await page.goto("/docs/toast");
	await expect(page.locator(".docs-api-signature")).toHaveCount(0);
	await expect(page.locator(".docs-api-group")).toHaveCount(4);
	const provider = page.getByRole("region", { name: "ToastProvider properties", exact: true });
	await expect(provider.getByRole("row").filter({ hasText: "duration" })).toContainText("5000");
	await page.setViewportSize({ width: 320, height: 900 });
	await provider.focus();
	await expect(provider).toBeFocused();
	expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBeTruthy();
	expect((await new AxeBuilder({ page }).include(".docs-api-groups").analyze()).violations).toEqual([]);
});
test("Switch icon slots track checked state and stay decorative through keyboard and RTL changes", async ({ page }) => {
	await page.goto("/docs/switch");
	const preview = page.locator(".docs-live-stage").first();
	const theme = preview.getByRole("switch").first();
	await expect(theme.locator('[data-visible="checked"]')).toHaveCSS("opacity", "1");
	await theme.focus();
	await page.keyboard.press("Space");
	await expect(theme).toHaveAttribute("aria-checked", "false");
	await expect(theme.locator('[data-visible="unchecked"]')).toHaveCSS("opacity", "1");
	await expect(preview.locator(".mds-root")).toHaveAttribute("data-mds-mode", "dark");
	await expect(preview.locator('.mds-root[data-mds-mode="dark"] .mds-card')).toHaveCSS(
		"background-color",
		"rgb(34, 34, 34)",
	);
	const fieldStarts = await preview
		.locator(".mds-card-content .mds-field")
		.evaluateAll((fields) => fields.map((field) => field.getBoundingClientRect().x));
	expect(fieldStarts[0]).toBe(fieldStarts[1]);
	const disabledPreview = page.locator(".docs-live-stage").nth(1);
	await expect(disabledPreview.locator(".mds-switch:disabled")).toHaveCount(2);
	const disabledFieldStarts = await disabledPreview
		.locator(".mds-card-content .mds-field")
		.evaluateAll((fields) => fields.map((field) => field.getBoundingClientRect().x));
	expect(disabledFieldStarts[0]).toBe(disabledFieldStarts[1]);
	await useArabicDirection(page);
	await expect(theme).toHaveAttribute("aria-checked", "true");
	await expect(theme.locator(".mds-switch-thumb")).toHaveCSS("transform", "matrix(1, 0, 0, 1, -14, 0)");
	await expect(theme.locator(".mds-switch-icon").first()).toHaveAttribute("aria-hidden", "true");
	expect((await new AxeBuilder({ page }).include(".docs-live-stage").analyze()).violations).toEqual([]);
});
