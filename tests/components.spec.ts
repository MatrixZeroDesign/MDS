import { iconCatalog } from "../packages/icons/dist/catalog.js";
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.beforeEach(async ({ page }) => {
	await page.goto("/system?lang=zh");
});
test("Field labels, validation and common control geometry", async ({ page }) => {
	const input = page.getByLabel("端点地址", { exact: true });
	await expect(input).toHaveAttribute("aria-invalid", "true");
	await input.fill("https://example.com");
	await expect(input).not.toHaveAttribute("aria-invalid", "true");
	await expect(page.getByRole("alert")).toHaveCount(0);
	const rects = await page.locator(".docs-grid .mds-input").evaluateAll((es) =>
		es.slice(0, 3).map((e) => {
			const r = e.getBoundingClientRect(),
				c = getComputedStyle(e);
			return [r.height, c.fontSize, c.lineHeight];
		}),
	);
	expect(rects[0]).toEqual(rects[1]);
	expect(rects[1]).toEqual(rects[2]);
	await page.getByLabel("工作区名称", { exact: true }).click();
	await expect(page.getByLabel("工作区名称", { exact: true })).toBeFocused();
});
test("ChoiceMenu does not lock or shift the background and restores focus", async ({ page }) => {
	const trigger = page.getByRole("button", { name: "筛选应用", exact: true });
	await trigger.scrollIntoViewIfNeeded();
	const measure = () =>
		page.locator(".docs-main").evaluate((e) => ({
			rect: [e.getBoundingClientRect().x, e.getBoundingClientRect().width],
			body: document.body.getAttribute("style"),
			lock: document.body.getAttribute("data-scroll-locked"),
		}));
	const before = await measure();
	await trigger.click();
	await expect(page.getByRole("menu")).toBeVisible();
	expect(await measure()).toEqual(before);
	await page.getByRole("menuitemradio", { name: "对话服务", exact: true }).click();
	await expect(trigger).toContainText("对话服务");
	await trigger.click();
	await page.keyboard.press("ArrowDown");
	await page.keyboard.press("Escape");
	await expect(trigger).toBeFocused();
	expect(await measure()).toEqual(before);
});
test("nested menu Escape closes only menu then dialog", async ({ page }) => {
	await page.goto("/governance?lang=en");
	await page.getByRole("button", { name: "Create release rule", exact: true }).click();
	const dialog = page.getByRole("dialog");
	await expect(dialog).toBeVisible();
	await expect(dialog).toHaveAccessibleDescription(
		"Define approval and verification requirements for production changes.",
	);
	await dialog.getByRole("combobox", { name: "Environment", exact: true }).click();
	await page.keyboard.press("Escape");
	await expect(page.getByRole("menu")).toHaveCount(0);
	await expect(dialog).toBeVisible();
	await page.keyboard.press("Escape");
	await expect(dialog).toHaveCount(0);
	await expect(page.getByRole("button", { name: "Create release rule", exact: true })).toBeFocused();
});
test("create workflow uses the same real components", async ({ page }) => {
	await page.goto("/governance?lang=en");
	await page.getByRole("button", { name: "Create release rule", exact: true }).click();
	await page.getByRole("dialog").getByLabel("Rule name", { exact: false }).fill("Production approval");
	await page.getByRole("button", { name: "Create", exact: true }).click();
	await expect(page.getByRole("dialog")).toHaveCount(0);
	await expect(page.getByLabel("Rule name", { exact: false })).toHaveValue("Production approval");
});
test("switch, checkbox labels and radio keyboard interactions", async ({ page }) => {
	const toggle = page.getByRole("switch", { name: "自动防护" });
	await expect(toggle).toBeChecked();
	await page.locator("label[for=auto]").click();
	await expect(toggle).not.toBeChecked();
	const check = page.getByRole("checkbox", { name: "自定义词库" });
	await page.getByText("自定义词库", { exact: true }).click();
	await expect(check).toBeChecked();
	await page.getByRole("radio", { name: "拦截", exact: true }).focus();
	await page.keyboard.down("ArrowRight");
	await expect(page.getByRole("radio", { name: "仅记录", exact: true })).toBeChecked();
	await page.keyboard.up("ArrowRight");
});
test("tabs and accordion respond to keyboard", async ({ page }) => {
	await page.getByRole("tab", { name: "配置", exact: true }).focus();
	await page.keyboard.press("ArrowRight");
	await expect(page.getByRole("tab", { name: "变更记录" })).toHaveAttribute("data-state", "active");
	await page.getByRole("tab", { name: "配置", exact: true }).click();
	await page.getByRole("button", { name: "之后可以更改吗？" }).click();
	await expect(page.getByText("可以，更改将应用于新请求。")).toBeVisible();
});
test("steps pagination progress and cancellation have observable effects", async ({ page }) => {
	await page.getByRole("button", { name: "继续", exact: true }).click();
	await expect(page.getByRole("heading", { name: "确认防护策略" })).toBeVisible();
	await page.getByRole("button", { name: "下一页", exact: true }).click();
	await expect(page.getByRole("button", { name: "打开数据分析", exact: true })).toBeVisible();
	await expect(page.getByRole("button", { name: "打开客户支持", exact: true })).toHaveCount(0);
	await page.getByRole("button", { name: "开始导出", exact: true }).click();
	await expect(page.getByRole("progressbar", { name: "导出进度" })).toHaveAttribute("aria-valuenow", "100", {
		timeout: 5000,
	});
});
test("native form reset restores values", async ({ page }) => {
	await page.goto("/governance?lang=en");
	const input = page.getByLabel("Rule name", { exact: false });
	await input.fill("saved");
	await page.getByRole("button", { name: "Save release rules", exact: true }).click();
	await expect(page.getByText("Release rules saved", { exact: true })).toBeVisible();
	await input.fill("unsaved");
	await page.getByRole("button", { name: "Reset", exact: true }).click();
	await expect(input).toHaveValue("saved");
});
for (const language of ["zh", "en"])
	for (const mode of ["light", "dark"]) {
		test(`accessible gallery ${language}/${mode}`, async ({ page }) => {
			if (language === "en") {
				await page.getByRole("button", { name: "Change language" }).click();
				await page.getByRole("menuitemradio", { name: /English/ }).click();
			}
			if (mode === "dark") {
				await page.getByRole("button", { name: /切换明暗主题|Toggle color theme/ }).click();
				await page.getByRole("menuitemradio", { name: language === "zh" ? "深色" : "Dark", exact: true }).click();
			}
			await page.waitForTimeout(200);
			const scan = await new AxeBuilder({ page })
				.include(".mds-root")
				.withTags(["wcag2a", "wcag2aa", "wcag21aa"])
				.analyze();
			expect(scan.violations).toEqual([]);
		});
	}
