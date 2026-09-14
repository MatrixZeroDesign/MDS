import { translatePair, translate } from "./i18n";
import { PageLoading } from "./PageLoading";
import { Preview } from "./showcases/Preview";
import { lazy, type ReactNode, Suspense, useState } from "react";
import { Container, Grid, Input, Field, SegmentedControl, EmptyState, Button, Badge } from "@matrixzero/ui";
import { showcaseCatalog } from "./showcases/catalog";
import type { SceneProps } from "./showcases/shared";
import { appPath } from "./router";
const scenes = {
	"showcase-creator": lazy(() => import("./showcases/creator")),
	"showcase-finance": lazy(() => import("./showcases/finance")),
	"showcase-robotics": lazy(() => import("./showcases/robotics")),
	"showcase-smart-home": lazy(() => import("./showcases/smart-home")),
	"showcase-vehicle": lazy(() => import("./showcases/vehicle")),
	"showcase-chatbot": lazy(() => import("./showcases/chatbot")),
	"showcase-feed": lazy(() => import("./showcases/feed")),
	"showcase-projects": lazy(() => import("./showcases/projects")),
	"showcase-crm": lazy(() => import("./showcases/crm")),
	"showcase-support": lazy(() => import("./showcases/support")),
	"showcase-team": lazy(() => import("./showcases/team")),
	"showcase-billing": lazy(() => import("./showcases/billing")),
	"showcase-shop": lazy(() => import("./showcases/shop")),
	"showcase-travel": lazy(() => import("./showcases/travel")),
	"showcase-learning": lazy(() => import("./showcases/learning")),
	"showcase-music": lazy(() => import("./showcases/music")),
	"showcase-wellness": lazy(() => import("./showcases/wellness")),
};
const sources = import.meta.glob("./showcases/*.tsx", { query: "?raw", import: "default", eager: true }) as Record<
	string,
	string
>;

export function ShowcaseDetailFrame({
	locale,
	page,
	children,
	source,
}: {
	locale: SceneProps["locale"];
	page: string;
	children: ReactNode;
	source?: string;
}) {
	const t = (zh: string, en: string) => translate(locale, zh, en);
	const item = showcaseCatalog.find((entry) => entry.id === page);
	if (!item) return null;
	return (
		<Container className="sc-detail" maxWidth={1280} gutter={0}>
			<div className="sc-detail-bar">
				<a href={appPath("/showcase")}>← {t("全部场景", "All scenarios")}</a>
				<Badge>
					{item.audience === "business" ? t("企业产品", "Business product") : t("消费产品", "Consumer product")}
				</Badge>
			</div>
			<p className="docs-muted">
				{t(
					"可交互演示 · 数据仅保留在当前页面，不连接真实服务。",
					"Interactive demo · data stays on this page; no live services are connected.",
				)}
			</p>
			<section className="sc-product" aria-label={t("产品场景", "Product scenario")}>
				{children}
			</section>
			<div className="sc-components">
				<strong>{t("使用的组件", "Components used")}</strong>
				{item.components.map((name) => (
					<span key={name}>{name}</span>
				))}
			</div>
			{source && (
				<details className="sc-source">
					<summary>{t("查看场景源码", "View scenario source")}</summary>
					<p>{t("场景文件与共享布局辅助组件。", "Scene module and shared layout helpers.")}</p>
					<pre dir="ltr">
						<code>{source}</code>
					</pre>
					<pre dir="ltr">
						<code>{sources["./showcases/shared.tsx"]}</code>
					</pre>
				</details>
			)}
		</Container>
	);
}

export function ShowcasePage({ locale, page }: { locale: SceneProps["locale"]; page: string }) {
	const [filter, setFilter] = useState("all");
	const [query, setQuery] = useState("");
	const t = (zh: string, en: string) => translate(locale, zh, en);
	const businessCount = showcaseCatalog.filter((entry) => entry.audience === "business").length;
	const consumerCount = showcaseCatalog.filter((entry) => entry.audience === "consumer").length;
	const item = showcaseCatalog.find((x) => x.id === page);
	const Scene = scenes[page as keyof typeof scenes];
	if (Scene && item)
		return (
			<ShowcaseDetailFrame
				locale={locale}
				page={page}
				source={sources[`./showcases/${page.replace("showcase-", "")}.tsx`]}
			>
				<Suspense fallback={<PageLoading locale={locale} />}>
					<Scene key={`${page}-${locale}`} locale={locale} />
				</Suspense>
			</ShowcaseDetailFrame>
		);
	const visible = showcaseCatalog.filter(
		(x) =>
			(filter === "all" || x.audience === filter) &&
			(translatePair(locale, x.title) + " " + translatePair(locale, x.description))
				.toLowerCase()
				.includes(query.toLowerCase()),
	);
	return (
		<Container className="sc-gallery" maxWidth={1280} gutter={0}>
			<div className="sc-gallery-intro">
				<div>
					<span className="docs-eyebrow">
						{showcaseCatalog.length} {t("种产品体验", "PRODUCT EXPERIENCES")}
					</span>
					<h2>{t("一种设计语言，多种可能。", "One design language. Many possibilities.")}</h2>
					<p>
						{t(
							"从高效的工作台，到值得停留的日常体验。",
							"From focused workspaces to everyday experiences worth spending time with.",
						)}
					</p>
				</div>
				<div className="sc-gallery-mark" aria-hidden="true">
					{showcaseCatalog.length}
					<span>↗</span>
				</div>
			</div>
			<div className="sc-gallery-filters">
				<SegmentedControl
					label={t("场景类型", "Scenario type")}
					value={filter}
					onValueChange={setFilter}
					options={[
						{ value: "all", label: `${t("全部", "All")} · ${showcaseCatalog.length}` },
						{ value: "business", label: `${t("企业", "Business")} · ${businessCount}` },
						{ value: "consumer", label: `${t("消费", "Consumer")} · ${consumerCount}` },
					]}
				/>
				<Field label={t("搜索场景", "Search scenarios")}>
					<Input type="search" value={query} onChange={(e) => setQuery(e.target.value)} />
				</Field>
			</div>
			<Grid className="sc-gallery-grid" minColumnWidth={420} gap={24}>
				{visible.map((item) => (
					<a className="sc-gallery-card" key={item.id} href={appPath(`/${item.id}`)}>
						<div className="sc-card-art" data-audience={item.audience}>
							<span className="sc-card-number">{item.motif}</span>
							<span className="sc-card-category">
								{item.audience === "business" ? t("企业产品", "Business") : t("消费产品", "Consumer")}
							</span>
							<Preview id={item.id} />
						</div>
						<div className="sc-card-copy">
							<h3>
								{translatePair(locale, item.title)} <span aria-hidden="true">↗</span>
							</h3>
							<p>{translatePair(locale, item.description)}</p>
							<small>{item.components.join(" · ")}</small>
						</div>
					</a>
				))}
			</Grid>
			{!visible.length && (
				<EmptyState
					title={t("没有匹配场景", "No matching scenarios")}
					action={
						<Button
							onClick={() => {
								setQuery("");
								setFilter("all");
							}}
						>
							{t("清除筛选", "Clear filters")}
						</Button>
					}
				/>
			)}
		</Container>
	);
}
