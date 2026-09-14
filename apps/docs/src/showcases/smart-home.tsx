import { useMemo, useState } from "react";
import {
	Badge,
	Button,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	Divider,
	List,
	ListItem,
	SegmentedControl,
	Slider,
	Switch,
} from "@matrixzero/ui";
import {
	Camera,
	Coffee,
	Droplet,
	Gauge,
	Leaf,
	Lightbulb,
	Lock,
	Moon,
	Power,
	Radio,
	Sun,
	Unlock,
	Wifi,
} from "@matrixzero/icons";
import { AreaChart } from "@matrixzero/charts";
import { languageTag } from "../i18n";
import { translator, type SceneProps } from "./shared";
import "./smart-home.css";

type Room = "all" | "living" | "kitchen" | "bedroom" | "studio";
type Device = {
	id: string;
	name: string;
	meta: string;
	room: Exclude<Room, "all">;
	icon: typeof Lightbulb;
	on: boolean;
	online: boolean;
};

const initialDevices: Device[] = [
	{
		id: "living-lights",
		name: "Living room lights",
		meta: "Warm · 62%",
		room: "living",
		icon: Lightbulb,
		on: true,
		online: true,
	},
	{
		id: "front-door",
		name: "Front door",
		meta: "Locked · 2 min ago",
		room: "living",
		icon: Lock,
		on: true,
		online: true,
	},
	{
		id: "entry-camera",
		name: "Entry camera",
		meta: "Recording on motion",
		room: "living",
		icon: Camera,
		on: true,
		online: true,
	},
	{
		id: "coffee-maker",
		name: "Coffee maker",
		meta: "Ready for 7:00 AM",
		room: "kitchen",
		icon: Coffee,
		on: false,
		online: true,
	},
	{
		id: "bedroom-lamp",
		name: "Bedside lamp",
		meta: "Soft white · 28%",
		room: "bedroom",
		icon: Lightbulb,
		on: false,
		online: true,
	},
	{
		id: "studio-speaker",
		name: "Studio speaker",
		meta: "Last played: Focus mix",
		room: "studio",
		icon: Radio,
		on: false,
		online: false,
	},
];

const energy = [
	{ label: "12 AM", today: 0.34, typical: 0.42 },
	{ label: "2 AM", today: 0.29, typical: 0.35 },
	{ label: "4 AM", today: 0.27, typical: 0.33 },
	{ label: "6 AM", today: 0.48, typical: 0.57 },
	{ label: "8 AM", today: 0.91, typical: 1.06 },
	{ label: "10 AM", today: 0.56, typical: 0.72 },
	{ label: "12 PM", today: 0.63, typical: 0.79 },
	{ label: "2 PM", today: 0.51, typical: 0.68 },
	{ label: "4 PM", today: 0.78, typical: 0.87 },
	{ label: "6 PM", today: 1.18, typical: 1.29 },
	{ label: "8 PM", today: 0.94, typical: 1.11 },
	{ label: "Now", today: 0.72, typical: 0.89 },
];

