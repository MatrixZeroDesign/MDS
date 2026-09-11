import { Table } from "@matrixzero/ui";

export default function Example({ locale = "zh" }: { locale?: "zh" | "en" }) {
	const t = (zh: string, en: string) => (locale === "zh" ? zh : en);
	return (
		<Table>
			<caption>{t("最近请求", "Recent requests")}</caption>
			<thead>
				<tr>
					<th scope="col">{t("模型", "Model")}</th>
					<th scope="col">{t("请求", "Requests")}</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<th scope="row">Chat</th>
					<td>128</td>
				</tr>
			</tbody>
		</Table>
	);
}
