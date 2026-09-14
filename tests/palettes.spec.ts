import { test, expect } from "@playwright/test";
test("palette presets retain readable text, action and focus colors", async ({ page }) => {
	await page.goto("/system?lang=zh");
	await page.emulateMedia({ reducedMotion: "reduce" });
	await page
		.locator(".mds-root")
		.first()
		.evaluate((root) => {
			const button = document.createElement("button");
			button.id = "contrast-danger";
			button.type = "button";
			button.className = "mds-button";
			button.dataset.variant = "danger";
			button.textContent = "Delete";
			button.style.cssText = "position:fixed;bottom:16px;left:16px;z-index:100";
			root.append(button);
		});
	for (const palette of ["mint", "mono", "blue", "violet", "rose", "amber"])
		for (const mode of ["light", "dark"]) {
			await page
				.locator(".mds-root")
				.first()
				.evaluate(
					(el, { palette, mode }) => {
						el.setAttribute("data-mds-palette", palette);
						el.setAttribute("data-mds-mode", mode);
					},
					{ palette, mode },
				);
			const results = await page
				.locator(".mds-root")
				.first()
				.evaluate((root) => {
					const probe = document.createElement("span");
					root.append(probe);
					const canvas = document.createElement("canvas");
					canvas.width = canvas.height = 1;
					const ctx = canvas.getContext("2d")!;
					const luminance = (token: string) => {
						probe.style.color = "var(--mds-" + token + ")";
						ctx.clearRect(0, 0, 1, 1);
						ctx.fillStyle = getComputedStyle(probe).color;
						ctx.fillRect(0, 0, 1, 1);
						const rgb = Array.from(ctx.getImageData(0, 0, 1, 1).data)
							.slice(0, 3)
							.map((v) => v / 255)
							.map((v) => (v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
						return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
					};
					const pairs: [string, string, number][] = [
						["text", "surface", 4.5],
						["muted", "soft", 4.5],
						["accent", "tint", 4.5],
						["on-accent", "accent", 4.5],
						["on-accent", "accent-hover", 4.5],
						["on-accent", "accent-pressed", 4.5],
						["focus", "surface", 3],
						["control-border", "surface", 3],
						["control-border", "soft", 3],
					];
					for (const role of ["success", "warning", "danger", "info"]) pairs.push([role, role + "-bg", 4.5]);
					for (let i = 1; i <= 6; i++) pairs.push(["data-" + i, "bg", 3]);
					const out = pairs.map(([fg, bg, min]) => {
						const [lo, hi] = [luminance(fg), luminance(bg)].sort((a, b) => a - b);
						return { fg, bg, min, ratio: (hi + 0.05) / (lo + 0.05) };
					});
					probe.remove();
					return out;
				});
			for (const result of results)
				expect(result.ratio, palette + "/" + mode + " " + result.fg + " on " + result.bg).toBeGreaterThanOrEqual(
					result.min,
				);
			const action = page.locator("#contrast-danger");
			for (const state of ["rest", "hover", "pressed"]) {
				if (state === "rest") await page.mouse.move(1, 1);
				else if (state === "hover") await action.hover();
				else await page.mouse.down();
				const ratio = await action.evaluate((el) => {
					const css = getComputedStyle(el);
					const canvas = document.createElement("canvas");
					canvas.width = canvas.height = 1;
					const ctx = canvas.getContext("2d")!;
					const light = (color: string) => {
						ctx.fillStyle = color;
						ctx.fillRect(0, 0, 1, 1);
						const rgb = Array.from(ctx.getImageData(0, 0, 1, 1).data)
							.slice(0, 3)
							.map((v) => v / 255)
							.map((v) => (v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
						return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
					};
					const [lo, hi] = [light(css.color), light(css.backgroundColor)].sort((a, b) => a - b);
					return (hi + 0.05) / (lo + 0.05);
				});
				expect(ratio, palette + "/" + mode + " danger " + state).toBeGreaterThanOrEqual(4.5);
				if (state === "pressed") await page.mouse.up();
			}
		}
});
