import { useEffect, useState } from "react";
import { Tabs, TabList, Tab, TabPanel } from "@matrixzero/ui";
import { ComponentDocs } from "./ComponentDocs";
export function PortalPage({ locale }: { locale: "zh" | "en" }) {
	const [tab, setTab] = useState(location.hash.includes("/") ? "api" : "start");
	const t = (zh: string, en: string) => (locale === "zh" ? zh : en);
	useEffect(() => {
		const sync = () => {
			if (location.hash.startsWith("#docs/")) setTab("api");
		};
		window.addEventListener("hashchange", sync);
		return () => window.removeEventListener("hashchange", sync);
	}, []);
	return (
		<Tabs value={tab} onValueChange={setTab}>
			<TabList aria-label={t("文档章节", "Documentation sections")}>
				<Tab value="start">{t("快速开始", "Getting started")}</Tab>
				<Tab value="api">{t("组件 API", "Component API")}</Tab>
				<Tab value="theme">{t("主题与动效", "Themes & motion")}</Tab>
			</TabList>
			<TabPanel value="start">
				<article className="docs-article">
					<section className="docs-ai-entry" aria-label={t("AI 文档入口", "AI documentation entry")}>
						<p className="docs-eyebrow">FOR PEOPLE & AGENTS</p>
						<h2>{t("可阅读、可复制、可验证的组件文档", "Readable, reusable, verifiable component documentation")}</h2>
						<p>
							{t(
								"38 篇组件指南，完整示例参与 TypeScript 检查。网站与 AI 入口从同一份内容生成。",
								"38 component guides with type-checked examples. The website and AI entries share one source of truth.",
							)}
						</p>
						<div className="docs-reference-footer">
							<a href="./llms.txt">llms.txt ↗</a>
							<a href="./llms-full.txt">{t("完整 AI 文档", "Complete AI documentation")} ↗</a>
							<a href="./docs/manifest.json">{t("版本与组件索引", "Versioned manifest")} ↗</a>
						</div>
						<p className="docs-muted">
							{t(
								"私有站点需要 GitLab 授权；本地 AI 可直接读取仓库 docs/ 和示例源文件。",
								"Private Pages requires GitLab authorization; local agents can read docs/ and example sources directly.",
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
							npm install --save-exact @matrixzero/ui@0.1.0-alpha.3{String.fromCharCode(10)}npm install --save-exact
							@matrixzero/charts@0.1.0-alpha.2
						</code>
					</pre>
					<h3>{t("私有仓库配置", "Private registry configuration")}</h3>
					<pre>
						<code>
							{
								"@matrixzero:registry=https://gitlab.com/api/v4/projects/86296621/packages/npm/\n//gitlab.com/api/v4/projects/86296621/packages/npm/:_authToken=${MDS_NPM_TOKEN}"
							}
						</code>
					</pre>
					<p>
						{t(
							"通过环境变量注入只读令牌，不提交实际令牌。",
							"Inject a read-only token through the environment; never commit the token.",
						)}
					</p>
					<h3>{t("接入主题", "Add the theme root")}</h3>
					<pre>
						<code>{`import { ThemeProvider, Field, Input, Button } from '@matrixzero/ui';
import '@matrixzero/ui/styles.css';
import '@matrixzero/ui/themes/mt0.css';

<ThemeProvider brand="mt0" mode="system">
  <Field label="工作区 / Workspace" required>
    <Input name="workspace" />
  </Field>
  <Button variant="primary">保存 Save</Button>
</ThemeProvider>`}</code>
					</pre>
					<h3>{t("使用示例与 API", "Examples and API")}</h3>
					<p>
						{t(
							"“基础与组件”展示真实包组件，“图表”展示可交互数据与数据表。API 页列出常用属性和组合示例，完整类型随包发布。",
							"Foundations shows real package components. Charts includes interactive examples and data tables. The API tab lists common props and compositions; full TypeScript definitions ship with each package.",
						)}
					</p>
				</article>
			</TabPanel>
			<TabPanel value="api">
				<ComponentDocs locale={locale} />
			</TabPanel>
			<TabPanel value="theme">
				<article className="docs-article">
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
							"MDS 维护 320 个稳定图标名称、16/20/24px 尺寸和默认 1.75px 线宽。参考 Lucide 的清晰度独立绘制 SVG，采用 MDS 自己的几何细节。",
							"MDS maintains 320 stable icon names, 16/20/24px sizes and a 1.75px stroke. SVG shapes are independently drawn, informed by Lucide’s clarity with MDS geometric details.",
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
			</TabPanel>
		</Tabs>
	);
}
