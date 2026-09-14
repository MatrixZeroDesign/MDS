import { useState } from "react";
import {
	Badge,
	Button,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	IconButton,
	SegmentedControl,
	Table,
} from "@matrixzero/ui";
import { AreaChart } from "@matrixzero/charts";
import { ArrowUpRight, Eye, EyeOff, MoreHorizontal, Plus, Wallet } from "@matrixzero/icons";
import { translator, type SceneProps } from "./shared";
import "./finance.css";

const ranges = {
	week: [42800, 43120, 42960, 43540, 43890, 44220, 44628],
	month: [39100, 39780, 40240, 39950, 41120, 41640, 42380, 41920, 43260, 43810, 44628],
	year: [28600, 30120, 29840, 32450, 33780, 35620, 34890, 37140, 38960, 40780, 42110, 44628],
} as const;

const holdings = [
	{ name: "Global index", symbol: "WORLD", value: "$19,842.16", allocation: "44.5%", change: "+1.8%" },
	{ name: "US technology", symbol: "TECH", value: "$11,703.80", allocation: "26.2%", change: "+2.4%" },
	{ name: "Green energy", symbol: "CLIMATE", value: "$7,286.42", allocation: "16.3%", change: "−0.6%" },
	{ name: "Cash reserve", symbol: "CASH", value: "$5,795.62", allocation: "13.0%", change: "+0.1%" },
] as const;

