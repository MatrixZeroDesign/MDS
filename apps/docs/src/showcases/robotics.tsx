import { Fragment, useMemo, useState } from "react";
import {
	Badge,
	Button,
	Callout,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	Dialog,
	DialogClose,
	DialogContent,
	DialogTrigger,
	Divider,
	IconButton,
	Progress,
	SelectionList,
	SelectionListItem,
} from "@matrixzero/ui";
import { AreaChart } from "@matrixzero/charts";
import {
	Activity,
	AlertCircle,
	Battery,
	Check,
	Clock,
	Cpu,
	MapPin,
	MoreHorizontal,
	Package,
	Pause,
	Play,
	Route,
	ShieldCheck,
	Stop,
	Wifi,
} from "@matrixzero/icons";
import { languageTag } from "../i18n";
import { translator, type SceneProps } from "./shared";
import "./robotics.css";

type RobotState = "active" | "charging" | "attention";

const fleet = [
	{
		id: "AMR-07",
		model: "Courier S4",
		state: "active" as RobotState,
		zone: "North aisle",
		battery: 82,
		task: "T-1842",
	},
	{ id: "AMR-12", model: "Courier S4", state: "charging" as RobotState, zone: "Dock C", battery: 41, task: "—" },
	{ id: "AMR-18", model: "Lift L2", state: "attention" as RobotState, zone: "Cold store", battery: 67, task: "T-1837" },
	{ id: "AMR-21", model: "Courier S4", state: "active" as RobotState, zone: "Packing", battery: 94, task: "T-1845" },
] as const;

const telemetry = [
	{ label: "09:24", throughput: 42, latency: 128 },
	{ label: "09:25", throughput: 46, latency: 121 },
	{ label: "09:26", throughput: 45, latency: 133 },
	{ label: "09:27", throughput: 51, latency: 117 },
	{ label: "09:28", throughput: 54, latency: 112 },
	{ label: "09:29", throughput: 52, latency: 119 },
	{ label: "09:30", throughput: 58, latency: 108 },
	{ label: "09:31", throughput: 61, latency: 104 },
	{ label: "09:32", throughput: 59, latency: 111 },
	{ label: "09:33", throughput: 64, latency: 102 },
	{ label: "09:34", throughput: 67, latency: 98 },
	{ label: "09:35", throughput: 65, latency: 101 },
] as const;

const tasks = [
	{ id: "T-1842", from: "A-14", to: "Pack 03", item: "4 totes", eta: "2m 14s", state: "In transit" },
	{ id: "T-1845", from: "B-08", to: "Pack 01", item: "2 totes", eta: "3m 02s", state: "Picking up" },
	{ id: "T-1847", from: "Dock B", to: "A-22", item: "1 pallet", eta: "Queued", state: "Queued" },
] as const;

