import { Badge, Table } from "@matrixzero/ui";
export default function Example({ locale = "en" }: { locale?: "zh" | "en" }) {
	const t = (zh: string, en: string) => (locale === "zh" ? zh : en);
	return (
		<Table>
			<caption>{t("最近请求", "Recent requests")}</caption>
			<thead>
				<tr>
					<th scope="col">{t("服务", "Service")}</th>
					<th scope="col">{t("状态", "Status")}</th>
					<th scope="col" style={{ textAlign: "end" }}>
						{t("请求数", "Requests")}
					</th>
				</tr>
			</thead>
			<tbody>
				{[
					{ name: t("对话服务", "Chat service"), count: "1,284", active: true },
					{ name: t("知识检索", "Knowledge search"), count: "856", active: true },
					{ name: t("代码助手", "Code assistant"), count: "128", active: false },
				].map((row) => (
					<tr key={row.name}>
						<th scope="row">{row.name}</th>
						<td>
							<Badge tone={row.active ? "success" : "neutral"}>
								{row.active ? t("运行中", "Active") : t("已暂停", "Paused")}
							</Badge>
						</td>
						<td style={{ textAlign: "end", fontVariantNumeric: "tabular-nums" }}>{row.count}</td>
					</tr>
				))}
			</tbody>
		</Table>
	);
}
