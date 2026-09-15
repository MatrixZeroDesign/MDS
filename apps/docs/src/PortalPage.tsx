import { ArrowUpRight } from "@matrixzero/icons";
import { type DocsLocale, translate } from "./i18n";
import { useEffect, useState } from "react";
import entries from "../../../docs/content.json";
import { ComponentDocs } from "./ComponentDocs";
import { appPath, routePath } from "./router";
export function PortalPage({ locale }: { locale: DocsLocale }) {
	const [slug, setSlug] = useState(routePath().split("/")[2] || "start");
	const t = (zh: string, en: string) => translate(locale, zh, en);
	useEffect(() => {
		const sync = () => setSlug(routePath().split("/")[2] || "start");
		window.addEventListener("popstate", sync);
		return () => window.removeEventListener("popstate", sync);
	}, []);
	return (
		<>
			{slug === "start" && (
				<article className="docs-article">
					<h1>{t("快速开始", "Getting started")}</h1>
					<section className="docs-ai-entry" aria-label={t("AI 文档入口", "AI documentation entry")}>
						<p className="docs-eyebrow">FOR PEOPLE & AGENTS</p>
						<h2>{t("可阅读、可复制、可验证的组件文档", "Readable, reusable, verifiable component documentation")}</h2>
						<p>
							{t(
								`${entries.length} 篇组件指南，完整示例参与 TypeScript 检查。网站与 AI 入口从同一份内容生成。`,
								`${entries.length} component guides with type-checked examples. The website and AI entries share one source of truth.`,
							)}
						</p>
						<div className="docs-reference-footer">
							<a href={appPath("/llms.txt")}>
								llms.txt <ArrowUpRight size={"1em"} className="docs-symbol" />
							</a>
							<a href={appPath("/llms-full.txt")}>
								{t("完整 AI 文档", "Complete AI documentation")} <ArrowUpRight size={"1em"} className="docs-symbol" />
							</a>
							<a href={appPath("/docs/manifest.json")}>
								{t("版本与组件索引", "Versioned manifest")} <ArrowUpRight size={"1em"} className="docs-symbol" />
							</a>
						</div>
						<p className="docs-muted">
							{t(
								"站点与源码公开；本地 AI 也可直接读取 docs/ 和示例源文件。",
								"The site and source are public; local agents can also read docs/ and example sources directly.",
							)}
						</p>
					</section>
					<h2>{t("安装所需的包", "Install the packages you need")}</h2>
					<p>
						{t(
							"三个包独立发布。基础 UI 自动依赖 icons，charts 按需安装。",
							"Three independently published packages. UI depends on icons; charts are optional.",
						)}
					</p>
					<pre>
						<code>
							npm install --save-exact @matrixzero/ui@0.1.0-alpha.12{String.fromCharCode(10)}npm install --save-exact
							@matrixzero/charts@0.1.0-alpha.4
						</code>
					</pre>
					<p>
						{t(
							"包通过 npm 公共 registry 分发，无需额外配置。",
							"Packages use the public npm registry with no extra configuration.",
						)}
					</p>
					<h3>{t("接入主题", "Add the theme root")}</h3>
					<pre>
						<code>{`import { ThemeProvider, Field, Input, Button } from '@matrixzero/ui';
import '@matrixzero/ui/styles.css';
import '@matrixzero/ui/themes/mt0.css';

<ThemeProvider brand="mt0" mode="system" dir="ltr">
  <Field label="工作区 / Workspace" required>
    <Input name="workspace" />
  </Field>
  <Button variant="primary">保存 Save</Button>
</ThemeProvider>`}</code>
					</pre>
					<h3>{t("使用示例与 API", "Examples and API")}</h3>
					<p>
						{t(
							"“组件总览”展示真实包组件，“图表”展示可交互数据与数据表。API 页列出常用属性和组合示例，完整类型随包发布。",
							"Foundations shows real package components. Charts includes interactive examples and data tables. Each component page lists common props and compositions; full TypeScript definitions ship with each package.",
						)}
					</p>
				</article>
			)}
			{slug !== "start" && slug !== "theme-motion" && <ComponentDocs locale={locale} />}
			{slug === "theme-motion" && (
				<article className="docs-article">
					<h1>{t("主题与动效", "Themes & motion")}</h1>
					<h2>{t("颜色与注意力层级", "Color and attention")}</h2>
					<p>
						{t(
							"主色用于关键操作和表单选中状态。导航、标签页和表格选中使用中性选中色；头像占位及普通通知使用中性装饰色。成功、警告与错误保持独立语义，图表使用分类色。",
							"Reserve the accent for key actions and form selection. Navigation, tabs and selected table rows use neutral selection colors; avatar fallbacks and general notifications use neutral decoration colors. Success, warning and error retain their own semantics, while charts use categorical colors.",
						)}
					</p>
					<p>
						<code>--mds-selection-bg / --mds-selection-text</code> ·{" "}
						<code>--mds-decoration-bg / --mds-decoration-text</code>
					</p>
					<h2>{t("主题隔离与品牌契约", "Theme isolation and brand contract")}</h2>
					<p>
						{t(
							"所有样式位于 .mds-root 内。brand 显式选择已导入的品牌 CSS；未导入时使用基础语义值，不自动切换至其他品牌。浮层保留当前主题。",
							"Styles live inside .mds-root. Brand selects explicitly imported CSS; without it, base semantic tokens remain. Portals retain their current theme.",
						)}
					</p>
					<pre>
						<code>
							{
								"--mds-text / --mds-muted\n--mds-bg / --mds-surface / --mds-soft\n--mds-border / --mds-focus\n--mds-accent / --mds-on-accent / --mds-tint\n--mds-success / --mds-success-bg (warning, danger, info)\n--mds-data-1 … --mds-data-6\n--mds-font-latin / --mds-font-cjk / --mds-font-mono"
							}
						</code>
					</pre>
					<h3>{t("阅读方向：RTL 与 LTR", "Reading direction: RTL and LTR")}</h3>
					<p>
						{t(
							"语言与方向独立配置。设置 dir=rtl 可镜像布局并调整方向键行为；dir=ltr 恢复默认。浮层继承当前方向，多个主题根可使用不同方向。侧边面板优先使用 start/end；代码和时间序列数值保持从左到右阅读。",
							"Configure language and direction independently. dir=rtl mirrors layout and adjusts arrow-key behavior; dir=ltr restores the default. Portals inherit direction, and independent roots may use different directions. Prefer start/end for sheets; code and chronological data keep their left-to-right reading order.",
						)}
					</p>
					<pre>
						<code>{`<ThemeProvider dir="rtl" lang="ar">
  <Tabs defaultValue="overview">…</Tabs>
  <SideSheetContent side="end" title="…" closeLabel="…">…</SideSheetContent>
</ThemeProvider>`}</code>
					</pre>
					<h3>{t("微动效", "Micro motion")}</h3>
					<p>
						{t(
							"120ms 用于即时反馈，180ms 用于状态变化，240ms 用于侧边面板。仅移动当前组件；不缩放背景。所有非必要动效遵循减少动态效果设置。",
							"Use 120ms for immediate feedback, 180ms for state changes, and 240ms for side sheets. Animate only the active component. Respect reduced motion.",
						)}
					</p>
					<h3>{t("图标维护", "Icon governance")}</h3>
					<p>
						{t(
							"MDS 维护 340 个稳定图标名称、16/20/24px 尺寸和默认 1.75px 线宽。参考 Lucide 的清晰度独立绘制 SVG，采用 MDS 自己的几何细节。",
							"MDS maintains 340 stable icon names, 16/20/24px sizes and a 1.75px stroke. SVG shapes are independently drawn, informed by Lucide’s clarity with MDS geometric details.",
						)}
					</p>
					<h3>{t("发布与验收", "Release and validation")}</h3>
					<p>
						{t(
							"每个包独立版本，预览版本使用 next 标签。通过组件交互、中英文、明暗主题、键盘、窄屏、SSR 和安装测试后再发布。",
							"Each package has its own version. Previews use the next tag. Validate interaction, languages, themes, keyboard, narrow layouts, SSR and installation before publishing.",
						)}
					</p>
				</article>
			)}
		</>
	);
}
