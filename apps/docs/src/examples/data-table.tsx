import { type DocsLocale, translate } from "../i18n";
import { ExampleCode } from "../ExampleCode";
import { useMemo, useState } from "react";
import { DataTable, type DataTableColumn } from "@matrixzero/ui";
import Features from "./data-table/features";
const sources = import.meta.glob("./data-table/*.tsx", { query: "?raw", import: "default", eager: true }) as Record<
	string,
	string
>;
type Row = { id: string; name: string; requests: number };
export default function Example({ locale = "en" }: { locale?: DocsLocale }) {
	const t = (zh: string, en: string) => translate(locale, zh, en);
	const rows = useMemo(
		() =>
			Array.from({ length: 10000 }, (_, index) => ({
				id: String(index + 1),
				name: translate(locale, "项目 ", "Project ") + (index + 1),
				requests: (index * 137) % 10000,
			})),
		[locale],
	);
	const columns: DataTableColumn<Row>[] = [
		{ id: "name", header: t("项目", "Project"), accessor: (row) => row.name, sortable: true, width: 220 },
		{ id: "id", header: "ID", accessor: (row) => Number(row.id), sortable: true, width: 120 },
		{
			id: "requests",
			header: t("请求数", "Requests"),
			accessor: (row) => row.requests,
			sortable: true,
			align: "end",
			width: 160,
		},
	];
	const [selected, setSelected] = useState<Set<string>>(new Set());
	return (
		<div style={{ display: "grid", gap: 32, minWidth: 0 }}>
			<p>{t("10,000 行 · 固定行高虚拟滚动", "10,000 rows · Fixed-height virtual scrolling")}</p>
			<DataTable
				rows={rows}
				columns={columns}
				getRowKey={(row) => row.id}
				label={t("项目用量", "Project usage")}
				height={360}
				selectedKeys={selected}
				onSelectionChange={setSelected}
				selectAllLabel={t("选择所有项目", "Select all projects")}
				selectionLabel={(row) => t("选择 ", "Select ") + row.name}
				emptyContent={t("暂无项目", "No projects")}
			/>
			<p role="status">
				{t("已选择", "Selected")}: {selected.size}
			</p>
			{(["pinned", "expanded", "grouped", "actions"] as const).map((feature, index) => (
				<section key={feature} style={{ display: "grid", gap: 16, minWidth: 0 }}>
					<h3>
						{
							[
								t("固定列", "Pinned columns"),
								t("展开详情", "Expandable rows"),
								t("行分组", "Row grouping"),
								t("自定义单元格与行操作", "Custom cells and row actions"),
							][index]
						}
					</h3>
					<p>
						{
							[
								t("横向滚动时，首尾列保持可见。", "Scroll horizontally; the first and last columns stay visible."),
								t(
									"展开内容具有独立的滚动区域，并兼容虚拟滚动。",
									"Expanded details have a bounded scroll area and work with virtualization.",
								),
								t("按团队分组，组标题显示行数。", "Group by team with row counts in each heading."),
								t(
									"点击行或用 Enter 打开；单元格按钮独立操作。",
									"Click a row or press Enter to open it; cell buttons act independently.",
								),
							][index]
						}
					</p>
					<Features locale={locale} feature={feature} />
					<ExampleCode locale={locale} code={'// feature="' + feature + '"\n' + sources["./data-table/features.tsx"]} />
				</section>
			))}
		</div>
	);
}
