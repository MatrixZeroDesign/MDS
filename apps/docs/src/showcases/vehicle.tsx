import { useState } from "react";
import {
	Badge,
	Button,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	Divider,
	IconButton,
	Progress,
	SegmentedControl,
	Slider,
	Switch,
	TimePicker,
} from "@matrixzero/ui";
import { AreaChart } from "@matrixzero/charts";
import {
	Battery,
	Clock,
	Gauge,
	Lightbulb,
	Locate,
	Lock,
	MapPin,
	Power,
	Route,
	ShieldCheck,
	Sun,
	Unlock,
} from "@matrixzero/icons";
import { languageTag } from "../i18n";
import { translator, type SceneProps } from "./shared";
import "./vehicle.css";

const energyData = [
	{ label: "6 AM", drive: 0, climate: 0.2 },
	{ label: "7 AM", drive: 1.1, climate: 0.3 },
	{ label: "8 AM", drive: 4.7, climate: 0.8 },
	{ label: "9 AM", drive: 2.2, climate: 0.5 },
	{ label: "10 AM", drive: 0.3, climate: 0.2 },
	{ label: "11 AM", drive: 0.2, climate: 0.2 },
	{ label: "12 PM", drive: 2.8, climate: 0.6 },
	{ label: "1 PM", drive: 3.4, climate: 0.7 },
	{ label: "2 PM", drive: 0.4, climate: 0.3 },
	{ label: "3 PM", drive: 0.2, climate: 0.2 },
	{ label: "4 PM", drive: 1.7, climate: 0.4 },
	{ label: "5 PM", drive: 3.1, climate: 0.6 },
];

