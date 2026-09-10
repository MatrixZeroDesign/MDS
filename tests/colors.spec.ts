import { test, expect } from "@playwright/test";
test("text, action states and categorical strokes retain contrast in every theme", async ({ page }) => {
	await page.goto("/");
	for (const brand of ["neutral", "mt0"])
		for (const mode of ["light", "dark"]) {
			await page
				.locator(".mds-root")
				.first()
				.evaluate(
					(el, { brand, mode }) => {
						el.setAttribute("data-mds-brand", brand);
						el.setAttribute("data-mds-mode", mode);
					},
					{ brand, mode },
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
				expect(result.ratio, brand + "/" + mode + " " + result.fg + " on " + result.bg).toBeGreaterThanOrEqual(
					result.min,
				);
		}
});
