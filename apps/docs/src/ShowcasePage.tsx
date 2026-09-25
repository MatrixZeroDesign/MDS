import { ArrowUpRight, ArrowLeft, Check, Code, Copy } from "@matrixzero/icons";
import { translatePair, translate } from "./i18n";
import { PageLoading } from "./PageLoading";
import { Preview } from "./showcases/Preview";
import { lazy, type ReactNode, Suspense, useState } from "react";
import {
	Container,
	Grid,
	Input,
	Field,
	SegmentedControl,
	EmptyState,
	Button,
	Badge,
	SideSheet,
	SideSheetTrigger,
	SideSheetContent,
} from "@matrixzero/ui";
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
const componentSources = import.meta.glob("./showcases/*.tsx", {
	query: "?raw",
	import: "default",
	eager: true,
}) as Record<string, string>;
const styleSources = import.meta.glob("./showcases/*.css", { query: "?raw", import: "default", eager: true }) as Record<
	string,
	string
>;

type SourceFile = { name: string; source: string; githubPath: string };

function ShowcaseSource({ locale, files }: { locale: SceneProps["locale"]; files: SourceFile[] }) {
	const t = (zh: string, en: string) => translate(locale, zh, en);
	const [activeName, setActiveName] = useState(files[0]?.name ?? "");
	const [copied, setCopied] = useState(false);
	const active = files.find((file) => file.name === activeName) ?? files[0];
	if (!active) return null;
	const githubUrl = `https://github.com/MatrixZeroDesign/MDS/blob/main/${active.githubPath}`;
	return (
		<SideSheet>
			<SideSheetTrigger asChild>
				<Button variant="secondary" className="sc-source-trigger">
					<Code size={18} aria-hidden="true" />
					{t("查看场景源码", "View scenario source")}
				</Button>
			</SideSheetTrigger>
			<SideSheetContent
				side="end"
				className="sc-source-sheet"
				title={t("场景源码", "Scenario source")}
				description={t(
					"查看、复制或分享组成此场景的真实源码。",
					"Read, copy or share the actual source files used by this scenario.",
				)}
				closeLabel={t("关闭", "Close")}
			>
				<div className="sc-source-workspace">
					<div className="sc-source-files" role="tablist" aria-label={t("源码文件", "Source files")}>
						{files.map((file) => (
							<button
								type="button"
								role="tab"
								aria-selected={file.name === active.name}
								key={file.name}
								onClick={() => {
									setActiveName(file.name);
									setCopied(false);
								}}
							>
								{file.name}
							</button>
						))}
					</div>
					<div className="sc-source-actions">
						<strong>{active.name}</strong>
						<div>
							<Button
								size="sm"
								variant="secondary"
								onClick={async () => {
									await navigator.clipboard.writeText(active.source);
									setCopied(true);
								}}
							>
								{copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
								{copied ? t("已复制", "Copied") : t("复制源码", "Copy source")}
							</Button>
							<a
								className="mds-button"
								data-variant="secondary"
								data-size="sm"
								data-shape="rounded"
								href={githubUrl}
								target="_blank"
								rel="noreferrer"
							>
								{t("在 GitHub 查看", "View on GitHub")}
								<ArrowUpRight size={16} aria-hidden="true" />
							</a>
						</div>
					</div>
					<pre className="sc-source-code" dir="ltr">
						<code>{active.source}</code>
					</pre>
				</div>
			</SideSheetContent>
		</SideSheet>
	);
}

export function ShowcaseDetailFrame({
	locale,
	page,
	children,
	sourceFiles,
}: {
	locale: SceneProps["locale"];
	page: string;
	children: ReactNode;
	sourceFiles?: SourceFile[];
}) {
	const t = (zh: string, en: string) => translate(locale, zh, en);
	const item = showcaseCatalog.find((entry) => entry.id === page);
	if (!item) return null;
	return (
		<Container className="sc-detail" maxWidth={1280} gutter={0}>
			<div className="sc-detail-bar">
				<a href={appPath("/showcase")}>
					<ArrowLeft size={"1em"} className="docs-symbol" /> {t("全部场景", "All scenarios")}
				</a>
				<Badge>
					{item.audience === "business" ? t("企业产品", "Business product") : t("消费产品", "Consumer product")}
				</Badge>
			</div>
			<section className="sc-product" aria-label={t("产品场景", "Product scenario")}>
				{children}
			</section>
			<div className="sc-components">
				<strong>{t("使用的组件", "Components used")}</strong>
				{item.components.map((name) => (
					<span key={name}>{name}</span>
				))}
			</div>
			{sourceFiles?.length ? <ShowcaseSource locale={locale} files={sourceFiles} /> : null}
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
	const sceneName = page.replace("showcase-", "");
	const scenePath = `./showcases/${sceneName}.tsx`;
	const stylePath = `./showcases/${sceneName}.css`;
	const sourceFiles: SourceFile[] = [
		{
			name: `${sceneName}.tsx`,
			source: componentSources[scenePath],
			githubPath: `apps/docs/src/showcases/${sceneName}.tsx`,
		},
		...(styleSources[stylePath]
			? [
					{
						name: `${sceneName}.css`,
						source: styleSources[stylePath],
						githubPath: `apps/docs/src/showcases/${sceneName}.css`,
					},
				]
			: []),
		{
			name: "shared.tsx",
			source: componentSources["./showcases/shared.tsx"],
			githubPath: "apps/docs/src/showcases/shared.tsx",
		},
	].filter((file) => Boolean(file.source));
	if (Scene && item)
		return (
			<ShowcaseDetailFrame locale={locale} page={page} sourceFiles={sourceFiles}>
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
					<span>
						<ArrowUpRight size={"1em"} className="docs-symbol" />
					</span>
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
								{translatePair(locale, item.title)}{" "}
								<span aria-hidden="true">
									<ArrowUpRight size={"1em"} className="docs-symbol" />
								</span>
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
