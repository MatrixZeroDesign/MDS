import { languageTag, translate } from "../i18n";
import { useState } from "react";
import { Checkbox, Progress, Button } from "@matrixzero/ui";
import { BarChart } from "@matrixzero/charts";
import { Panel, Stat, translator, type SceneProps } from "./shared";
export default function Wellness({ locale }: SceneProps) {
	const t = translator(locale);
	const [done, setDone] = useState([true, false, false]);
	const [water, setWater] = useState(3);
	const habits = [
		t("户外散步二十分钟", "Take a twenty-minute walk"),
		t("阅读十页书", "Read ten pages"),
		t("睡前放下手机", "Put the phone away before bed"),
	];
	return (
		<div className="sc-stack">
			<div className="sc-hero">
				<div>
					<h2>{t("小小的坚持，也值得庆祝。", "Small steps deserve a little celebration.")}</h2>
					<p>{t("关注自己的节奏，无需追求完美。", "Find your own rhythm. Perfection is optional.")}</p>
				</div>
				<Stat label={t("今日完成", "Today’s progress")} value={`${done.filter(Boolean).length}/3`} />
			</div>
			<div className="sc-two">
				<Panel title={t("今天的习惯", "Today’s habits")}>
					{habits.map((habit, i) => (
						<label className="sc-habit" key={habit}>
							<Checkbox
								checked={done[i]}
								onCheckedChange={(v) => setDone(done.map((x, j) => (i === j ? v === true : x)))}
							/>
							<span>{habit}</span>
						</label>
					))}
					<Progress value={(done.filter(Boolean).length / 3) * 100} aria-label={t("习惯完成度", "Habit completion")} />
				</Panel>
				<Panel title={t("喝水记录", "Water journal")}>
					<Stat label={t("今日记录杯数", "Glasses logged today")} value={water} />
					<div className="sc-row">
						<Button onClick={() => setWater(water + 1)}>{t("记录一杯", "Log a glass")}</Button>
						<Button variant="secondary" disabled={!water} onClick={() => setWater(water - 1)}>
							{t("撤销一杯", "Undo a glass")}
						</Button>
					</div>
					<p>{t("按自己的需要记录，不设统一目标。", "Log what works for you, without a universal target.")}</p>
				</Panel>
			</div>
			<Panel title={t("这一周的节奏", "Your week at a glance")}>
				<BarChart
					title={t("每日完成的习惯", "Habits completed each day")}
					locale={languageTag(locale)}
					data={[
						{ label: t("周一", "Mon"), count: 2 },
						{ label: t("周二", "Tue"), count: 3 },
						{ label: t("周三", "Wed"), count: 1 },
						{ label: t("今天", "Today"), count: done.filter(Boolean).length },
					]}
					series={[{ key: "count", label: t("已完成", "Completed") }]}
					labels={{
						dataTable: t("查看数据", "View data"),
						category: t("日期", "Day"),
						empty: t("暂无数据", "No data"),
						missing: t("缺失", "Missing"),
					}}
				/>
			</Panel>
		</div>
	);
}
