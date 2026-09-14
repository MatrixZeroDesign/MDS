import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("Select preserves submitted values, required validation, reset and controlled state", async ({ page }) => {
	await page.goto("/isolation.html?lang=zh");
	const styled = page.getByRole("combobox", { name: "Styled choice" });
	await styled.click();
	await expect(page.getByRole("option", { name: "Disabled", exact: true })).toHaveAttribute("data-disabled", "");
	await page.getByRole("option", { name: "Beta", exact: true }).click();
	await expect(styled).toContainText("Beta");
	await page.getByRole("button", { name: "Submit choices" }).click();
	const required = page.getByRole("combobox", { name: "Required choice" });
	await expect(required).toBeFocused();
	await expect(required).toHaveAttribute("aria-invalid", "true");
	await required.click();
	await page.getByRole("option", { name: "Alpha", exact: true }).click();
	await page.getByRole("combobox", { name: "Controlled choice" }).click();
	await page.getByRole("option", { name: "Beta", exact: true }).click();
	await page.getByRole("button", { name: "Submit choices" }).click();
	await expect(page.getByLabel("Submitted choices")).toContainText('"styled":"b"');
	await expect(page.getByLabel("Submitted choices")).toContainText('"required":"a"');
	await expect(page.getByLabel("Submitted choices")).not.toContainText('"disabled"');
	await page.getByRole("button", { name: "Reset", exact: true }).click();
	await expect(styled).toContainText("Alpha");
	await expect(required).toContainText("Choose");
	await expect(page.getByRole("combobox", { name: "Controlled choice" })).toContainText("Beta");
	await required.click();
	await page.getByRole("option", { name: "Alpha", exact: true }).click();
	await page.getByRole("button", { name: "Submit choices" }).click();
	await expect(page.getByLabel("Submitted choices")).toContainText('"controlled":"b"');
});
test("both modal form selects share one themed dropdown without shifting content", async ({ page }) => {
	await page.emulateMedia({ reducedMotion: "reduce" });
	await page.goto("/governance?lang=en");
	await page.getByRole("button", { name: "Create release rule", exact: true }).click();
	const dialog = page.getByRole("dialog", { includeHidden: true });
	const measure = () =>
		dialog.evaluate((el) => {
			const r = el.getBoundingClientRect();
			return [r.x, r.y, r.width, r.height];
		});
	for (const label of ["Rule template", "Environment"]) {
		const trigger = dialog.getByRole("combobox", { name: label, includeHidden: true });
		const before = await measure();
		await trigger.click();
		const list = page.getByRole("listbox");
		await expect(list).toBeVisible();
		await expect(list).toHaveCSS("border-radius", "12px");
		expect(await measure()).toEqual(before);
		const triggerBox = await trigger.boundingBox();
		const listBox = await list.boundingBox();
		expect(Math.abs(listBox!.width - triggerBox!.width)).toBeLessThan(2);
		await page.keyboard.press("Escape");
		await expect(trigger).toBeFocused();
		await expect(dialog).toBeVisible();
	}
});
test("Select supports keyboard typeahead and theme-scoped portal; Callout is readable without live announcements", async ({
	page,
}) => {
	await page.goto("/isolation.html?lang=zh");
	const select = page.getByRole("combobox", { name: "Styled choice" });
	await select.focus();
	await page.keyboard.press("ArrowDown");
	await expect(page.getByRole("listbox")).toHaveCSS("background-color", "rgb(255, 250, 243)");
	await expect(page.getByRole("option", { name: "Alpha", exact: true })).toBeFocused();
	await page.keyboard.press("b");
	await expect(page.getByRole("option", { name: "Beta", exact: true })).toBeFocused();
	await page.keyboard.press("Enter");
	await expect(select).toContainText("Beta");
	await page.goto("/system?lang=zh");
	await expect(page.getByRole("note")).toHaveCount(5);
	await page.getByRole("note").first().getByRole("button", { name: "阅读指南" }).click();
	await expect(page).toHaveURL(/\/docs$/);
	await page.goto("/system?lang=zh");
	await page.getByRole("button", { name: "切换明暗主题" }).click();
	await page.getByRole("menuitemradio", { name: "深色", exact: true }).click();
	await page.setViewportSize({ width: 320, height: 900 });
	expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
	expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBeTruthy();
});

test("Banner dismissal and Container widths work without losing keyboard focus", async ({ page }) => {
	await page.goto("/system?lang=zh");
	await page.getByRole("button", { name: "关闭通知" }).click();
	const restore = page.getByRole("button", { name: "重新显示通知" });
	await expect(restore).toBeVisible();
	await expect(restore).toBeFocused();
	await restore.click();
	await expect(page.getByRole("region", { name: "服务通知" })).toBeVisible();
	const container = page
		.locator(".docs-card")
		.filter({ has: page.getByRole("heading", { name: "居中容器" }) })
		.locator(".mds-container");
	const dimensions = await container.evaluate((el) => {
		const c = getComputedStyle(el);
		return { width: el.getBoundingClientRect().width, max: c.maxWidth, left: c.paddingLeft, right: c.paddingRight };
	});
	expect(dimensions.width).toBeLessThanOrEqual(360);
	expect(dimensions.max).toBe("360px");
	expect(dimensions.left).toBe(dimensions.right);
	await page.setViewportSize({ width: 320, height: 900 });
	await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBeTruthy();
});
test("Select popup on a scrolling page does not shift the page or trigger", async ({ page }) => {
	await page.emulateMedia({ reducedMotion: "reduce" });
	await page.goto("/system?lang=zh");
	const trigger = page.getByRole("combobox", { name: "适用范围", exact: true });
	await trigger.scrollIntoViewIfNeeded();
	const measure = () =>
		page
			.locator(".docs-main")
			.evaluate((el) => [el.getBoundingClientRect().x, el.getBoundingClientRect().width, window.scrollY]);
	const before = await measure();
	await trigger.click();
	await expect(page.getByRole("listbox")).toBeVisible();
	expect(await measure()).toEqual(before);
	await page.keyboard.press("Escape");
	expect(await measure()).toEqual(before);
	await expect(trigger).toBeFocused();
});
