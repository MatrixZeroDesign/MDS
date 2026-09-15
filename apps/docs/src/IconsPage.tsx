import { translatePair, type DocsLocale, translate } from "./i18n";
import { useRef, useState } from "react";
import {
	Button,
	IconButton,
	Input,
	Select,
	SegmentedControl,
	Dialog,
	DialogContent,
	Tabs,
	TabList,
	Tab,
	TabPanel,
	Typography,
} from "@matrixzero/ui";
import * as Icons from "@matrixzero/icons";
import { iconCatalog } from "@matrixzero/icons/catalog";
import { BrandIcon, brandCatalog, type BrandIconCategory } from "@matrixzero/brand-icons";
const categories: Record<string, [string, string]> = {
	navigation: ["导航与方向", "Navigation"],
	layout: ["布局与界面", "Layout"],
	editing: ["编辑与排版", "Editing"],
	files: ["文件与内容", "Files"],
	communication: ["通信与协作", "Communication"],
	media: ["媒体与创作", "Media"],
	development: ["开发与设施", "Development"],
	security: ["安全与身份", "Security"],
	data: ["数据与分析", "Data"],
	business: ["商业与交易", "Business"],
	everyday: ["日常与时间", "Everyday"],
};
function InterfaceIcons({ locale }: { locale: DocsLocale }) {
	const t = (zh: string, en: string) => translate(locale, zh, en);
	const [variant, setVariant] = useState<"outlined" | "filled">("outlined");
	const [liked, setLiked] = useState(false);
	const [saved, setSaved] = useState(false);
	const [starred, setStarred] = useState(false);
	const [query, setQuery] = useState(""),
		[category, setCategory] = useState("all"),
		[size, setSize] = useState("20");
	const [selected, setSelected] = useState<keyof typeof Icons>("Plus"),
		[copyStatus, setCopyStatus] = useState(""),
		[detailOpen, setDetailOpen] = useState(false);
	const matches = iconCatalog.filter(
		(item) =>
			(category === "all" || item.category === category) &&
			(variant === "outlined" || ("variants" in item && item.variants.includes("filled"))) &&
			query
				.trim()
				.toLowerCase()
				.split(/\s+/)
				.every((term) => [item.name, ...item.keywords].join(" ").toLowerCase().includes(term)),
	);
	const example =
		"import { " +
		selected +
		" } from '@matrixzero/icons';\nimport { IconButton } from '@matrixzero/ui';\n\n<IconButton label=\"" +
		t("操作名称", "Action name") +
		'\" icon={<' +
		selected +
		" size={" +
		size +
		'} variant="' +
		variant +
		'" />} />';
	const opener = useRef<HTMLButtonElement | null>(null);
	const SelectedIcon = Icons[selected];
	const copy = async () => {
		try {
			await navigator.clipboard.writeText(example);
			setCopyStatus(t("用法已复制", "Usage copied"));
		} catch {
			setCopyStatus(t("复制不可用，请选择下方代码复制", "Clipboard unavailable. Select and copy the code below."));
		}
	};
	return (
		<>
			<div className="docs-row">
				<p className="docs-muted">
					{t(
						"独立绘制 · 24px 网格 · 1.75 线宽 · 按需导入",
						"Independently drawn · 24px grid · 1.75 stroke · Tree-shakable imports",
					)}
				</p>
				<span className="docs-icon-count">
					{iconCatalog.length} {t("个图标", "icons")}
				</span>
			</div>
			<section
				className="docs-card"
				aria-label={t("选中状态示例", "Selection state example")}
				style={{ marginBlock: 24, display: "grid", gap: 16 }}
			>
				<h2 style={{ margin: 0 }}>{t("用形态表达选中状态", "Make selection visible")}</h2>
				<p className="docs-muted" style={{ margin: 0 }}>
					{t(
						"爱心、书签、星标、铃铛、旗帜与认证徽章支持独立绘制的实心版本。按钮的选中状态同时通过 aria-pressed 表达。",
						"Heart, Bookmark, Star, Bell, Flag and BadgeCheck have independently drawn filled variants. Toggle buttons also expose their state through aria-pressed.",
					)}
				</p>
				<div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
					<IconButton
						label={t("喜欢", "Like")}
						aria-pressed={liked}
						icon={<Icons.Heart size={20} variant={liked ? "filled" : "outlined"} />}
						onClick={() => setLiked(!liked)}
					/>
					<IconButton
						label={t("收藏", "Save")}
						aria-pressed={saved}
						icon={<Icons.Bookmark size={20} variant={saved ? "filled" : "outlined"} />}
						onClick={() => setSaved(!saved)}
					/>
					<IconButton
						label={t("星标", "Star")}
						aria-pressed={starred}
						icon={<Icons.Star size={20} variant={starred ? "filled" : "outlined"} />}
						onClick={() => setStarred(!starred)}
					/>
				</div>
				<pre style={{ margin: 0 }}>
					<code>{`const [liked, setLiked] = useState(false);

<IconButton
  label="${t("喜欢", "Like")}"
  aria-pressed={liked}
  onClick={() => setLiked(!liked)}
  icon={<Heart variant={liked ? "filled" : "outlined"} />}
/>`}</code>
				</pre>
			</section>
			<div className="docs-row" style={{ marginBlockEnd: 16 }}>
				<SegmentedControl
					label={t("图标样式", "Icon style")}
					value={variant}
					onValueChange={(value) => {
						setVariant(value as "outlined" | "filled");
						setSelected(value === "filled" ? "Heart" : "Share");
					}}
					options={[
						{ value: "outlined", label: t("线框", "Outlined") },
						{ value: "filled", label: t("实心", "Filled") },
					]}
				/>
				<p className="docs-muted" style={{ margin: 0 }}>
					{t(
						"实心视图只列出支持该样式的图标。其余图标传入 filled 时保持线框。",
						"Filled view lists supported icons only. Other icons retain their outline when passed filled.",
					)}
				</p>
			</div>
			<div className="docs-icon-tools">
				<Input
					aria-label={t("搜索图标", "Search icons")}
					placeholder={t(
						"搜索名称或关键词，例如 分享、爱心、书签…",
						"Search names or keywords, e.g. share, heart, bookmark…",
					)}
					value={query}
					onChange={(e) => setQuery(e.target.value)}
				/>
				<Select
					aria-label={t("图标分类", "Icon category")}
					value={category}
					onValueChange={setCategory}
					options={[
						{ value: "all", label: t("全部分类", "All categories") },
						...Object.entries(categories).map(([id, label]) => ({
							value: id,
							label: `${translatePair(locale, label)} (${iconCatalog.filter((i) => i.category === id).length})`,
						})),
					]}
				/>
				<SegmentedControl
					label={t("图标尺寸", "Icon size")}
					value={size}
					onValueChange={setSize}
					options={["16", "20", "24"].map((value) => ({ value, label: value + "px" }))}
				/>
			</div>
			<div className="docs-row docs-icon-results">
				<p role="status" className="docs-muted">
					{matches.length} {t("个匹配图标，点击查看用法", "matching icons. Select one for usage.")}
				</p>
				{(query || category !== "all") && (
					<Button
						variant="ghost"
						size="sm"
						onClick={() => {
							setQuery("");
							setCategory("all");
						}}
					>
						{t("清除筛选", "Clear filters")}
					</Button>
				)}
			</div>
			{matches.length === 0 && (
				<div className="docs-card">
					<p>{t("未找到匹配的图标，试试其他关键词或分类。", "No matching icons. Try another keyword or category.")}</p>
				</div>
			)}
			<div className="docs-icon-grid">
				{matches.map(({ name, category }) => {
					const Icon = Icons[name];
					return (
						<button
							type="button"
							className="docs-icon-tile"
							key={name}
							aria-pressed={selected === name}
							aria-haspopup="dialog"
							onClick={(event) => {
								opener.current = event.currentTarget;
								setSelected(name);
								setCopyStatus("");
								setDetailOpen(true);
							}}
						>
							<span className="docs-icon-drawing">
								<Icon size={Number(size)} variant={variant} />
							</span>
							<code>{name}</code>
							<small>{translatePair(locale, categories[category] ?? [])}</small>
						</button>
					);
				})}
			</div>
			<Dialog open={detailOpen} onOpenChange={setDetailOpen}>
				<DialogContent
					title={selected}
					onCloseAutoFocus={(event) => {
						event.preventDefault();
						opener.current?.focus();
					}}
					description={t("图标预览与 React 用法", "Icon preview and React usage")}
					closeLabel={t("关闭", "Close")}
				>
					<section className="docs-icon-usage" aria-label={t("图标用法", "Icon usage")}>
						<div className="docs-icon-preview">
							{[16, 20, 24, 48].map((value) => (
								<div key={value}>
									<SelectedIcon size={value} variant={variant} />
									<small>{value}px</small>
								</div>
							))}
						</div>
						<div className="docs-row">
							<h2>{selected}</h2>
							<Button size="sm" onClick={copy}>
								{t("复制用法", "Copy usage")}
							</Button>
						</div>
						<p role="status" className="docs-muted">
							{copyStatus ||
								t(
									"默认装饰性；独立表达含义时设置 aria-label。",
									"Decorative by default. Add aria-label when the icon conveys meaning on its own.",
								)}
						</p>
						<pre>
							<code>{example}</code>
						</pre>
					</section>
				</DialogContent>
			</Dialog>
		</>
	);
}

