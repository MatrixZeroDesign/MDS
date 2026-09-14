import { type DocsLocale, translate } from "./i18n";
import { Card, ThemeProvider, Typography } from "@matrixzero/ui";
import { ArrowUpRight } from "@matrixzero/icons";
export function DesignPage({ locale }: { locale: DocsLocale }) {
	const t = (zh: string, en: string) => translate(locale, zh, en);
	const principles = [
		[
			t("清晰优先", "Clarity first"),
			t(
				"先让用户理解内容与下一步，再加入装饰。每个区域只突出一个主要操作。",
				"Make the content and next step clear before adding decoration. Give each region one primary action.",
			),
		],
		[
			t("克制的颜色", "Considered color"),
			t(
				"中性色承载内容，品牌色强调关键操作，状态色传达独立语义。",
				"Neutral colors carry content, brand accents highlight key actions, and status colors communicate meaning.",
			),
		],
		[
			t("一致而有温度", "Consistency with warmth"),
			t(
				"共享圆角、间距与交互节奏，用细微反馈让操作自然可信。",
				"Shared corners, spacing, and interaction rhythms create familiarity. Subtle feedback makes actions feel responsive.",
			),
		],
		[
			t("人人可用", "Built for everyone"),
			t(
				"同时设计键盘、读屏、明暗主题、中英文与双向布局，而不是事后补上。",
				"Design for keyboards, screen readers, light and dark themes, languages, and both text directions from the start.",
			),
		],
	];
	return (
		<div className="design-principles">
			<Card className="design-theme-cta">
				<div className="design-theme-cta-copy">
					<span className="docs-eyebrow">THEME BUILDER</span>
					<Typography as="h2" variant="title-lg" gutter>
						{t("创建你的主题", "Make your theme")}
					</Typography>
					<p>
						{t(
							"选择品牌色、形状、字体和界面节奏，并实时比较浅色与深色效果。",
							"Choose color, shape, type, and interface rhythm while comparing light and dark in real time.",
						)}
					</p>
					<a href="/theme-builder">
						{t("打开主题构建器", "Open theme builder")}
						<ArrowUpRight size={18} />
					</a>
				</div>
				<div className="design-theme-visual" aria-hidden="true">
					{(["light", "dark"] as const).map((mode) => (
						<ThemeProvider key={mode} mode={mode} className="design-theme-visual-mode">
							<Typography variant="caption" tone="muted">
								{mode === "light" ? "LIGHT" : "DARK"}
							</Typography>
							<div className="design-theme-visual-card">
								<span />
								<strong />
								<i />
							</div>
						</ThemeProvider>
					))}
				</div>
			</Card>
			<h2>{t("设计原则", "Design principles")}</h2>
			<div className="design-principles-grid">
				{principles.map(([title, body], i) => (
					<Card key={title}>
						<span className="docs-eyebrow">0{i + 1}</span>
						<h3>{title}</h3>
						<p>{body}</p>
					</Card>
				))}
			</div>
			<h2>{t("基础规范", "Foundations")}</h2>
			<div className="design-principles-grid">
				<Card>
					<h3>{t("间距与布局", "Spacing & layout")}</h3>
					<p>
						{t(
							"使用 4px 基础节奏；组件内部紧凑，组件之间留白，章节之间拉开层级。宽屏内容使用居中容器。",
							"Use a 4px rhythm: compact within controls, generous between groups, and clear separation between sections. Constrain content on wide screens.",
						)}
					</p>
					<div style={{ display: "flex", alignItems: "end", gap: 16, flexWrap: "wrap" }}>
						{[4, 8, 12, 16, 24, 32].map((n) => (
							<div key={n}>
								<div style={{ height: n, width: 24, background: "var(--mds-selection-text)", borderRadius: 4 }} />
								<small>{n}</small>
							</div>
						))}
					</div>
				</Card>
				<Card>
					<h3>{t("动效与无障碍", "Motion & accessibility")}</h3>
					<p>
						{t(
							"局部反馈优先，不移动背景。尊重减少动态效果设置，保留可见键盘焦点；状态不能只靠颜色辨认。",
							"Keep feedback local without moving the background. Respect reduced motion, preserve visible keyboard focus, and never communicate state through color alone.",
						)}
					</p>
					<a href="/docs/theme-motion">{t("查看实现指南", "Implementation guide")} →</a>
				</Card>
			</div>
		</div>
	);
}
