import { type DocsLocale, translate } from "./i18n";
import "@matrixzero/charts/styles.css";
import { useState } from "react";
import { Card, Badge, Button, Avatar, CheckField, Progress, Switch, SegmentedControl, useToast } from "@matrixzero/ui";
import { AreaChart } from "@matrixzero/charts";

export function SystemCompositions({ locale }: { locale: DocsLocale }) {
	const t = (zh: string, en: string) => translate(locale, zh, en);
	const { toast } = useToast();
	const [tasks, setTasks] = useState([true, true, false, false]);
	const [digest, setDigest] = useState(true);
	const [period, setPeriod] = useState("week");
	const done = tasks.filter(Boolean).length;
	const labels = [
		t("确认设计方向", "Approve the design direction"),
		t("整理组件规范", "Document the component patterns"),
		t("完成无障碍检查", "Review accessibility"),
		t("交付产品团队", "Hand off to the product team"),
	];
	return (
		<section className="system-compositions" aria-label={t("组件协作场景", "Components in context")}>
			<div className="system-composition-intro">
				<div>
					<p className="docs-eyebrow">{t("组合的力量", "BETTER TOGETHER")}</p>
					<h2>{t("从组件，到完整体验。", "Small details. A complete experience.")}</h2>
					<p>
						{t(
							"试着完成任务、切换时间范围或调整通知，感受组件如何协同。",
							"Complete a task, change the time range, or adjust notifications to see the pieces work together.",
						)}
					</p>
				</div>
				<Badge>{t("可交互场景", "Interactive compositions")}</Badge>
			</div>
			<div className="system-composition-grid">
				<Card className="system-launch">
					<div className="system-scene-heading">
						<span className="docs-eyebrow">{t("工作空间 / 设计", "WORKSPACE / DESIGN")}</span>
						<Badge>{t("进行中", "In progress")}</Badge>
					</div>
					<h3>{t("把下一个好想法，变成现实。", "Make room for your next big idea.")}</h3>
					<p className="docs-muted">
						{t(
							"一个共享的计划，让设计、工程与产品团队步调一致。",
							"One shared plan for design, engineering, and the people building what comes next.",
						)}
					</p>
					<div className="system-team">
						<div className="system-people">
							{["AL", "SK", "JM"].map((name) => (
								<Avatar key={name} alt={name} fallback={name} />
							))}
						</div>
						<span>{t("设计团队 · 3 位成员", "Design team · 3 members")}</span>
					</div>
					<div className="system-task-heading">
						<strong>{t("发布准备", "Launch checklist")}</strong>
						<span aria-live="polite">{done} / 4</span>
					</div>
					<Progress value={done * 25} aria-label={t("发布准备进度", "Launch readiness")} />
					<div className="system-tasks">
						{labels.map((label, i) => (
							<CheckField
								key={label}
								label={label}
								checked={tasks[i]}
								onCheckedChange={(value) =>
									setTasks((items) => items.map((item, index) => (index === i ? value === true : item)))
								}
							/>
						))}
					</div>
					<div className="system-launch-footer">
						<span>{t("所有更改已保存在此示例中", "Changes stay in this demo")}</span>
						<Button
							variant="primary"
							disabled={done !== 4}
							onClick={() =>
								toast({
									title: t("准备完成", "Ready to launch"),
									description: t("团队计划已完成。", "Your team's checklist is complete."),
									tone: "success",
								})
							}
						>
							{t("完成准备", "Finish preparation")}
						</Button>
					</div>
				</Card>
				<Card className="system-insights">
					<div className="system-scene-heading">
						<h3>{t("保持向前", "Keep moving forward")}</h3>
						<Badge tone="success">+18.6%</Badge>
					</div>
					<SegmentedControl
						label={t("时间范围", "Time range")}
						value={period}
						onValueChange={setPeriod}
						options={[
							{ value: "week", label: t("本周", "Week") },
							{ value: "month", label: t("本月", "Month") },
						]}
					/>
					<AreaChart
						title={t("已完成的任务", "Completed tasks")}
						description={t("演示数据 · 团队交付趋势", "Sample data · team delivery trend")}
						height={200}
						locale={locale}
						smooth
						data={Array.from({ length: period === "week" ? 7 : 30 }, (_, i) => ({
							label: String(i + 1),
							tasks: Math.round(12 + i * 1.8 + Math.sin(i * 0.8) * 5),
						}))}
						series={[{ key: "tasks", label: t("任务", "Tasks") }]}
						labels={{ dataTable: t("查看数据", "View data"), category: t("日期", "Day") }}
					/>
				</Card>
				<Card className="system-preferences">
					<p className="docs-eyebrow">{t("专注于重要的事", "A LITTLE LESS NOISE")}</p>
					<h3>{t("让消息适时到达。", "Updates, on your terms.")}</h3>
					<p className="docs-muted">
						{t(
							"把零散通知汇总成一份清晰的每日摘要。",
							"Turn scattered notifications into one considered daily summary.",
						)}
					</p>
					<div className="system-preference-row">
						<div>
							<strong>{t("每日摘要", "Daily digest")}</strong>
							<p aria-live="polite">
								{digest ? t("每天上午 9 点", "Every day at 9:00 AM") : t("已暂停摘要", "Digest paused")}
							</p>
						</div>
						<Switch aria-label={t("每日摘要", "Daily digest")} checked={digest} onCheckedChange={setDigest} />
					</div>
				</Card>
			</div>
			<p className="system-composition-caption">
				{t(
					"由真实 MDS 组件组合 · 下方继续探索基础、颜色与独立组件",
					"Built with MDS components · Continue below for foundations, color, and individual components",
				)}
			</p>
		</section>
	);
}
