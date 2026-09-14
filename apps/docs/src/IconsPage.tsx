import { translatePair, type DocsLocale, translate } from "./i18n";
import { useRef, useState } from "react";
import { Button, IconButton, Input, Select, SegmentedControl, Dialog, DialogContent } from "@matrixzero/ui";
import * as Icons from "@matrixzero/icons";
import { iconCatalog } from "@matrixzero/icons/catalog";
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
export function IconsPage({ locale }: { locale: DocsLocale }) {
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
						"爱心、书签、星标、铃铛与旗帜支持独立绘制的实心版本。按钮的选中状态同时通过 aria-pressed 表达。",
						"Heart, Bookmark, Star, Bell and Flag have independently drawn filled variants. Toggle buttons also expose their state through aria-pressed.",
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
