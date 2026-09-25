import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("range picker selects two endpoints, submits, resets, and keeps popup scoped", async ({ page }) => {
	await page.goto("/docs/date-range-picker");
	const example = page.getByRole("region", { name: "Interactive example" });
	const trigger = example.getByRole("button", { name: /^Choose date range/ });
	await trigger.evaluate((el) => el.scrollIntoView({ block: "center" }));
	await trigger.click();
	const popup = page.locator(".mds-portals .mds-date-popover");
	await expect(popup).toBeVisible();
	await expect(popup.locator(".mds-calendar")).toHaveClass(/mds-range-calendar/);
	await popup.getByRole("button", { name: /October 18, 2026/ }).click();
	await popup.getByRole("button", { name: /October 23, 2026/ }).click();
	await expect(popup).toBeHidden();
	await example.getByRole("button", { name: "Save", exact: true }).click();
	await expect(example.getByRole("status").filter({ hasText: "2026-10-18 – 2026-10-23" })).toHaveText(
		"2026-10-18 – 2026-10-23",
	);
	await example.getByRole("button", { name: "Reset", exact: true }).click();
	await example.getByRole("button", { name: "Save", exact: true }).click();
	await expect(example.getByRole("status").filter({ hasText: "2026-10-16 – 2026-10-20" })).toHaveText(
		"2026-10-16 – 2026-10-20",
	);
	await trigger.evaluate((el) => el.scrollIntoView({ block: "center" }));
	await trigger.click();
	expect((await new AxeBuilder({ page }).include(".mds-date-popover").analyze()).violations).toEqual([]);
	await page.keyboard.press("Escape");
	await expect(trigger).toBeFocused();
});

test("range field supports manual entry and rejects reversed dates", async ({ page }) => {
	await page.goto("/docs/date-range-field");
	const example = page.getByRole("region", { name: "Interactive example" });
	await expect(page.getByRole("button", { name: /^Choose date range/ })).toHaveCount(0);
	const days = example.getByRole("spinbutton", { name: /^day,/ });
	await days.first().focus();
	await expect(days.first()).toHaveAttribute("aria-valuenow", "16");
	for (let i = 0; i < 3; i++) await page.keyboard.press("ArrowUp");
	await expect(days.first()).toHaveAttribute("aria-valuenow", "19");
	await example.getByRole("button", { name: "Save", exact: true }).click();
	await expect(example.getByRole("status").filter({ hasText: "2026-10-19 – 2026-10-20" })).toHaveText(
		"2026-10-19 – 2026-10-20",
	);
	await days.first().focus();
	for (let i = 0; i < 6; i++) await page.keyboard.press("ArrowUp");
	await expect(days.first()).toHaveAttribute("aria-valuenow", "25");
	await example.getByRole("button", { name: "Save", exact: true }).click();
	await expect(page.locator(".mds-date-range .mds-error")).toBeVisible();
	await expect(example.getByRole("status").filter({ hasText: "2026-10-19 – 2026-10-20" })).toHaveText(
		"2026-10-19 – 2026-10-20",
	);
});
