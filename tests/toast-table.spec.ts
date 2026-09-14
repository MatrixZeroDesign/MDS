import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("toast stacks expand on hover and focus, pause timers and dismiss", async ({ page }) => {
	await page.emulateMedia({ reducedMotion: "reduce" });
	await page.goto("/docs/toast");
	const basic = page.getByLabel("Interactive example");
	await basic.getByRole("button", { name: "Stack three", exact: true }).click();
	const toasts = page.locator('.mds-toaster[data-placement="fixed"] .mds-toast');
	await expect(toasts).toHaveCount(3);
	const stack = page.locator('.mds-toaster[data-placement="fixed"]');
	await expect(stack).toHaveAttribute("data-expanded", "false");
	await stack.hover();
	await expect(stack).toHaveAttribute("data-expanded", "true");
	const boxes = await toasts.evaluateAll((items) =>
		items.map((item) => {
			const r = item.getBoundingClientRect();
			return { top: r.top, bottom: r.bottom };
		}),
	);
	expect(boxes[1].top - boxes[0].bottom).toBeGreaterThanOrEqual(9);
	expect(boxes[2].top - boxes[1].bottom).toBeGreaterThanOrEqual(9);
	await page.waitForTimeout(5200);
	await expect(toasts).toHaveCount(3);
	await page.mouse.move(0, 0);
	await page.getByRole("button", { name: "Dismiss notification" }).first().focus();
	await expect(stack).toHaveAttribute("data-expanded", "true");
	await page.waitForTimeout(5200);
	await expect(toasts).toHaveCount(3);
	expect((await new AxeBuilder({ page }).include(".mds-toaster").analyze()).violations).toEqual([]);
	await page.getByRole("button", { name: "Dismiss notification" }).first().click();
	await expect(toasts).toHaveCount(2);
	await basic.getByRole("button", { name: "Show actionable toast", exact: true }).focus();
	await page.mouse.move(0, 0);
	await expect(toasts).toHaveCount(0, { timeout: 6000 });
	await basic.getByRole("button", { name: "Persistent toast", exact: true }).click();
	await page.mouse.move(0, 0);
	await page.waitForTimeout(5200);
	await expect(toasts).toHaveCount(1);
	await basic.getByRole("button", { name: "Clear toasts", exact: true }).click();
	await expect(toasts).toHaveCount(0);
});
test("table row headings have body styling and numeric alignment in both directions", async ({ page }) => {
	await page.goto("/docs/table");
	const table = page.getByRole("region", { name: "Interactive example" }).getByRole("table");
	await expect(table.getByRole("row")).toHaveCount(4);
	await expect(table.locator("tbody th").first()).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
	await expect(table.locator("caption")).toHaveCSS("text-align", "start");
	for (const rtl of [false, true]) {
		if (rtl) await page.getByRole("button", { name: "Toggle reading direction" }).click();
		await expect(table.locator("tbody td").last()).toHaveCSS("text-align", "end");
		const row = table.locator("tbody tr").first();
		await row.hover();
		await expect(row.locator("th")).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
	}
	expect((await new AxeBuilder({ page }).include(".mds-table").analyze()).violations).toEqual([]);
});
test("toast remains usable on narrow RTL screens with long stacks and reduced motion", async ({ page }) => {
	await page.emulateMedia({ reducedMotion: "reduce" });
	await page.setViewportSize({ width: 320, height: 700 });
	await page.goto("/docs/toast");
	await page.getByRole("button", { name: "Toggle reading direction" }).click();
	const basic = page.getByLabel("Interactive example");
	for (let i = 0; i < 4; i++) await basic.getByRole("button", { name: "Stack three", exact: true }).click();
	await page.keyboard.press("F8");
	const stack = page.locator(".mds-toaster");
	await expect(stack).toHaveAttribute("data-expanded", "true");
	const geometry = await stack.evaluate((el) => ({
		x: el.getBoundingClientRect().x,
		right: el.getBoundingClientRect().right,
		height: el.getBoundingClientRect().height,
		scrollHeight: el.scrollHeight,
		clientHeight: el.clientHeight,
	}));
	expect(geometry.x).toBeGreaterThanOrEqual(0);
	expect(geometry.right).toBeLessThanOrEqual(320);
	expect(geometry.height).toBeLessThanOrEqual(652);
	expect(geometry.scrollHeight).toBeGreaterThan(geometry.clientHeight);
	await expect(page.locator(".mds-toast").first()).toHaveCSS("animation-name", "none");
	await page.getByRole("button", { name: "Dismiss notification" }).last().focus();
	await expect(page.getByRole("button", { name: "Dismiss notification" }).last()).toBeInViewport();
});

test("closing the final toast resets the next stack to its resting state", async ({ page }) => {
	await page.goto("/docs/toast");
	const basic = page.getByLabel("Interactive example");
	await basic.getByRole("button", { name: "Show actionable toast", exact: true }).click();
	await page.getByRole("button", { name: "Dismiss notification", exact: true }).click();
	await basic.getByRole("button", { name: "Stack three", exact: true }).click();
	await page.mouse.move(0, 0);
	await expect(page.locator('.mds-toaster[data-placement="fixed"]')).toHaveAttribute("data-expanded", "false");
	await expect(page.locator('.mds-toaster[data-placement="fixed"] .mds-toast')).toHaveCount(0, { timeout: 6000 });
});
