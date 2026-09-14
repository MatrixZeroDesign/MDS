import { test, expect } from "@playwright/test";
test("text, action states and categorical strokes retain contrast in every theme", async ({ page }) => {
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
				expect(result.ratio, brand + "/" + mode + " " + result.fg + " on " + result.bg).toBeGreaterThanOrEqual(
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
				expect(ratio, brand + "/" + mode + " danger " + state).toBeGreaterThanOrEqual(4.5);
				if (state === "pressed") await page.mouse.up();
			}
		}
});

test("rendered notices, cards, placeholders and control outlines meet contrast thresholds", async ({
	page,
}, testInfo) => {
	await page.goto("/system?lang=zh");
	await page.emulateMedia({ reducedMotion: "reduce" });
	const report = [];
	for (const mode of ["light", "dark"]) {
		await page
			.locator(".mds-root")
			.first()
			.evaluate((el, mode) => el.setAttribute("data-mds-mode", mode), mode);
		const pairs = await page.evaluate(() => {
			const effectiveBackground = (element: Element) => {
				let current: Element | null = element;
				while (current) {
					const background = getComputedStyle(current).backgroundColor;
					if (background !== "rgba(0, 0, 0, 0)" && background !== "transparent") return background;
					current = current.parentElement;
				}
				return "rgb(255, 255, 255)";
			};
			const luminance = (color: string) => {
				const c = document.createElement("canvas").getContext("2d")!;
				c.fillStyle = color;
				c.fillRect(0, 0, 1, 1);
				const v = Array.from(c.getImageData(0, 0, 1, 1).data)
					.slice(0, 3)
					.map((n) => n / 255)
					.map((n) => (n <= 0.04045 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4));
				return v[0] * 0.2126 + v[1] * 0.7152 + v[2] * 0.0722;
			};
			const ratio = (a: string, b: string) => {
				const x = luminance(a),
					y = luminance(b);
				return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
			};
			const results = [];
			for (const el of document.querySelectorAll(".mds-callout,.mds-banner,.mds-card")) {
				const c = getComputedStyle(el);
				results.push({
					name: el.className + " " + el.getAttribute("data-tone"),
					ratio: ratio(c.color, effectiveBackground(el)),
					minimum: 4.5,
				});
			}
			const description = document.querySelector(".mds-card-description")!;
			results.push({
				name: "card description",
				ratio: ratio(
					getComputedStyle(description).color,
					getComputedStyle(description.closest(".mds-card")!).backgroundColor,
				),
				minimum: 4.5,
			});
			const input = document.querySelector('input.mds-input:not([aria-invalid="true"])')!;
			const css = getComputedStyle(input);
			results.push({ name: "input boundary", ratio: ratio(css.borderColor, css.backgroundColor), minimum: 3 });
			const placeholder = getComputedStyle(input, "::placeholder");
			results.push({ name: "placeholder", ratio: ratio(placeholder.color, css.backgroundColor), minimum: 4.5 });
			return results;
		});
		for (const pair of pairs) expect(pair.ratio, mode + " " + pair.name).toBeGreaterThanOrEqual(pair.minimum);
		report.push({ mode, pairs });
	}
	await testInfo.attach("actual-component-contrast.json", {
		body: JSON.stringify(report, null, 2),
		contentType: "application/json",
	});
});
