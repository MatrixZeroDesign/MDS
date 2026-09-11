import { useState } from "react";
import {
	Button,
	SegmentedControl,
	RadioCardGroup,
	RadioCard,
	Progress,
	Table,
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogClose,
	useToast,
} from "@matrixzero/ui";
import { Panel, Stat, translator, type SceneProps } from "./shared";
export default function Billing({ locale }: SceneProps) {
	const t = translator(locale);
	const { toast } = useToast();
	const [cycle, setCycle] = useState("monthly");
	const [plan, setPlan] = useState("pro");
	const [active, setActive] = useState("pro");
	const names = { starter: t("入门版", "Starter"), pro: t("专业版", "Pro"), scale: t("规模版", "Scale") };
	return (
		<div className="sc-stack">
			<div className="sc-metrics">
				<Stat label={t("当前方案", "Current plan")} value={names[active as keyof typeof names]} />
				<Stat label={t("本月使用量", "Usage this month")} value="7,200 / 10,000" />
			</div>
			<Progress value={72} aria-label={t("使用额度", "Usage allowance")} />
			<Panel title={t("为团队选择合适的方案", "Find your team’s next plan")}>
				<SegmentedControl
					label={t("计费周期", "Billing cycle")}
					value={cycle}
					onValueChange={setCycle}
					options={[
						{ value: "monthly", label: t("按月", "Monthly") },
						{ value: "yearly", label: t("按年 · 省 20%", "Yearly · save 20%") },
					]}
				/>
				<RadioCardGroup aria-label={t("订阅方案", "Subscription plan")} value={plan} onValueChange={setPlan}>
					{Object.entries(names).map(([value, title], i) => (
						<RadioCard
							key={value}
							value={value}
							title={title}
							description={`$${([12, 29, 79][i] * (cycle === "yearly" ? 0.8 : 1)).toFixed(2)} ${t("/ 席位 / 月", "/ seat / month")}`}
						/>
					))}
				</RadioCardGroup>
				<Dialog>
					<DialogTrigger asChild>
						<Button>{t("查看变更", "Review change")}</Button>
					</DialogTrigger>
					<DialogContent title={t("确认方案变更", "Confirm plan change")} closeLabel={t("关闭", "Close")}>
						<p>
							{names[plan as keyof typeof names]} ·{" "}
							{cycle === "monthly" ? t("按月计费", "Monthly billing") : t("按年计费", "Annual billing")}
						</p>
						<p>{t("此操作仅更新演示状态，不会扣款。", "This updates the demo only. No payment is collected.")}</p>
						<DialogClose asChild>
							<Button
								onClick={() => {
									setActive(plan);
									toast({ title: t("演示方案已更新", "Demo plan updated"), tone: "success" });
								}}
							>
								{t("确认变更", "Confirm change")}
							</Button>
						</DialogClose>
					</DialogContent>
				</Dialog>
			</Panel>
			<Panel title={t("账单记录", "Invoice history")}>
				<Table>
					<thead>
						<tr>
							<th>{t("账期", "Period")}</th>
							<th>{t("金额", "Amount")}</th>
							<th>{t("状态", "Status")}</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<th scope="row">2026-08</th>
							<td>$290.00</td>
							<td>{t("已支付", "Paid")}</td>
						</tr>
						<tr>
							<th scope="row">2026-07</th>
							<td>$290.00</td>
							<td>{t("已支付", "Paid")}</td>
						</tr>
					</tbody>
				</Table>
			</Panel>
		</div>
	);
}