for (const width of [320, 390, 736, 1024]) {
	test(`layout fits ${width}px including English`, async ({ page }) => {
		await page.setViewportSize({ width, height: 1000 });
		await page.getByRole("button", { name: "Change language" }).click();
		await page.getByRole("menuitemradio", { name: /English/ }).click();
		const overflow = await page.locator(".mds-root").evaluate((e) => e.scrollWidth > e.clientWidth + 1);
		expect(overflow).toBe(false);
	});
}
test("reduced motion disables micro animations", async ({ page }) => {
	await page.emulateMedia({ reducedMotion: "reduce" });
	await page.getByRole("button", { name: "筛选应用", exact: true }).click();
	expect(await page.getByRole("menu").evaluate((e) => getComputedStyle(e).animationName)).toBe("none");
	expect(
		await page
			.locator(".mds-switch-thumb")
			.first()
			.evaluate((e) => getComputedStyle(e).transitionDuration),
	).toBe("0s");
});
test("table body follows product theme despite host defaults", async ({ page }) => {
	await page.getByRole("navigation", { name: "全站导航" }).getByRole("link", { name: "应用示例" }).click();
	await page.getByRole("link", { name: "运行概览", exact: true }).click();
	await page.addStyleTag({ content: "table, td {color:white}" });
	await expect(page.getByTestId("app-name").first()).toHaveCSS("color", "rgb(36, 36, 36)");
	await page.getByRole("button", { name: "切换明暗主题" }).click();
	await page.getByRole("menuitemradio", { name: "深色", exact: true }).click();
	await expect(page.getByTestId("app-name").first()).toHaveCSS("color", "rgb(243, 243, 243)");
});
test("tooltip and menu actions are functional", async ({ page }) => {
	await page.getByRole("button", { name: "提示信息", exact: true }).focus();
	await expect(page.getByRole("tooltip")).toBeVisible();
	await page.getByRole("button", { name: "更多操作" }).click();
	await page.getByRole("menuitem", { name: "分享", exact: true }).click();
	await expect(page.getByText("链接已准备好", { exact: true })).toBeVisible();
});
test("independent theme portals and uncontrolled form reset", async ({ page }) => {
	await page.goto("/isolation.html?lang=zh");
	const hostBefore = await page.locator("#host").evaluate((e) => getComputedStyle(e).color);
	await page.getByRole("button", { name: "Dark choice" }).click();
	await expect(page.getByRole("menu")).toHaveCSS("background-color", "rgb(34, 34, 34)");
	await expect(page.getByRole("menu")).toHaveCSS("color", "rgb(243, 243, 243)");
	await page.keyboard.press("Escape");
	await page.getByRole("button", { name: "Custom choice" }).click();
	await expect(page.getByRole("menu")).toHaveCSS("background-color", "rgb(255, 250, 243)");
	await expect(page.getByRole("menu")).toHaveCSS("color", "rgb(58, 48, 36)");
	await page.keyboard.press("Escape");
	await page.getByLabel("Form name").fill("Edited");
	await page.getByLabel("Native choice").selectOption("b");
	await page.getByRole("button", { name: "Reset", exact: true }).click();
	await expect(page.getByLabel("Form name")).toHaveValue("Original");
	await expect(page.getByLabel("Native choice")).toHaveValue("a");
	await expect(page.getByRole("checkbox", { name: "Mixed" })).toHaveAttribute("aria-checked", "mixed");
	await expect(page.locator(".mds-check-mixed")).toBeVisible();
	expect(await page.locator("#host").evaluate((e) => getComputedStyle(e).color)).toBe(hostBefore);
});
test("system mode follows OS preference without storage or hydration state", async ({ page }) => {
	await page.goto("/isolation.html?lang=zh");
	await page.getByTestId("dark-root").evaluate((e) => e.setAttribute("data-mds-mode", "system"));
	await page.emulateMedia({ colorScheme: "light" });
	await expect(page.getByTestId("dark-root")).toHaveCSS("color", "rgb(36, 36, 36)");
	await page.emulateMedia({ colorScheme: "dark" });
	await expect(page.getByTestId("dark-root")).toHaveCSS("color", "rgb(243, 243, 243)");
});
test("side sheet traps focus, preserves nested menu theme and returns focus", async ({ page }) => {
	const trigger = page.getByRole("button", { name: "打开侧边面板", exact: true });
	await trigger.click();
	const dialog = page.getByRole("dialog", { name: "策略详情" });
	await expect(dialog).toBeVisible();
	await expect(dialog).toHaveAccessibleDescription("无需离开当前页面即可查看和编辑。");
	await dialog.getByRole("button", { name: "面板应用范围" }).click();
	await page.keyboard.press("Escape");
	await expect(page.getByRole("menu")).toHaveCount(0);
	await expect(dialog).toBeVisible();
	await page.keyboard.press("Escape");
	await expect(dialog).toHaveCount(0);
	await expect(trigger).toBeFocused();
});
test("documentation navigation keeps full accessible item labels", async ({ page }) => {
	const nav = page.getByRole("navigation", { name: "主导航" });
	await expect(page.getByRole("button", { name: "切换导航宽度" })).toHaveCount(0);
	await expect(nav).not.toHaveAttribute("data-collapsed");
	await nav.getByRole("link", { name: "快速开始", exact: true }).click();
	await expect(page.getByRole("heading", { name: "快速开始", exact: true })).toBeVisible();
});
test("mobile navigation drawer routes and closes", async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto("/system?lang=en");
	await page.getByRole("button", { name: "Open navigation" }).click();
	const drawer = page.getByRole("dialog", { name: "MDS" });
	await expect(drawer).toBeVisible();
	await drawer.getByRole("button", { name: "Showcase", exact: true }).click();
	await page.getByRole("link", { name: /Release governance/ }).click();
	await expect(drawer).toHaveCount(0);
	await expect(page.getByRole("heading", { name: "Release governance" })).toBeVisible();
});
test("independent collapse expands and collapses with keyboard", async ({ page }) => {
	const trigger = page.getByRole("button", { name: "展开高级设置" });
	await trigger.focus();
	await page.keyboard.press("Enter");
	await expect(page.getByLabel("超时时间 / 秒")).toBeVisible();
	await page.keyboard.press("Enter");
	await expect(page.getByLabel("超时时间 / 秒")).toBeHidden();
});
test("sheet reduced motion has no slide animation", async ({ page }) => {
	await page.emulateMedia({ reducedMotion: "reduce" });
	await page.getByRole("button", { name: "打开侧边面板" }).click();
	await expect(page.getByRole("dialog")).toHaveCSS("animation-name", "none");
});
test("icon buttons expose labels and disabled actions cannot activate", async ({ page }) => {
	await page.getByRole("button", { name: "添加应用", exact: true }).click();
	await expect(page.getByText("已添加示例应用", { exact: true })).toBeVisible();
	await expect(page.getByRole("button", { name: "无权限操作" })).toBeDisabled();
});
test("segmented control supports keyboard selection and disabled options", async ({ page }) => {
	const group = page.getByRole("radiogroup", { name: "计费周期" });
	await group.getByRole("radio", { name: "月付" }).focus();
	await page.keyboard.down("ArrowRight");
	await expect(group.getByRole("radio", { name: "年付" })).toBeChecked();
	await page.keyboard.up("ArrowRight");
	await expect(group.getByRole("radio", { name: "自定义" })).toBeDisabled();
	await expect(page.getByText("按年结算，每年续订一次。")).toBeVisible();
});
test("radio cards select via whole card and preserve disabled state", async ({ page }) => {
	const group = page.getByRole("radiogroup", { name: "防护方案" });
	await group.getByText("记录结果，不拦截请求").click();
	await expect(group.getByRole("radio", { name: "观察模式", exact: true })).toBeChecked();
	await expect(group.getByRole("radio", { name: "组织管理", exact: true })).toBeDisabled();
	await expect(page.getByText("已选择观察模式")).toBeVisible();
});
test("docs portal supports search, examples and stable URLs", async ({ page }) => {
	await page.goto("/docs?lang=zh");
	await expect(page.getByRole("heading", { name: "快速开始", exact: true })).toBeVisible();
	await page.getByRole("textbox", { name: "搜索组件文档" }).fill("SideSheet");
	await page.getByRole("link", { name: /SideSheet$/, exact: true }).click();
	await expect(
		page.getByRole("heading", {
			name: /SideSheet/,
			exact: true,
		}),
	).toBeVisible();
	await expect(page.getByRole("heading", { name: "Avatar / Badge" })).toHaveCount(0);
	await page.reload();
	await expect(page.getByRole("heading", { name: /SideSheet/ })).toBeVisible();
});
test("icon portal reports the whole maintained collection and filters", async ({ page }) => {
	await page.goto("/icons?lang=zh");
	await expect(page.getByRole("status")).toContainText(`${iconCatalog.length} 个匹配图标`);
	expect(await page.locator(".docs-icon-tile").count()).toBeLessThan(iconCatalog.length);
	await page.getByRole("textbox", { name: "搜索图标" }).fill("Chevron");
	await expect(page.locator(".docs-icon-tile")).toHaveCount(8);
	await expect(page.locator(".docs-icon-tile").first().locator("svg")).toHaveCount(1);
});
test("basic charts render and expose a data table", async ({ page }) => {
	await page.goto("/charts?lang=zh");
	await expect(page.locator(".mds-chart")).toHaveCount(7);
	await expect(page.locator(".mds-chart").first().locator(".recharts-surface")).toBeVisible();
	await page.locator(".mds-chart-data summary").first().click();
	await expect(page.locator(".mds-chart-data table").first()).toContainText("1,240");
	await page.getByRole("radio", { name: "近24小时" }).click();
	await expect(page.locator(".mds-chart-data table").first()).toContainText("540");
	await expect(page.locator(".mds-chart-empty")).toContainText("暂无数据");
});
test("charts and icons fit mobile widths in both themes", async ({ page }) => {
	await page.setViewportSize({ width: 320, height: 900 });
	for (const hash of ["charts", "icons"]) {
		await page.goto("/" + hash + "?lang=zh");
		await expect
			.poll(() => page.locator(".mds-root").evaluate((e) => e.scrollWidth - e.clientWidth))
			.toBeLessThanOrEqual(1);
		await page.getByRole("button", { name: "切换明暗主题" }).click();
		await page.getByRole("menuitemradio", { name: "深色", exact: true }).click();
		await expect
			.poll(() => page.locator(".mds-root").evaluate((e) => e.scrollWidth - e.clientWidth))
			.toBeLessThanOrEqual(1);
	}
});