export default function Robotics({ locale }: SceneProps) {
	const t = translator(locale);
	const [selectedId, setSelectedId] = useState<(typeof fleet)[number]["id"]>("AMR-07");
	const [paused, setPaused] = useState(false);
	const [emergencyStopped, setEmergencyStopped] = useState(false);
	const robot = useMemo(() => fleet.find((item) => item.id === selectedId) ?? fleet[0], [selectedId]);
	const operational = fleet.filter((item) => item.state === "active").length - (paused || emergencyStopped ? 1 : 0);
	const statusLabel = (state: RobotState) =>
		state === "active"
			? t("运行中", "Active")
			: state === "charging"
				? t("充电中", "Charging")
				: t("需检查", "Needs review");
	const localizeRobotText = (value: string) => {
		const labels: Record<string, string> = {
			"Courier S4": "Courier S4",
			"Lift L2": "Lift L2",
			"North aisle": "北侧通道",
			"Dock C": "C 号码头",
			"Cold store": "冷藏库",
			Packing: "打包区",
			"In transit": "运输中",
			"Picking up": "取货中",
			Queued: "排队中",
		};
		const zh = labels[value];
		return t(zh ?? value, value);
	};

	return (
		<div className="sc-robotics" data-emergency={emergencyStopped || undefined}>
			<header className="sc-robotics-header">
				<div>
					<div className="sc-robotics-kicker">
						<span className="sc-robotics-live" aria-hidden="true" />
						{t("仓库 04 · 实时运行", "WAREHOUSE 04 · LIVE OPERATIONS")}
					</div>
					<h2>{t("机器人指挥中心", "Robotics command center")}</h2>
					<p>
						{t(
							"协调机器人、任务与现场安全。",
							"Coordinate robots, missions, and floor safety from one calm workspace.",
						)}
					</p>
				</div>
				<div className="sc-robotics-header-actions">
					<Badge tone={emergencyStopped ? "danger" : "success"}>
						{emergencyStopped ? t("安全停机", "Safety stop active") : t("系统正常", "All systems nominal")}
					</Badge>
					<IconButton variant="ghost" label={t("更多控制", "More controls")} icon={<MoreHorizontal size={18} />} />
				</div>
			</header>

			{emergencyStopped && (
				<Callout tone="danger" role="status" title={t(`${robot.id} 已安全停机`, `${robot.id} is safely stopped`)}>
					{t(
						`驱动已锁定，任务 ${robot.task} 已保留。恢复前请确认现场安全。`,
						`Drive power is locked and task ${robot.task} is held. Verify the floor before recovery.`,
					)}
				</Callout>
			)}

			<section className="sc-robotics-stats" aria-label={t("车队概览", "Fleet overview")}>
				<div>
					<span>{t("在线机器人", "Robots online")}</span>
					<strong>
						24<span>/ 26</span>
					</strong>
					<small>
						<Wifi size={14} /> {t("正常运行 99.98%", "99.98% uptime")}
					</small>
				</div>
				<div>
					<span>{t("执行任务", "Missions active")}</span>
					<strong>{Math.max(0, operational + 15)}</strong>
					<small>
						<Route size={14} /> {t("7 个排队中", "7 queued")}
					</small>
				</div>
				<div>
					<span>{t("今日搬运", "Moves today")}</span>
					<strong>1,284</strong>
					<small className="sc-positive">
						<Activity size={14} /> +12.4%
					</small>
				</div>
				<div>
					<span>{t("安全事件", "Safety events")}</span>
					<strong>{emergencyStopped ? 1 : 0}</strong>
					<small>
						<ShieldCheck size={14} /> {t("过去 30 天：0", "Last 30 days: 0")}
					</small>
				</div>
			</section>

			<div className="sc-robotics-layout">
				<Card className="sc-robotics-fleet">
					<CardHeader>
						<div className="sc-robotics-title-row">
							<div>
								<CardTitle as="h3">{t("车队", "Fleet")}</CardTitle>
								<CardDescription>{t("4 台机器人 · 按状态排序", "4 robots · sorted by status")}</CardDescription>
							</div>
						</div>
					</CardHeader>
					<CardContent className="sc-robotics-fleet-list">
						<SelectionList
							className="sc-robotics-robot-options"
							label={t("选择要查看的机器人", "Choose a robot to inspect")}
							value={selectedId}
							onValueChange={(value) => {
								setSelectedId(value as (typeof fleet)[number]["id"]);
								setPaused(false);
								setEmergencyStopped(false);
							}}
						>
							{fleet.map((item) => (
								<SelectionListItem
									key={item.id}
									value={item.id}
									className="sc-robotics-robot"
									leading={
										<span className="sc-robotics-unit" data-state={item.state}>
											<Cpu size={18} />
										</span>
									}
									trailing={
										<span className="sc-robotics-robot-meta">
											<Badge
												tone={item.state === "attention" ? "warning" : item.state === "active" ? "success" : "neutral"}
											>
												{statusLabel(item.state)}
											</Badge>
											<small>
												<Battery size={13} /> {item.battery}%
											</small>
										</span>
									}
								>
									<span className="sc-robotics-robot-copy">
										<strong>{item.id}</strong>
										<small>
											{localizeRobotText(item.model)} · {localizeRobotText(item.zone)}
										</small>
									</span>
								</SelectionListItem>
							))}
						</SelectionList>
					</CardContent>
				</Card>

				<Card className="sc-robotics-map-card">
					<CardHeader>
						<div className="sc-robotics-title-row">
							<div>
								<CardTitle as="h3">
									{robot.id} · {robot.zone}
								</CardTitle>
								<CardDescription>
									{localizeRobotText(robot.model)} · {t("最后更新 2 秒前", "updated 2s ago")}
								</CardDescription>
							</div>
							<Badge tone={emergencyStopped ? "danger" : paused ? "warning" : "success"}>
								{emergencyStopped ? t("已停止", "Stopped") : paused ? t("已暂停", "Paused") : statusLabel(robot.state)}
							</Badge>
						</div>
					</CardHeader>
					<CardContent>
						<div
							className="sc-robotics-map"
							aria-label={t("机器人实时位置示意图", "Live robot position map")}
							role="img"
						>
							<div className="sc-robotics-zone sc-zone-a">A-14</div>
							<div className="sc-robotics-zone sc-zone-b">B-08</div>
							<div className="sc-robotics-zone sc-zone-pack">PACK 03</div>
							<svg viewBox="0 0 600 260" aria-hidden="true">
								<path d="M72 181 C154 181 156 88 243 88 S365 188 450 188 S506 124 548 124" />
							</svg>
							<span className="sc-robotics-node sc-node-start">
								<Package size={15} />
							</span>
							<span className="sc-robotics-node sc-node-end">
								<MapPin size={15} />
							</span>
							<span className="sc-robotics-position" data-paused={paused || emergencyStopped || undefined}>
								<Cpu size={18} />
								<i />
							</span>
						</div>
						<div className="sc-robotics-controlbar">
							<div>
								<span>{t("当前任务", "Current mission")}</span>
								<strong>{robot.task}</strong>
							</div>
							<div>
								<span>{t("速度", "Velocity")}</span>
								<strong>{paused || emergencyStopped ? "0.0" : "1.4"} m/s</strong>
							</div>
							<div className="sc-robotics-battery-reading">
								<span>{t("电量", "Battery")}</span>
								<strong>{robot.battery}%</strong>
								<Progress value={robot.battery} aria-label={t(`${robot.id} 电量`, `${robot.id} battery`)} />
							</div>
							<Button disabled={emergencyStopped} variant="secondary" onClick={() => setPaused((value) => !value)}>
								{paused ? <Play size={16} /> : <Pause size={16} />}
								{paused ? t("恢复", "Resume") : t("暂停", "Pause")}
							</Button>
							<Dialog>
								<DialogTrigger asChild>
									<Button variant="danger" className="sc-robotics-stop-trigger" disabled={emergencyStopped}>
										<Stop size={15} />
										{t("紧急停止", "Emergency stop")}
									</Button>
								</DialogTrigger>
								<DialogContent
									title={t(`紧急停止 ${robot.id}？`, `Emergency stop ${robot.id}?`)}
									description={t(
										"该操作会立即锁定驱动并保留当前任务。仅用于演示。",
										"This immediately locks drive power and holds the current mission. Demo only.",
									)}
									closeLabel={t("关闭", "Close")}
								>
									<div className="sc-robotics-dialog-icon" aria-hidden="true">
										<AlertCircle size={22} />
									</div>
									<div className="sc-robotics-dialog-actions">
										<DialogClose asChild>
											<Button>{t("取消", "Cancel")}</Button>
										</DialogClose>
										<DialogClose asChild>
											<Button
												variant="danger"
												onClick={() => {
													setEmergencyStopped(true);
													setPaused(true);
												}}
											>
												{t("确认安全停机", "Confirm safety stop")}
											</Button>
										</DialogClose>
									</div>
								</DialogContent>
							</Dialog>
						</div>
					</CardContent>
				</Card>

				<Card className="sc-robotics-tasks">
					<CardHeader>
						<CardTitle as="h3">{t("任务队列", "Mission queue")}</CardTitle>
						<CardDescription>{t("按优先级自动调度", "Autonomous dispatch by priority")}</CardDescription>
					</CardHeader>
					<CardContent className="sc-robotics-task-list">
						{tasks.map((task, index) => (
							<Fragment key={task.id}>
								<div className="sc-robotics-task">
									<span className="sc-robotics-task-index">{index === 0 ? <Route size={16} /> : index + 1}</span>
									<div>
										<strong>{task.id}</strong>
										<small>
											{localizeRobotText(task.from)} → {localizeRobotText(task.to)} · {localizeRobotText(task.item)}
										</small>
									</div>
									<div>
										<Badge tone={index === 0 ? "success" : "neutral"}>{localizeRobotText(task.state)}</Badge>
										<small>
											<Clock size={13} /> {task.eta}
										</small>
									</div>
								</div>
								{index < tasks.length - 1 && <Divider decorative />}
							</Fragment>
						))}
					</CardContent>
				</Card>

				<Card className="sc-robotics-telemetry">
					<CardHeader>
						<div className="sc-robotics-title-row">
							<div>
								<CardTitle as="h3">{t("实时遥测", "Live telemetry")}</CardTitle>
								<CardDescription>{t("过去 12 分钟 · 自动刷新", "Last 12 minutes · auto refresh")}</CardDescription>
							</div>
							<Badge>
								<span className="sc-robotics-live" /> {t("实时", "Live")}
							</Badge>
						</div>
					</CardHeader>
					<CardContent>
						<AreaChart
							title={t("车队吞吐量", "Fleet throughput")}
							description={t("每分钟完成动作", "Completed actions per minute")}
							data={telemetry}
							series={[{ key: "throughput", label: t("吞吐量", "Throughput") }]}
							height={220}
							smooth
							pointShape="none"
							locale={languageTag(locale)}
							labels={{ dataTable: t("查看数据", "View data"), category: t("时间", "Time") }}
						/>
					</CardContent>
				</Card>
			</div>

			<footer className="sc-robotics-footer">
				<span>
					<Check size={14} /> {t("SOC 2 控制已启用", "SOC 2 controls active")}
				</span>
				<span>
					<Wifi size={14} /> {t("边缘链路 18 毫秒", "Edge link 18 ms")}
				</span>
				<span>
					<Clock size={14} /> {t("班次结束于 14:00", "Shift ends 14:00")}
				</span>
			</footer>
		</div>
	);
}