export default function SmartHome({ locale }: SceneProps) {
	const t = translator(locale);
	const [room, setRoom] = useState<Room>("all");
	const [devices, setDevices] = useState(initialDevices);
	const [temperature, setTemperature] = useState(21.5);
	const [climateMode, setClimateMode] = useState("auto");
	const [activeRoutine, setActiveRoutine] = useState("evening");
	const [announcement, setAnnouncement] = useState("Everything is running normally.");

	const shownDevices = useMemo(
		() => devices.filter((device) => room === "all" || device.room === room),
		[devices, room],
	);
	const onlineCount = devices.filter((device) => device.online).length;
	const activeCount = devices.filter((device) => device.on).length;
	const deviceName = (name: string) =>
		t(
			name === "Living room lights"
				? "客厅灯"
				: name === "Front door"
					? "前门"
					: name === "Entry camera"
						? "门口摄像头"
						: name === "Coffee maker"
							? "咖啡机"
							: name === "Bedside lamp"
								? "床头灯"
								: "工作室音箱",
			name,
		);
	const deviceMeta = (device: Device) => {
		const labels: Record<string, [string, string]> = {
			"living-lights": ["暖光 · 62%", "Warm · 62%"],
			"front-door": ["已锁定 · 2 分钟前", "Locked · 2 min ago"],
			"entry-camera": ["移动侦测录像中", "Recording on motion"],
			"coffee-maker": ["准备于上午 7:00", "Ready for 7:00 AM"],
			"bedroom-lamp": ["柔白 · 28%", "Soft white · 28%"],
			"studio-speaker": ["最后播放：专注混音", "Last played: Focus mix"],
		};
		const [zh, en] = labels[device.id] ?? [device.meta, device.meta];
		return t(zh, en);
	};

	const toggleDevice = (id: string, next: boolean) => {
		const device = devices.find((item) => item.id === id);
		if (!device?.online) return;
		setDevices((current) => current.map((item) => (item.id === id ? { ...item, on: next } : item)));
		setAnnouncement(
			`${deviceName(device.name)} ${next ? t("已开启", "turned on") : t("已关闭", "turned off")}${locale === "en" ? "." : "。"}`,
		);
	};

	const runRoutine = (routine: string, message: string) => {
		setActiveRoutine(routine);
		setAnnouncement(message);
		if (routine === "away") {
			setDevices((current) =>
				current.map((device) => ({ ...device, on: device.id === "front-door" || device.id === "entry-camera" })),
			);
		}
		if (routine === "evening") {
			setDevices((current) =>
				current.map((device) => ({
					...device,
					on: ["living-lights", "front-door", "entry-camera"].includes(device.id),
				})),
			);
		}
	};

	return (
		<div className="sc-smart-home">
			<header className="sc-smart-hero">
				<div>
					<div className="sc-smart-eyebrow">
						<Badge tone="success">{t("家庭在线", "Home online")}</Badge>
						<span>
							<Wifi size={15} aria-hidden="true" /> {onlineCount}/{devices.length}{" "}
							{t("台设备在线", "devices connected")}
						</span>
					</div>
					<h2>{t("晚上好，Alex。", "Good evening, Alex.")}</h2>
					<p>{t("家里舒适又安静，一切都在按计划运行。", "Your home is comfortable, quiet, and running to plan.")}</p>
				</div>
				<Divider className="sc-smart-hero-divider sc-smart-hero-divider-vertical" orientation="vertical" />
				<Divider className="sc-smart-hero-divider sc-smart-hero-divider-horizontal" />
				<div className="sc-smart-home-score" aria-label={t("家庭状态良好", "Home status is good")}>
					<span>{t("家庭状态", "Home status")}</span>
					<strong>{t("良好", "Good")}</strong>
					<small>
						{activeCount} {t("台设备正在运行", "devices active")}
					</small>
				</div>
			</header>

			<SegmentedControl
				className="sc-smart-room-filter"
				label={t("按房间筛选设备", "Filter devices by room")}
				value={room}
				onValueChange={(value) => setRoom(value as Room)}
				options={[
					{ value: "all", label: t("全屋", "Whole home") },
					{ value: "living", label: t("客厅", "Living") },
					{ value: "kitchen", label: t("厨房", "Kitchen") },
					{ value: "bedroom", label: t("卧室", "Bedroom") },
					{ value: "studio", label: t("工作室", "Studio") },
				]}
			/>

			<div className="sc-smart-primary-grid">
				<Card className="sc-smart-climate" variant="subtle">
					<CardHeader>
						<div className="sc-smart-card-heading">
							<div>
								<CardTitle>{t("室内环境", "Indoor climate")}</CardTitle>
								<CardDescription>{t("全屋平均值，刚刚更新", "Whole-home average · updated now")}</CardDescription>
							</div>
							<Badge>{climateMode === "off" ? t("已关闭", "Off") : t("自动调节", "Balancing")}</Badge>
						</div>
					</CardHeader>
					<CardContent>
						<div className="sc-smart-temperature">
							<div className="sc-smart-temperature-value">
								<strong>{temperature.toFixed(1)}°</strong>
								<span>{t("目标温度", "Target temperature")}</span>
							</div>
							<div className="sc-smart-orbit" data-mode={climateMode} aria-hidden="true">
								<span>
									<Leaf size={22} />
								</span>
							</div>
						</div>
						<Slider
							label={t("目标温度", "Target temperature")}
							min={16}
							max={28}
							step={0.5}
							value={temperature}
							onValueChange={setTemperature}
							formatValue={(value) => `${value.toFixed(1)} °C`}
						/>
						<SegmentedControl
							label={t("空调模式", "Climate mode")}
							value={climateMode}
							onValueChange={setClimateMode}
							options={[
								{ value: "auto", label: t("自动", "Auto") },
								{ value: "heat", label: t("制热", "Heat") },
								{ value: "cool", label: t("制冷", "Cool") },
								{ value: "off", label: t("关闭", "Off") },
							]}
						/>
						<div className="sc-smart-air-grid">
							<div>
								<Leaf size={17} aria-hidden="true" />
								<span>{t("空气质量", "Air quality")}</span>
								<strong>{t("优秀", "Excellent")}</strong>
							</div>
							<div>
								<Droplet size={17} aria-hidden="true" />
								<span>{t("湿度", "Humidity")}</span>
								<strong>46%</strong>
							</div>
							<div>
								<Gauge size={17} aria-hidden="true" />
								<span>CO₂</span>
								<strong>512 ppm</strong>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="sc-smart-devices">
					<CardHeader>
						<div className="sc-smart-card-heading">
							<div>
								<CardTitle>{t("设备", "Devices")}</CardTitle>
								<CardDescription>
									{t("在一个地方控制已连接的设备", "Control connected devices in one place")}
								</CardDescription>
							</div>
							<span className="sc-smart-device-count">{shownDevices.length}</span>
						</div>
					</CardHeader>
					<CardContent className="sc-smart-device-grid">
						{shownDevices.map((device) => {
							const Icon = device.id === "front-door" ? (device.on ? Lock : Unlock) : device.icon;
							const stateText = !device.online
								? t("设备离线", "Device offline")
								: !device.on
									? device.id === "front-door"
										? t("已解锁", "Unlocked")
										: t("已关闭", "Off")
									: device.meta;
							return (
								<Card
									className="sc-smart-device"
									variant="subtle"
									key={device.id}
									data-on={device.on || undefined}
									data-offline={!device.online || undefined}
								>
									<CardContent>
										<div className="sc-smart-device-top">
											<span className="sc-smart-device-icon">
												<Icon size={19} aria-hidden="true" />
											</span>
											<Switch
												checked={device.on}
												disabled={!device.online}
												onCheckedChange={(next) => toggleDevice(device.id, next)}
												aria-label={`${deviceName(device.name)}: ${device.on ? t("开启", "on") : t("关闭", "off")}`}
											/>
										</div>
										<strong>{deviceName(device.name)}</strong>
										<span aria-live="polite">{device.on && device.online ? deviceMeta(device) : stateText}</span>
									</CardContent>
								</Card>
							);
						})}
					</CardContent>
				</Card>
			</div>

			<Card className="sc-smart-routines">
				<CardHeader>
					<CardTitle>{t("自动化场景", "Routines")}</CardTitle>
					<CardDescription>
						{t("一次操作，让多台设备协同工作", "Coordinate several devices with one action")}
					</CardDescription>
				</CardHeader>
				<CardContent className="sc-smart-routine-grid">
					<Button
						variant="secondary"
						className="sc-smart-routine"
						data-active={activeRoutine === "morning" || undefined}
						onClick={() => runRoutine("morning", t("早安场景已准备就绪。", "Good morning routine is ready."))}
						aria-pressed={activeRoutine === "morning"}
					>
						<span>
							<Sun size={19} />
						</span>
						<strong>{t("早安", "Good morning")}</strong>
						<small>{t("灯光、咖啡与恒温器", "Lights, coffee, climate")}</small>
					</Button>
					<Button
						variant="secondary"
						className="sc-smart-routine"
						data-active={activeRoutine === "evening" || undefined}
						onClick={() => runRoutine("evening", t("放松时刻场景已启用。", "Evening routine activated."))}
						aria-pressed={activeRoutine === "evening"}
					>
						<span>
							<Moon size={19} />
						</span>
						<strong>{t("放松时刻", "Wind down")}</strong>
						<small>{t("柔和灯光并锁好门窗", "Warm lights and secure doors")}</small>
					</Button>
					<Button
						variant="secondary"
						className="sc-smart-routine"
						data-active={activeRoutine === "away" || undefined}
						onClick={() =>
							runRoutine(
								"away",
								t("离家模式已启用，入口监控保持开启。", "Away mode activated. Entry monitoring remains on."),
							)
						}
						aria-pressed={activeRoutine === "away"}
					>
						<span>
							<Power size={19} />
						</span>
						<strong>{t("离家", "Away")}</strong>
						<small>{t("关闭设备并开启安防", "Power down and monitor entry")}</small>
					</Button>
				</CardContent>
			</Card>

			<div className="sc-smart-secondary-grid">
				<Card>
					<CardHeader>
						<div className="sc-smart-card-heading">
							<div>
								<CardTitle>{t("今日能耗", "Energy today")}</CardTitle>
								<CardDescription>
									{t("每两小时用电量与家庭常态对比", "Two-hour usage compared with your typical day")}
								</CardDescription>
							</div>
							<div className="sc-smart-energy-total">
								<strong>8.1</strong>
								<span>kWh</span>
								<small>−14%</small>
							</div>
						</div>
					</CardHeader>
					<CardContent>
						<AreaChart
							title={t("家庭每两小时用电量", "Home energy use every two hours")}
							description={t("今日用电量低于日常水平。", "Today is tracking below your typical usage.")}
							locale={languageTag(locale)}
							data={energy}
							series={[
								{ key: "today", label: t("今天", "Today"), pointShape: "circle" },
								{ key: "typical", label: t("日常", "Typical"), pointShape: "none" },
							]}
							smooth
							pointShape="circle"
							height={226}
							formatValue={(value) => `${value.toFixed(2)} kWh`}
							labels={{ dataTable: t("查看数据", "View data"), category: t("时间", "Time") }}
						/>
					</CardContent>
				</Card>

				<Card className="sc-smart-activity">
					<CardHeader>
						<CardTitle>{t("最近动态", "Recent activity")}</CardTitle>
						<CardDescription>{t("来自全屋设备的状态变化", "Status changes across your home")}</CardDescription>
					</CardHeader>
					<CardContent>
						<List>
							<ListItem
								leading={
									<span className="sc-smart-activity-icon">
										<Lock size={16} />
									</span>
								}
								trailing={<time>8:42 PM</time>}
							>
								<strong>{t("前门已上锁", "Front door locked")}</strong>
								<span>{t("由“放松时刻”自动完成", "By Wind down routine")}</span>
							</ListItem>
							<ListItem
								leading={
									<span className="sc-smart-activity-icon">
										<Leaf size={16} />
									</span>
								}
								trailing={<time>8:18 PM</time>}
							>
								<strong>{t("空气质量恢复良好", "Air quality returned to excellent")}</strong>
								<span>{t("空气净化器运行了 24 分钟", "Purifier ran for 24 minutes")}</span>
							</ListItem>
							<ListItem
								leading={
									<span className="sc-smart-activity-icon">
										<Camera size={16} />
									</span>
								}
								trailing={<time>7:56 PM</time>}
							>
								<strong>{t("门口检测到包裹", "Package detected at the door")}</strong>
								<span>{t("录像已保存 30 天", "Clip saved for 30 days")}</span>
							</ListItem>
						</List>
						<Button variant="ghost" size="sm">
							{t("查看全部动态", "View all activity")}
						</Button>
					</CardContent>
				</Card>
			</div>

			<div className="sc-smart-announcement" role="status" aria-live="polite">
				<span>
					<Wifi size={15} aria-hidden="true" />
				</span>
				{announcement}
			</div>
		</div>
	);
}
