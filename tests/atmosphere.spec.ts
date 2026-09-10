import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("expressive surfaces support palette selection, accessible dialog tabs and mobile themes", async ({ page }) => {
	await page.goto("/");
	const region = page.getByRole("region", { name: "渐变展示风格" });
	await region.getByRole("radio", { name: "薄荷", exact: true }).click();
	await expect(region.locator(".mds-atmosphere")).toHaveAttribute("data-tone", "mint");
	const trigger = region.getByRole("button", { name: "探索新体验" });
	await trigger.click();
	const dialog = page.getByRole("dialog", { name: "探索 Matrix" });
	await expect(dialog).toBeVisible();
	await dialog.getByRole("tab", { name: "创作", exact: true }).focus();
	await page.keyboard.press("ArrowRight");
	await expect(dialog.getByRole("tab", { name: "连接", exact: true })).toHaveAttribute("aria-selected", "true");
	await expect(dialog.getByRole("heading", { name: "把可能，连接起来。" })).toBeVisible();
	expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
	await page.keyboard.press("Escape");
	await expect(trigger).toBeFocused();
	await page.getByRole("button", { name: "切换明暗主题" }).click();
	await page.getByRole("button", { name: "Change language" }).click();
	await page.setViewportSize({ width: 320, height: 900 });
	await page.emulateMedia({ reducedMotion: "reduce" });
	await page.getByRole("button", { name: "Explore the experience" }).click();
	await expect(page.getByRole("dialog")).toHaveCSS("animation-name", "none");
	expect(await page.getByRole("dialog").evaluate((el) => el.scrollWidth <= el.clientWidth + 1)).toBeTruthy();
	expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
	await page.getByRole("button", { name: "Let’s get started" }).click();
	await expect(page.getByRole("dialog")).toHaveCount(0);
});
test("actual gradient pixels retain readable foreground contrast in all palettes and themes", async ({
	page,
}, testInfo) => {
	test.setTimeout(60000);
	await page.goto("/");
	await page.emulateMedia({ reducedMotion: "reduce" });
	const surface = page.locator(".docs-atmosphere-hero");
	const report = [];
	for (const mode of ["light", "dark"])
		for (const tone of ["iris", "mint", "peach"]) {
			await page
				.locator(".mds-root")
				.first()
				.evaluate((el, mode) => el.setAttribute("data-mds-mode", mode), mode);
			await surface.evaluate((el, tone) => {
				el.setAttribute("data-tone", tone);
				for (const child of Array.from(el.children)) (child as HTMLElement).style.visibility = "hidden";
			}, tone);
			const color = await surface.evaluate((el) => getComputedStyle(el).color);
			const png = (await surface.screenshot()).toString("base64");
			const minimum = await page.evaluate(
				async ({ png, color }) => {
					const image = new Image();
					image.src = "data:image/png;base64," + png;
					await image.decode();
					const canvas = document.createElement("canvas");
					canvas.width = image.width;
					canvas.height = image.height;
					const ctx = canvas.getContext("2d")!;
					const luminance = (rgb: number[]) => {
						const v = rgb.map((x) => x / 255).map((x) => (x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4));
						return v[0] * 0.2126 + v[1] * 0.7152 + v[2] * 0.0722;
					};
					ctx.fillStyle = color;
					ctx.fillRect(0, 0, 1, 1);
					const fg = luminance(Array.from(ctx.getImageData(0, 0, 1, 1).data).slice(0, 3));
					ctx.drawImage(image, 0, 0);
					const pixels = ctx.getImageData(0, 0, image.width, image.height).data;
					let min = Infinity;
					for (let y = 20; y < image.height - 20; y += 8)
						for (let x = 20; x < image.width - 20; x += 8) {
							const i = (y * image.width + x) * 4;
							const bg = luminance([pixels[i], pixels[i + 1], pixels[i + 2]]);
							min = Math.min(min, (Math.max(fg, bg) + 0.05) / (Math.min(fg, bg) + 0.05));
						}
					return min;
				},
				{ png, color },
			);
			expect(minimum, mode + "/" + tone).toBeGreaterThanOrEqual(4.5);
			report.push({ mode, tone, minimum });
			await surface.evaluate((el) => {
				for (const child of Array.from(el.children)) (child as HTMLElement).style.removeProperty("visibility");
			});
		}
	await testInfo.attach("gradient-contrast.json", {
		body: JSON.stringify(report, null, 2),
		contentType: "application/json",
	});
});
