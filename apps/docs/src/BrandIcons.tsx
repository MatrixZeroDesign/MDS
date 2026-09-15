import { translatePair, type DocsLocale, translate } from "./i18n";
import { useEffect, useRef, useState } from "react";
import { Button, Dialog, DialogContent, Input, SegmentedControl, Select, Typography } from "@matrixzero/ui";
import { BrandIcon, brandCatalog, type BrandIconCategory } from "@matrixzero/brand-icons";

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

const brandBatchSize = 48;

export function BrandIcons({ locale }: { locale: DocsLocale }) {
	const t = (zh: string, en: string) => translate(locale, zh, en);
	const [query, setQuery] = useState("");
	const [category, setCategory] = useState("all");
	const [variant, setVariant] = useState<"mono" | "color">("color");
	const [selectedName, setSelectedName] = useState<(typeof brandCatalog)[number]["name"]>(brandCatalog[0].name);
	const [detailOpen, setDetailOpen] = useState(false);
	const [copyStatus, setCopyStatus] = useState("");
	const [visibleCount, setVisibleCount] = useState(brandBatchSize);
	const opener = useRef<HTMLButtonElement | null>(null);
	const openedWithPointer = useRef(false);
	const loadSentinel = useRef<HTMLDivElement | null>(null);
	const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
	const matches = brandCatalog.filter(
		(brand) =>
			(category === "all" || brand.category === category) &&
			terms.every((term) => `${brand.title} ${brand.name} ${brand.component}`.toLowerCase().includes(term)),
	);
	const visibleMatches = matches.slice(0, visibleCount);
	useEffect(() => {
		setVisibleCount(brandBatchSize);
	}, [category, query]);
	useEffect(() => {
		const sentinel = loadSentinel.current;
		if (!sentinel || visibleCount >= matches.length) return;
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries.some((entry) => entry.isIntersecting)) {
					setVisibleCount((current) => Math.min(current + brandBatchSize, matches.length));
				}
			},
			{ rootMargin: "600px 0px" },
		);
		observer.observe(sentinel);
		return () => observer.disconnect();
	}, [matches.length, visibleCount]);
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
				{visibleMatches.map((brand) => (
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
			{visibleCount < matches.length && (
				<div ref={loadSentinel} className="docs-brand-load-sentinel" aria-hidden="true" />
			)}
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