export default function Vehicle({ locale }: SceneProps) {
	const t = translator(locale);
	const [locked, setLocked] = useState(true);
	const [climateOn, setClimateOn] = useState(true);
	const [temperature, setTemperature] = useState(21);
	const [seatHeat, setSeatHeat] = useState("low");
	const [charging, setCharging] = useState(false);
	const [scheduled, setScheduled] = useState(true);
	const [departure, setDeparture] = useState("07:30");
	const [chargeLimit, setChargeLimit] = useState(80);
	const [driveMode, setDriveMode] = useState("balanced");
	const [notice, setNotice] = useState(t("车辆已锁定并准备就绪。", "Vehicle is secure and ready."));

	const toggleLock = () => {
		setLocked((current) => {
			setNotice(
				current ? t("车辆已解锁。", "Vehicle unlocked.") : t("车辆已锁定并确保安全。", "Vehicle locked and secured."),
			);
			return !current;
		});
	};

	return (
		<div className="sc-vehicle">
			<header className="sc-vehicle-intro">
				<div>
					<p className="docs-eyebrow">{t("NOVA E7 · 停在家中", "NOVA E7 · PARKED AT HOME")}</p>
					<h2>{t("下一次出发前，一切准备就绪。", "Everything you need, before the next drive.")}</h2>
					<p>
						{t(
							"在一个清晰的控制界面中查看续航、准备座舱并规划充电。",
							"Check range, prepare the cabin, and plan charging from one calm control surface.",
						)}
					</p>
				</div>
				<div className="sc-vehicle-presence">
					<Badge tone="success">{t("在线", "Online")}</Badge>
					<span>{t("刚刚更新", "Updated just now")}</span>
				</div>
			</header>

			<Card variant="elevated" className="sc-vehicle-overview">
				<CardContent>
					<div className="sc-vehicle-visual">
						<div className="sc-vehicle-orbit" aria-hidden="true" />
						<svg
							viewBox="0 0 700 300"
							role="img"
							aria-label={t("Nova E7 侧面示意图", "Side profile illustration of the Nova E7")}
						>
							<defs>
								<linearGradient id="vehicle-body" x1="0" y1="0" x2="1" y2="1">
									<stop offset="0" stopColor="currentColor" stopOpacity="0.94" />
									<stop offset="1" stopColor="currentColor" stopOpacity="0.62" />
								</linearGradient>
							</defs>
							<path
								className="sc-vehicle-body"
								d="M91 191c9-33 31-52 69-57l85-11 68-60c18-15 39-23 63-23h79c29 0 56 12 76 34l42 47 60 15c29 7 47 27 51 55l2 18H74l3-9c3-5 7-8 14-9Z"
								fill="url(#vehicle-body)"
							/>
							<path className="sc-vehicle-glass" d="m281 116 57-49c12-10 26-15 42-15h72c19 0 38 8 51 23l37 42H281Z" />
							<path className="sc-vehicle-detail" d="M264 124h299M77 199h609M363 52v66m148 2 7 73" />
							<circle className="sc-vehicle-wheel" cx="202" cy="205" r="53" />
							<circle className="sc-vehicle-wheel-core" cx="202" cy="205" r="22" />
							<circle className="sc-vehicle-wheel" cx="564" cy="205" r="53" />
							<circle className="sc-vehicle-wheel-core" cx="564" cy="205" r="22" />
						</svg>
						<div className="sc-vehicle-location">
							<MapPin size={16} aria-hidden="true" />
							<span>{t("家庭车库 · 3 分钟前", "Home garage · 3 minutes ago")}</span>
						</div>
					</div>

					<div className="sc-vehicle-summary">
						<div className="sc-vehicle-title-row">
							<div>
								<span className="sc-vehicle-kicker">{t("当前续航", "CURRENT RANGE")}</span>
								<strong>326 km</strong>
							</div>
							<IconButton
								variant={locked ? "secondary" : "primary"}
								shape="pill"
								label={locked ? t("解锁车辆", "Unlock vehicle") : t("锁定车辆", "Lock vehicle")}
								icon={locked ? <Lock /> : <Unlock />}
								aria-pressed={!locked}
								onClick={toggleLock}
							/>
						</div>
						<div className="sc-vehicle-battery-row">
							<Battery size={18} aria-hidden="true" />
							<span>68% {t("电量", "battery")}</span>
							<Badge>{charging ? t("充电中", "Charging") : t("就绪", "Ready")}</Badge>
						</div>
						<Progress value={68} aria-label={t("电池电量 68%", "Battery charge, 68 percent")} />
						<Divider decorative />
						<div className="sc-vehicle-facts">
							<div>
								<span>{t("座舱", "Cabin")}</span>
								<strong>{climateOn ? `${temperature}°C` : t("关闭", "Off")}</strong>
							</div>
							<div>
								<span>{t("里程", "Odometer")}</span>
								<strong>18,420 km</strong>
							</div>
							<div>
								<span>{t("充电目标", "Charge target")}</span>
								<strong>{chargeLimit}%</strong>
							</div>
						</div>
						<Divider decorative />
						<p className="sc-vehicle-announcement" aria-live="polite">
							<ShieldCheck size={16} aria-hidden="true" />
							{notice}
						</p>
					</div>
				</CardContent>
			</Card>

			<section className="sc-vehicle-quick" aria-labelledby="vehicle-quick-title">
				<div className="sc-vehicle-section-heading">
					<div>
						<p className="docs-eyebrow">{t("远程访问", "REMOTE ACCESS")}</p>
						<h3 id="vehicle-quick-title">{t("快速控制", "Quick controls")}</h3>
					</div>
					<span>{t("命令仅在此预览中模拟", "Commands are simulated in this preview")}</span>
				</div>
				<div className="sc-vehicle-action-grid">
					<Button variant={locked ? "secondary" : "primary"} onClick={toggleLock}>
						{locked ? <Lock size={18} aria-hidden="true" /> : <Unlock size={18} aria-hidden="true" />}
						{locked ? t("解锁", "Unlock") : t("锁定", "Lock")}
					</Button>
					<Button
						variant="secondary"
						onClick={() => setNotice(t("车灯已闪烁。车辆距离 18 米。", "Lights flashed. The vehicle is 18 m away."))}
					>
						<Lightbulb size={18} aria-hidden="true" />
						{t("闪灯", "Flash lights")}
					</Button>
					<Button
						variant="secondary"
						onClick={() => setNotice(t("车辆位置已在地图上居中。", "Vehicle location centered on your map."))}
					>
						<Locate size={18} aria-hidden="true" />
						{t("定位", "Locate")}
					</Button>
					<Button
						variant={climateOn ? "primary" : "secondary"}
						aria-pressed={climateOn}
						onClick={() => setClimateOn(!climateOn)}
					>
						<Power size={18} aria-hidden="true" />
						{climateOn ? t("空调已开启", "Climate on") : t("启动空调", "Start climate")}
					</Button>
				</div>
			</section>

			<div className="sc-vehicle-grid">
				<Card className="sc-vehicle-control-card">
					<CardHeader>
						<div className="sc-vehicle-card-title">
							<div className="sc-vehicle-card-icon">
								<Sun size={19} aria-hidden="true" />
							</div>
							<div>
								<CardTitle>{t("座舱温控", "Cabin climate")}</CardTitle>
								<CardDescription>{t("上车前准备就绪。", "Ready before you step inside.")}</CardDescription>
							</div>
						</div>
						<Switch checked={climateOn} onCheckedChange={setClimateOn} aria-label={t("座舱温控", "Cabin climate")} />
					</CardHeader>
					<CardContent>
						<Slider
							label={t("目标温度", "Target temperature")}
							min={16}
							max={28}
							step={0.5}
							value={temperature}
							disabled={!climateOn}
							formatValue={(value) => `${value}°C`}
							onValueChange={setTemperature}
						/>
						<SegmentedControl
							label={t("驾驶座加热", "Driver seat heating")}
							value={seatHeat}
							onValueChange={setSeatHeat}
							disabled={!climateOn}
							options={[
								{ value: "off", label: t("关闭", "Off") },
								{ value: "low", label: t("低", "Low") },
								{ value: "high", label: t("高", "High") },
							]}
						/>
						<p className="sc-vehicle-card-note">
							{t("室外 13°C · 座舱约 8 分钟后准备就绪。", "Outside 13°C · Cabin will be ready in about 8 minutes.")}
						</p>
					</CardContent>
				</Card>

				<Card className="sc-vehicle-control-card">
					<CardHeader>
						<div className="sc-vehicle-card-title">
							<div className="sc-vehicle-card-icon">
								<Battery size={19} aria-hidden="true" />
							</div>
							<div>
								<CardTitle>{t("充电计划", "Charging plan")}</CardTitle>
								<CardDescription>{t("夜间使用低价电力。", "Use lower-rate energy overnight.")}</CardDescription>
							</div>
						</div>
						<Badge tone={charging ? "success" : "neutral"}>
							{charging ? t("充电中", "Charging") : t("已接入电源", "Plugged in")}
						</Badge>
					</CardHeader>
					<CardContent>
						<Slider
							label={t("充电上限", "Charge limit")}
							min={50}
							max={100}
							step={5}
							value={chargeLimit}
							formatValue={(value) => `${value}%`}
							onValueChange={setChargeLimit}
						/>
						<div className="sc-vehicle-setting-row">
							<div>
								<strong>{t("预约出发", "Scheduled departure")}</strong>
								<span>{t("使用电网电力预热或预冷", "Precondition using grid power")}</span>
							</div>
							<Switch
								checked={scheduled}
								onCheckedChange={setScheduled}
								aria-label={t("预约出发", "Scheduled departure")}
							/>
						</div>
						<TimePicker
							label={t("准备时间", "Ready by")}
							value={departure}
							onValueChange={setDeparture}
							locale={languageTag(locale)}
							hourCycle={24}
							disabled={!scheduled}
						/>
						<div className="sc-row">
							<Button
								variant={charging ? "secondary" : "primary"}
								onClick={() => {
									setCharging(!charging);
									setNotice(
										charging
											? t("充电已暂停。", "Charging paused.")
											: t(`已开始充电至 ${chargeLimit}%。`, `Charging to ${chargeLimit}% started.`),
									);
								}}
							>
								<Power size={18} aria-hidden="true" />
								{charging ? t("暂停充电", "Pause charging") : t("立即开始充电", "Start charging now")}
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>

			<Card className="sc-vehicle-energy">
				<CardHeader>
					<div>
						<CardTitle>{t("今日能耗", "Today’s energy")}</CardTitle>
						<CardDescription>{t("全天驾驶与座舱用电情况。", "Driving and cabin use across the day.")}</CardDescription>
					</div>
					<div className="sc-vehicle-energy-stat">
						<span>{t("平均", "Average")}</span>
						<strong>16.8 kWh / 100 km</strong>
					</div>
				</CardHeader>
				<CardContent>
					<AreaChart
						title={t("每小时能耗", "Hourly energy use")}
						description={t("12 个小时观测值", "12 hourly observations")}
						data={energyData}
						height={260}
						smooth
						pointShape="circle"
						locale={languageTag(locale)}
						formatValue={(value) => `${value.toFixed(1)} kWh`}
						series={[
							{ key: "drive", label: t("驾驶", "Drive") },
							{ key: "climate", label: t("座舱温控", "Climate"), pointShape: "diamond" },
						]}
						labels={{
							dataTable: t("查看数据", "View data"),
							category: t("时间", "Time"),
							missing: t("缺失", "Missing"),
						}}
					/>
					<div className="sc-vehicle-trip-row">
						<div>
							<Route size={18} aria-hidden="true" />
							<span>
								<strong>84 km</strong> {t("已驾驶", "driven")}
							</span>
						</div>
						<div>
							<Gauge size={18} aria-hidden="true" />
							<span>
								<strong>12%</strong> {t("低于车队平均值", "below fleet average")}
							</span>
						</div>
						<div>
							<Clock size={18} aria-hidden="true" />
							<span>
								<strong>1 h 46 m</strong> {t("行驶中", "on the road")}
							</span>
						</div>
					</div>
					<SegmentedControl
						label={t("驾驶模式", "Drive mode")}
						value={driveMode}
						onValueChange={setDriveMode}
						options={[
							{ value: "range", label: t("续航", "Range") },
							{ value: "balanced", label: t("平衡", "Balanced") },
							{ value: "dynamic", label: t("动态", "Dynamic") },
						]}
					/>
				</CardContent>
			</Card>
		</div>
	);
}
