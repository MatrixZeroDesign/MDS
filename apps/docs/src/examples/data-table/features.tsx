import { type DocsLocale, translate } from "../../i18n";
import { useState } from "react";
import { Badge, Button, DataTable, type DataTableColumn } from "@matrixzero/ui";
export default function Features({
	locale = "en",
	feature,
}: {
	locale?: DocsLocale;
	feature: "pinned" | "expanded" | "grouped" | "actions";
}) {
	const t = (zh: string, en: string) => translate(locale, zh, en);
	const [opened, setOpened] = useState("");
	const rows = [
		{ id: "1", name: t("设计工作区", "Design workspace"), team: t("设计", "Design"), requests: 1200 },
		{ id: "2", name: t("客户门户", "Customer portal"), team: t("产品", "Product"), requests: 850 },
		{ id: "3", name: t("组件文档", "Component docs"), team: t("设计", "Design"), requests: 420 },
	];
	const columns: DataTableColumn<(typeof rows)[number]>[] = [
		{
			id: "name",
			header: t("项目", "Project"),
			accessor: (r) => r.name,
			width: 220,
			pinned: feature === "pinned" ? "start" : undefined,
		},
		{
			id: "team",
			header: t("团队", "Team"),
			accessor: (r) => r.team,
			width: feature === "pinned" ? 380 : 140,
			cell: (r) => <Badge>{r.team}</Badge>,
		},
		{
			id: "requests",
			header: t("请求数", "Requests"),
			accessor: (r) => r.requests,
			sortable: true,
			width: feature === "pinned" ? 380 : 140,
		},
		{
			id: "action",
			header: t("操作", "Action"),
			accessor: () => "",
			width: 120,
			pinned: feature === "pinned" ? "end" : undefined,
			cell: (r) => (
				<Button size="sm" onClick={() => setOpened(t("编辑：", "Edit: ") + r.name)}>
					{t("编辑", "Edit")}
				</Button>
			),
		},
	];
	return (
		<div style={{ display: "grid", gap: 12 }}>
			<DataTable
				rows={rows}
				columns={columns}
				getRowKey={(r) => r.id}
				label={t("项目示例", "Projects") + " · " + feature}
				groupBy={feature === "grouped" ? (r) => r.team : undefined}
				renderExpandedRow={
					feature === "expanded"
						? (r) => (
								<div>
									<strong>{r.name}</strong>
									<p>{t("项目详情保留在表格上下文中。", "Project details stay within the table context.")}</p>
									<Button onClick={() => setOpened(r.name)}>{t("查看项目", "View project")}</Button>
								</div>
							)
						: undefined
				}
				expandLabel={(r) => t("展开详情：", "Expand details: ") + r.name}
				onRowClick={feature === "actions" ? (r) => setOpened(t("打开：", "Open: ") + r.name) : undefined}
			/>
			{opened && <p role="status">{opened}</p>}
		</div>
	);
}