export default function Finance({ locale }: SceneProps) {
	const t = translator(locale);
	const [range, setRange] = useState<keyof typeof ranges>("month");
	const [hidden, setHidden] = useState(false);
	const [notice, setNotice] = useState("");
	const chartData = ranges[range].map((balance, index) => ({ label: `${index + 1}`, balance }));
	const money = (value: string) => (hidden ? "••••••" : value);

	return (
		<div className="sc-finance">
			<header className="sc-finance-header">
				<div>
					<span className="sc-finance-kicker">{t("9 月 13 日，星期日", "Sunday, September 13")}</span>
					<h2>{t("早上好，Avery。", "Good morning, Avery.")}</h2>
					<p>{t("清晰查看资金、目标和近期变动。", "A calm view of your money, goals, and recent movement.")}</p>
				</div>
				<div className="sc-finance-actions">
					<IconButton
						variant="ghost"
						label={hidden ? t("显示余额", "Show balances") : t("隐藏余额", "Hide balances")}
						icon={hidden ? <Eye size={18} /> : <EyeOff size={18} />}
						onClick={() => setHidden((value) => !value)}
					/>
					<Button onClick={() => setNotice(t("转账流程已打开", "Transfer flow opened"))}>
						{t("转账", "Move money")}
					</Button>
				</div>
			</header>

			{notice && (
				<div className="sc-finance-notice" role="status">
					<span>
						{notice}. {t("此预览不会转移真实资金。", "This preview does not move real funds.")}
					</span>
					<Button variant="ghost" onClick={() => setNotice("")}>
						{t("关闭", "Dismiss")}
					</Button>
				</div>
			)}

			<div className="sc-finance-overview">
				<Card variant="plain" className="sc-finance-balance">
					<CardContent>
						<span>{t("总余额", "Total balance")}</span>
						<strong>{money("$44,628.00")}</strong>
						<div className="sc-finance-change">
							<ArrowUpRight size={15} /> $1,248.40 {t("本月", "this month")}
						</div>
					</CardContent>
				</Card>
				<div className="sc-finance-accounts" aria-label={t("账户", "Accounts")}>
					<Card variant="subtle">
						<CardContent>
							<Wallet size={18} />
							<span>{t("日常账户", "Everyday")}</span>
							<strong>{money("$8,420.18")}</strong>
						</CardContent>
					</Card>
					<Card variant="subtle">
						<CardContent>
							<span className="sc-finance-account-mark">↗</span>
							<span>{t("投资", "Investments")}</span>
							<strong>{money("$36,207.82")}</strong>
						</CardContent>
					</Card>
					<IconButton
						label={t("添加账户", "Add an account")}
						icon={<Plus size={18} />}
						onClick={() => setNotice(t("账户连接已打开", "Account connection opened"))}
					/>
				</div>
			</div>

			<div className="sc-finance-grid">
				<Card className="sc-finance-chart-card">
					<CardHeader className="sc-finance-card-heading">
						<div>
							<CardTitle>{t("投资组合", "Portfolio")}</CardTitle>
							<p>{t("余额变化", "Balance over time")}</p>
						</div>
						<SegmentedControl
							label={t("投资组合周期", "Portfolio period")}
							value={range}
							onValueChange={(value) => setRange(value as keyof typeof ranges)}
							options={[
								{ value: "week", label: "1W" },
								{ value: "month", label: "1M" },
								{ value: "year", label: "1Y" },
							]}
						/>
					</CardHeader>
					<CardContent>
						<AreaChart
							title={t("投资组合余额", "Portfolio balance")}
							description={t(
								"余额历史",
								`${range === "week" ? "Seven day" : range === "month" ? "One month" : "One year"} balance history`,
							)}
							data={chartData}
							series={[{ key: "balance", label: t("余额", "Balance") }]}
							formatValue={(value) => (hidden ? t("已隐藏", "Hidden") : `$${value.toLocaleString("en-US")}`)}
							formatAxisValue={(value) => `$${Math.round(value / 1000)}k`}
							height={250}
							smooth
							pointShape="circle"
						/>
					</CardContent>
				</Card>

				<Card className="sc-finance-goal">
					<CardHeader className="sc-finance-card-heading">
						<div>
							<CardTitle>{t("购房储蓄", "Home deposit")}</CardTitle>
							<p>{t("目标 · 2027 年 6 月", "Goal · June 2027")}</p>
						</div>
						<Badge tone="success">{t("进展正常", "On track")}</Badge>
					</CardHeader>
					<CardContent>
						<div
							className="sc-finance-goal-ring"
							role="img"
							aria-label={t("目标已完成 68%", "68 percent of goal complete")}
						>
							<strong>68%</strong>
							<span>{t("已完成", "complete")}</span>
						</div>
						<div className="sc-finance-goal-copy">
							<strong>{money("$27,200")}</strong>
							<span>
								{t("目标金额", "of")} {money("$40,000")}
							</span>
							<p>{t("按目前进度，可能提前两个月达成。", "At this pace, you may arrive two months early.")}</p>
						</div>
						<Button variant="secondary" onClick={() => setNotice(t("目标追加储蓄已打开", "Goal contribution opened"))}>
							{t("追加储蓄", "Add to goal")}
						</Button>
					</CardContent>
				</Card>
			</div>

			<Card className="sc-finance-holdings">
				<CardHeader className="sc-finance-card-heading">
					<div>
						<CardTitle>{t("持仓", "Holdings")}</CardTitle>
						<p>{t("投资账户中的四项持仓", "Four positions across your investment account")}</p>
					</div>
					<IconButton
						variant="ghost"
						label={t("持仓选项", "Holding options")}
						icon={<MoreHorizontal size={18} />}
						onClick={() => setNotice(t("持仓选项已打开", "Holding options opened"))}
					/>
				</CardHeader>
				<CardContent>
					<Table>
						<thead>
							<tr>
								<th scope="col">{t("资产", "Asset")}</th>
								<th scope="col">{t("价值", "Value")}</th>
								<th scope="col">{t("配置比例", "Allocation")}</th>
								<th scope="col">{t("今日", "Today")}</th>
							</tr>
						</thead>
						<tbody>
							{holdings.map((holding) => (
								<tr key={holding.symbol}>
									<th scope="row">
										<span className="sc-finance-symbol">{holding.symbol.slice(0, 2)}</span>
										<span>
											<strong>{holding.name}</strong>
											<small>{holding.symbol}</small>
										</span>
									</th>
									<td>{money(holding.value)}</td>
									<td>{holding.allocation}</td>
									<td data-negative={holding.change.startsWith("−") || undefined}>{holding.change}</td>
								</tr>
							))}
						</tbody>
					</Table>
				</CardContent>
			</Card>
		</div>
	);
}
