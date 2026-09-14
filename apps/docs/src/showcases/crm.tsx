import { useState } from "react";
import { Button, Input, Field, Table, Badge, Select, EmptyState } from "@matrixzero/ui";
import { Panel, Stat, translator, type SceneProps } from "./shared";
export default function CRM({ locale }: SceneProps) {
	const t = translator(locale);
	const [query, setQuery] = useState("");
	const [selected, setSelected] = useState(0);
	const [stages, setStages] = useState(["discovery", "proposal", "won"]);
	const accounts = ["Northstar Studio", "Forma Labs", "Sunday Coffee"];
	const labels = {
		discovery: t("需求沟通", "Discovery"),
		proposal: t("方案报价", "Proposal"),
		won: t("已成交", "Won"),
	};
	const values = [18000, 42000, 9600];
	return (
		<div className="sc-stack">
			<div className="sc-metrics">
				<Stat label={t("商机总额", "Pipeline value")} value="$69,600" />
				<Stat
					label={t("成交金额", "Won revenue")}
					value={`$${values.reduce((n, v, i) => n + (stages[i] === "won" ? v : 0), 0).toLocaleString("en-US")}`}
				/>
				<Stat label={t("活跃客户", "Active accounts")} value="3" />
			</div>
			<div className="sc-split">
				<Panel
					title={t("客户与商机", "Accounts & opportunities")}
					description={t(
						"选择客户，查看详情并推进销售阶段。",
						"Select an account to review and advance its opportunity.",
					)}
				>
					<Field label={t("搜索客户", "Search accounts")}>
						<Input value={query} onChange={(e) => setQuery(e.target.value)} />
					</Field>
					<Table>
						<thead>
							<tr>
								<th>{t("客户", "Account")}</th>
								<th>{t("阶段", "Stage")}</th>
								<th>{t("金额", "Value")}</th>
							</tr>
						</thead>
						<tbody>
							{accounts.map(
								(name, i) =>
									name.toLowerCase().includes(query.toLowerCase()) && (
										<tr key={name}>
											<th scope="row">
												<Button variant="ghost" aria-pressed={selected === i} onClick={() => setSelected(i)}>
													{name}
												</Button>
											</th>
											<td>
												<Badge tone={stages[i] === "won" ? "success" : "neutral"}>
													{labels[stages[i] as keyof typeof labels]}
												</Badge>
											</td>
											<td>${values[i].toLocaleString("en-US")}</td>
										</tr>
									),
							)}
						</tbody>
					</Table>
					{!accounts.some((x) => x.toLowerCase().includes(query.toLowerCase())) && (
						<EmptyState
							title={t("没有匹配客户", "No matching accounts")}
							action={<Button onClick={() => setQuery("")}>{t("清除搜索", "Clear search")}</Button>}
						/>
					)}
				</Panel>
				<Panel title={accounts[selected]} description={t("客户负责人 · Alex Morgan", "Account owner · Alex Morgan")}>
					<div className="sc-note">
						{t("下一步：确认实施时间和团队席位。", "Next step: confirm the implementation timeline and team seats.")}
					</div>
					<Field label={t("销售阶段", "Sales stage")}>
						<Select
							value={stages[selected]}
							onValueChange={(v) => setStages(stages.map((x, i) => (i === selected ? v : x)))}
							options={Object.entries(labels).map(([value, label]) => ({ value, label }))}
						/>
					</Field>
					<p role="status">
						{t("当前阶段：", "Current stage: ")}
						{labels[stages[selected] as keyof typeof labels]}
					</p>
				</Panel>
			</div>
		</div>
	);
}
