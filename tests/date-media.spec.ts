import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("date picker uses themed calendar, manual segments, native submission and reset", async ({ page }) => {
	await page.goto("/docs/date-picker");
	const example = page.getByRole("region", { name: "Interactive example" });
	const trigger = example.getByRole("button", { name: /Choose date/ });
	const before = await trigger.boundingBox();
	await trigger.click();
	await expect(page.getByRole("dialog", { name: "Choose date", exact: true })).toBeVisible();
	expect(await trigger.boundingBox()).toEqual(before);
	await expect(page.locator(".mds-portals .mds-date-popover")).toBeVisible();
	const dateCell = page.getByRole("button", { name: "Saturday, October 17, 2026", exact: true });
	await expect(dateCell).toBeVisible();
	await expect(dateCell).toHaveCSS("border-top-width", "0px");
	const adjacentCell = page.getByRole("button", { name: "Sunday, October 18, 2026", exact: true });
	const restingBackground = await adjacentCell.evaluate((element) => getComputedStyle(element).backgroundColor);
	await adjacentCell.hover();
	await expect
		.poll(() => adjacentCell.evaluate((element) => getComputedStyle(element).backgroundColor))
		.not.toBe(restingBackground);
	await dateCell.focus();
	await page.keyboard.press("ArrowRight");
	await expect(adjacentCell).toBeFocused();
	await dateCell.dispatchEvent("click");
	await expect(example.getByRole("spinbutton", { name: "day, Appointment date", exact: true })).toHaveText("17");
	await example.getByRole("spinbutton", { name: "day, Appointment date", exact: true }).focus();
	await page.keyboard.type("21");
	await example.getByRole("button", { name: "Save", exact: true }).click();
	await expect(example.getByRole("status").filter({ hasText: "2026-10-21" })).toHaveText("2026-10-21");
	await example.getByRole("button", { name: "Reset", exact: true }).click();
	await expect(example.getByRole("spinbutton", { name: "day, Appointment date", exact: true })).toHaveText("16");
	await trigger.click();
	expect((await new AxeBuilder({ page }).include(".mds-date-popover").analyze()).violations).toEqual([]);
	await page.keyboard.press("Escape");
	await expect(trigger).toBeFocused();
});
test("time picker suggestions and manual minutes work without system input", async ({ page }) => {
	await page.goto("/docs/time-picker");
	const example = page.getByRole("region", { name: "Interactive example" });
	await example.getByRole("button", { name: "Choose time", exact: true }).click();
	const suggestion = page.getByRole("option", { name: "14:30", exact: true });
	await expect(suggestion).toBeVisible();
	await suggestion.dispatchEvent("click");
	const hour = example.getByRole("spinbutton", { name: "hour, Arrival time", exact: true });
	await expect(hour).toHaveText("14");
	const minute = example.getByRole("spinbutton", { name: "minute, Arrival time", exact: true });
	await minute.focus();
	await page.keyboard.type("17");
	await hour.focus();
	await expect(minute).toHaveText("17");
	await expect(page.locator('input[type="time"],input[type="date"]')).toHaveCount(0);
	expect((await new AxeBuilder({ page }).include(".docs-live-stage").analyze()).violations).toEqual([]);
});
test("audio controls operate real media and slider keyboard input", async ({ page }) => {
	await page.goto("/showcase-music");
	const player = page.locator(".mds-audio-player");
	await player.getByRole("button", { name: /^(Play|播放)$/ }).click();
	await expect(player.getByRole("button", { name: /^(Pause|暂停)$/ })).toBeVisible();
	await expect
		.poll(() => player.locator("audio").evaluate((el: HTMLAudioElement) => el.currentTime))
		.toBeGreaterThan(0);
	await player.getByRole("button", { name: /^(Pause|暂停)$/ }).click();
	const seek = player.getByRole("slider", { name: /^(Playback position|播放进度)$/ });
	await expect(seek).toBeEnabled();
	await seek.focus();
	await page.keyboard.press("End");
	await expect
		.poll(() => player.locator("audio").evaluate((el: HTMLAudioElement) => el.currentTime))
		.toBeGreaterThan(15);
	await player.getByRole("button", { name: /^(Mute|静音)$/ }).click();
	expect(await player.locator("audio").evaluate((el: HTMLAudioElement) => el.muted)).toBe(true);
	await player.getByRole("button", { name: /^(Next track|Next|下一首)$/ }).click();
	await expect(player).toContainText(/Blue Hour|蓝色时刻/);
	expect((await new AxeBuilder({ page }).include(".mds-audio-player").analyze()).violations).toEqual([]);
});
test("chart pointer does not focus the plot, keyboard still has a focus indicator", async ({ page }) => {
	await page.goto("/showcase-wellness");
	const plot = page.locator(".recharts-wrapper").first();
	await plot
		.locator("svg")
		.first()
		.click({ position: { x: 160, y: 110 } });
	expect(
		await plot.evaluate((el) => el === document.activeElement || el.querySelector("svg") === document.activeElement),
	).toBe(false);
	const target = page.locator('.mds-chart-plot [tabindex="0"]').first();
	await page.keyboard.press("Tab");
	await target.focus();
	await expect(target).toHaveCSS("outline-style", "solid");
});
test("monochrome is default, canvas fills tall viewports and spinner respects reduced motion", async ({ page }) => {
	await page.setViewportSize({ width: 1280, height: 1900 });
	await page.goto("/overview");
	await expect(page.locator(".mds-root").first()).toHaveAttribute("data-mds-palette", "mono");
	expect((await page.locator(".docs-app").boundingBox())!.height).toBeGreaterThanOrEqual(1900);
	await page.goto("/docs/spinner");
	await expect(
		page.getByRole("region", { name: "Interactive example" }).getByRole("status", { name: "Loading content" }),
	).toBeVisible();
	await page.emulateMedia({ reducedMotion: "reduce" });
	await expect(page.locator(".mds-spinner .mds-spin").first()).toHaveCSS("animation-name", "none");
});
