import { test, expect, type Locator } from "@playwright/test";

async function expectConnectedArrow(trigger: Locator, surface: Locator) {
	const arrow = surface.locator(".mds-popover-arrow");
	await expect(arrow).toBeVisible();
	const [triggerBox, surfaceBox, arrowBox, side] = await Promise.all([
		trigger.boundingBox(),
		surface.boundingBox(),
		arrow.boundingBox(),
		surface.getAttribute("data-side"),
	]);
	expect(triggerBox).not.toBeNull();
	expect(surfaceBox).not.toBeNull();
	expect(arrowBox).not.toBeNull();
	if (side === "top" || side === "bottom") {
		expect(Math.abs(arrowBox!.x + arrowBox!.width / 2 - (triggerBox!.x + triggerBox!.width / 2))).toBeLessThan(3);
		const seam =
			side === "bottom"
				? surfaceBox!.y - (arrowBox!.y + arrowBox!.height)
				: arrowBox!.y - (surfaceBox!.y + surfaceBox!.height);
		expect(seam).toBeGreaterThanOrEqual(-2);
		expect(seam).toBeLessThanOrEqual(0);
	} else {
		expect(Math.abs(arrowBox!.y + arrowBox!.height / 2 - (triggerBox!.y + triggerBox!.height / 2))).toBeLessThan(3);
		const seam =
			side === "right"
				? surfaceBox!.x - (arrowBox!.x + arrowBox!.width)
				: arrowBox!.x - (surfaceBox!.x + surfaceBox!.width);
		expect(seam).toBeGreaterThanOrEqual(-2);
		expect(seam).toBeLessThanOrEqual(0);
	}
}

test("popover opens in theme scope, closes with Escape, and supports controlled state", async ({ page }) => {
	await page.goto("/docs/popover");
	const trigger = page.getByRole("button", { name: "Quick settings", exact: true });
	await trigger.click();
	const dialog = page.getByRole("dialog", { name: "Workspace settings", exact: true });
	await expect(dialog).toBeVisible();
	await expect(page.locator(".mds-portals .mds-popover")).toBeVisible();
	await expect(dialog.getByRole("textbox", { name: "Name", exact: true })).toBeFocused();
	await page.keyboard.press("Escape");
	await expect(dialog).toBeHidden();
	await expect(trigger).toBeFocused();
	await page.getByRole("button", { name: "View information", exact: true }).click();
	const controlled = page.getByRole("dialog", { name: "Sync status", exact: true });
	await expect(controlled).toBeVisible();
	await expectConnectedArrow(page.getByRole("button", { name: "View information", exact: true }), controlled);
	await page.getByRole("button", { name: "Got it", exact: true }).click();
	await expect(page.getByRole("dialog", { name: "Sync status", exact: true })).toBeHidden();
});

test("popover supports click and hover interactions without losing the hover surface", async ({ page }) => {
	await page.goto("/docs/popover");
	const clickTrigger = page.getByRole("button", { name: "Open on click", exact: true });
	await clickTrigger.click();
	await expect(page.getByRole("dialog", { name: "Click interaction" })).toBeVisible();
	await page.keyboard.press("Escape");

	const hoverTrigger = page.getByRole("button", { name: "Open on hover", exact: true });
	const hoverSurface = page.getByRole("dialog", { name: "Hover interaction" });
	await hoverTrigger.hover();
	await expect(hoverSurface).toBeVisible();
	await hoverSurface.hover();
	await page.waitForTimeout(180);
	await expect(hoverSurface).toBeVisible();
	await page.mouse.move(2, 2);
	await expect(hoverSurface).toBeHidden();

	await hoverTrigger.focus();
	await expect(hoverSurface).toBeVisible();
	await page.getByRole("heading", { name: "Guide", exact: true }).click();
	await expect(hoverSurface).toBeHidden();
});

test("top popover arrow connects to the surface and points at its trigger", async ({ page }) => {
	await page.goto("/docs/popover");
	const section = page.getByRole("region", { name: "Placement and automatic collision handling" });
	const trigger = section.getByRole("button", { name: "top", exact: true });
	await trigger.click();
	await expectConnectedArrow(trigger, page.getByRole("dialog", { name: 'placement="top"' }));
});
