import { useState } from "react";
import { Button, Input, Select, SegmentedControl, Dialog, DialogContent } from "@matrixzero/ui";
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
export function IconsPage({ locale }: { locale: "zh" | "en" }) {
	const t = (zh: string, en: string) => (locale === "zh" ? zh : en);
	const [query, setQuery] = useState(""),
		[category, setCategory] = useState("all"),
		[size, setSize] = useState("20");
	const [selected, setSelected] = useState<keyof typeof Icons>("Plus"),
		[copyStatus, setCopyStatus] = useState(""),
		[detailOpen, setDetailOpen] = useState(false);
	const matches = iconCatalog.filter(
		(item) =>
			(category === "all" || item.category === category) &&
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
		"} />} />";
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
			<div className="docs-icon-tools">
				<Input
					aria-label={t("搜索图标", "Search icons")}
					placeholder={t(
						"搜索名称或关键词，例如 文件、搜索、server…",
						"Search names or keywords, e.g. file, search, server…",
					)}
					value={query}
					onChange={(e) => setQuery(e.target.value)}
				/>
				<Select
					aria-label={t("图标分类", "Icon category")}
					value={category}
					onChange={(e) => setCategory(e.target.value)}
				>
					<option value="all">{t("全部分类", "All categories")}</option>
					{Object.entries(categories).map(([id, label]) => (
						<option key={id} value={id}>
							{label[locale === "zh" ? 0 : 1]} ({iconCatalog.filter((i) => i.category === id).length})
						</option>
					))}
				</Select>
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
							onClick={() => {
								setSelected(name);
								setCopyStatus("");
								setDetailOpen(true);
							}}
						>
							<span className="docs-icon-drawing">
								<Icon size={Number(size)} />
							</span>
							<code>{name}</code>
							<small>{categories[category]?.[locale === "zh" ? 0 : 1]}</small>
						</button>
					);
				})}
			</div>
			<Dialog open={detailOpen} onOpenChange={setDetailOpen}>
				<DialogContent
					title={selected}
					description={t("图标预览与 React 用法", "Icon preview and React usage")}
					closeLabel={t("关闭", "Close")}
				>
					<section className="docs-icon-usage" aria-label={t("图标用法", "Icon usage")}>
						<div className="docs-icon-preview">
							{[16, 20, 24, 48].map((value) => (
								<div key={value}>
									<SelectedIcon size={value} />
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