const brandCategories: Record<BrandIconCategory, [string, string]> = {
	"ai-provider": ["AI 服务商", "AI providers"],
	business: ["商业平台", "Business"],
	cloud: ["云平台", "Cloud"],
	collaboration: ["协作工具", "Collaboration"],
	commerce: ["商业与支付", "Commerce"],
	compute: ["芯片与算力", "Compute"],
	crypto: ["加密货币与 Web3", "Crypto & Web3"],
	data: ["数据平台", "Data"],
	design: ["设计工具", "Design"],
	development: ["开发工具", "Development"],
	media: ["媒体平台", "Media"],
	networking: ["网络基础设施", "Networking"],
	platform: ["系统与平台", "Platforms"],
	security: ["安全与身份", "Security"],
	social: ["社交平台", "Social"],
	vehicle: ["汽车与出行", "Vehicles & mobility"],
};

function BrandIcons({ locale }: { locale: DocsLocale }) {
	const t = (zh: string, en: string) => translate(locale, zh, en);
	const [query, setQuery] = useState("");
	const [category, setCategory] = useState("all");
	const [variant, setVariant] = useState<"mono" | "color">("color");
	const [selectedName, setSelectedName] = useState<(typeof brandCatalog)[number]["name"]>(brandCatalog[0].name);
	const [detailOpen, setDetailOpen] = useState(false);
	const [copyStatus, setCopyStatus] = useState("");
	const opener = useRef<HTMLButtonElement | null>(null);
	const openedWithPointer = useRef(false);
	const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
	const matches = brandCatalog.filter(
		(brand) =>
			(category === "all" || brand.category === category) &&
			terms.every((term) => `${brand.title} ${brand.name} ${brand.component}`.toLowerCase().includes(term)),
	);
	const selected = brandCatalog.find((brand) => brand.name === selectedName) ?? brandCatalog[0];
	const hasWordmark = Boolean(selected.wordmarkAsset);
	const example = `import { ${selected.component} } from '@matrixzero/brand-icons';\n\n// Controls, menus and compact lists\n<${selected.component} size={24} variant="${variant}" aria-label="${selected.title}" />;${
		hasWordmark
			? `\n\n// Brand headers and partner walls\n<${selected.component} format="wordmark" size={24} variant="${variant}" aria-label="${selected.title}" />;`
			: ""
	}\n\n// Dynamic provider names\n<BrandIcon name="${selected.name}" size={24} variant="${variant}" />;`;
	const copy = async () => {
		try {
			await navigator.clipboard.writeText(example);
			setCopyStatus(t("用法已复制", "Usage copied"));
		} catch {
			setCopyStatus(t("复制不可用，请选择下方代码复制", "Clipboard unavailable. Select and copy the code below."));
		}
	};
	const changeDetailOpen = (open: boolean) => {
		setDetailOpen(open);
	};
	const renderBrand = (
		brand: (typeof brandCatalog)[number],
		iconSize: number,
		format: "mark" | "wordmark" = "mark",
	) => (
		<span
			className={`docs-brand-icon-frame${format === "wordmark" ? " docs-brand-wordmark-frame" : ""}`}
			data-contrast-dark={(variant === "color" && brand.contrastOnDark) || undefined}
			data-contrast-light={(variant === "color" && brand.contrastOnLight) || undefined}
		>
			<BrandIcon
				className="docs-brand-icon-color"
				format={format}
				name={brand.name}
				size={iconSize}
				variant={variant}
			/>
			{variant === "color" && (brand.contrastOnDark || brand.contrastOnLight) && (
				<BrandIcon
					className="docs-brand-icon-opposite"
					format={format}
					name={brand.name}
					size={iconSize}
					variant="mono"
				/>
			)}
		</span>
	);
	return (
		<section className="docs-brand-library" aria-labelledby="brand-icons-title">
			<div className="docs-row">
				<div>
					<h2 id="brand-icons-title">{t("品牌图标", "Brand icons")}</h2>
					<p className="docs-muted">
						{t(
							"AI、产品、汽车、商业与基础设施品牌使用统一方形画布和视觉尺寸校正，同时保留原始比例。",
							"AI, product, mobility, commerce and infrastructure brands share a square frame with optical size correction while preserving original proportions.",
						)}
					</p>
				</div>
				<span className="docs-icon-count">
					{brandCatalog.length} {t("个品牌", "brands")}
				</span>
			</div>
			<div className="docs-icon-tools">
				<Input
					aria-label={t("搜索品牌图标", "Search brand icons")}
					placeholder={t("搜索服务商或产品…", "Search providers or products…")}
					value={query}
					onChange={(event) => setQuery(event.target.value)}
				/>
				<Select
					aria-label={t("品牌分类", "Brand category")}
					value={category}
					onValueChange={setCategory}
					options={[
						{ value: "all", label: t("全部品牌", "All brands") },
						...Object.entries(brandCategories).map(([id, label]) => ({
							value: id,
							label: `${translatePair(locale, label)} (${brandCatalog.filter((brand) => brand.category === id).length})`,
						})),
					]}
				/>
				<SegmentedControl
					label={t("品牌图标样式", "Brand icon style")}
					value={variant}
					onValueChange={(value) => setVariant(value as "mono" | "color")}
					options={[
						{ value: "color", label: t("品牌色", "Color") },
						{ value: "mono", label: t("单色", "Monochrome") },
					]}
				/>
			</div>
			<p role="status" className="docs-muted docs-brand-results">
				{matches.length} {t("个匹配品牌", "matching brands")}
			</p>
			<div className="docs-brand-grid">
				{matches.map((brand) => (
					<button
						type="button"
						className="docs-brand-tile"
						key={brand.name}
						aria-haspopup="dialog"
						onClick={(event) => {
							opener.current = event.currentTarget;
							openedWithPointer.current = event.detail > 0;
							setSelectedName(brand.name);
							setCopyStatus("");
							setDetailOpen(true);
						}}
					>
						{renderBrand(brand, 32)}
						<Typography as="span" variant="body-sm" tone="muted" className="docs-brand-name">
							{brand.title}
						</Typography>
						<Typography as="span" variant="caption" tone="muted" className="docs-brand-component">
							{brand.component}
						</Typography>
					</button>
				))}
			</div>
			<Dialog open={detailOpen} onOpenChange={changeDetailOpen}>
				<DialogContent
					title={selected.title}
					description={t("品牌图标预览与 React 用法", "Brand icon preview and React usage")}
					closeLabel={t("关闭", "Close")}
					onCloseAutoFocus={(event) => {
						event.preventDefault();
						if (openedWithPointer.current) opener.current?.blur();
						else opener.current?.focus();
					}}
				>
					<section className="docs-icon-usage docs-brand-icon-usage" aria-label={t("品牌图标用法", "Brand icon usage")}>
						<div className="docs-brand-mark-preview">
							<Typography as="h2" variant="title-sm">
								{t("紧凑标志", "Mark")}
							</Typography>
							<div className="docs-icon-preview">
								{[16, 24, 32, 48].map((value) => (
									<div key={value}>
										{renderBrand(selected, value)}
										<small>{value}px</small>
									</div>
								))}
							</div>
						</div>
						{hasWordmark && (
							<div className="docs-brand-wordmark-preview">
								<div>
									<Typography as="h2" variant="title-sm">
										{t("完整字标", "Wordmark")}
									</Typography>
									<Typography tone="muted" variant="body-sm">
										{t(
											"用于品牌页、合作伙伴墙和有足够横向空间的位置。",
											"Use in brand headers, partner walls and other layouts with enough horizontal space.",
										)}
									</Typography>
								</div>
								{renderBrand(selected, 24, "wordmark")}
							</div>
						)}
						<div className="docs-brand-usage-heading">
							<div className="docs-row">
								<h2>{selected.component}</h2>
								<Button size="sm" onClick={copy}>
									{t("复制用法", "Copy usage")}
								</Button>
							</div>
							<p role="status" className="docs-muted">
								{copyStatus ||
									t("发布前请确认品牌方的使用规范。", "Review the brand owner's usage guidelines before publication.")}
							</p>
						</div>
						<pre>
							<code>{example}</code>
						</pre>
					</section>
				</DialogContent>
			</Dialog>
		</section>
	);
}

export function IconsPage({ locale }: { locale: DocsLocale }) {
	const t = (zh: string, en: string) => translate(locale, zh, en);
	return (
		<Tabs defaultValue="interface">
			<TabList aria-label={t("图标库", "Icon libraries")}>
				<Tab value="interface">{t("界面图标", "Interface icons")}</Tab>
				<Tab value="brands">{t("品牌图标", "Brand icons")}</Tab>
			</TabList>
			<TabPanel value="interface">
				<InterfaceIcons locale={locale} />
			</TabPanel>
			<TabPanel value="brands">
				<BrandIcons locale={locale} />
			</TabPanel>
		</Tabs>
	);
}
