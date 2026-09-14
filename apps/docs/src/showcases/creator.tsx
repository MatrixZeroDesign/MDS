import { useState } from "react";
import {
	Badge,
	Button,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	IconButton,
	List,
	ListItem,
	NotificationBadge,
	Progress,
	SegmentedControl,
	Table,
	ThemeProvider,
} from "@matrixzero/ui";
import { BarChart } from "@matrixzero/charts";
import { Calendar, ChevronRight, Clock, Eye, Message, MoreHorizontal, Play, Upload, Video } from "@matrixzero/icons";
import { translator, type SceneProps } from "./shared";
import "./creator.css";

const performance = {
	week: [42, 58, 51, 76, 84, 109, 128],
	month: [220, 280, 260, 340, 410, 386, 470, 525, 604, 680, 742, 810],
} as const;

const content = [
	{ title: "A slower morning in Kyoto", type: "Video", status: "Published", views: "128K", retention: "68%" },
	{ title: "What I carry every day", type: "Short", status: "Scheduled", views: "—", retention: "—" },
	{ title: "Designing a calmer workspace", type: "Video", status: "Draft", views: "—", retention: "—" },
] as const;

export default function Creator({ locale }: SceneProps) {
	const t = translator(locale);
	const [period, setPeriod] = useState<keyof typeof performance>("week");
	const [notice, setNotice] = useState("");
	const contentTitle = (title: string) =>
		t(
			title === "A slower morning in Kyoto"
				? "京都的慢节奏早晨"
				: title === "What I carry every day"
					? "我每天携带的东西"
					: "设计更从容的工作空间",
			title,
		);
	const contentType = (type: string) => t(type === "Video" ? "视频" : "短片", type);
	const contentStatus = (status: string) =>
		t(status === "Published" ? "已发布" : status === "Scheduled" ? "已排期" : "草稿", status);
	const chartData = performance[period].map((views, index) => ({
		label: period === "week" ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index] : `${index + 1}`,
		views,
	}));

	return (
		<div className="sc-creator">
			<header className="sc-creator-header">
				<div>
					<span className="sc-creator-kicker">
						<span /> {t("创作者工作室", "CREATOR STUDIO")}
					</span>
					<h2>{t("你的作品正在找到知音。", "Your work is finding its people.")}</h2>
					<p>
						{t(
							"规划、发布并理解受欢迎的内容，同时保持创作脉络。",
							"Plan, publish, and understand what resonates without losing the thread.",
						)}
					</p>
				</div>
				<Button onClick={() => setNotice(t("上传工作区已打开", "Upload workspace opened"))}>
					<Upload size={16} /> {t("上传", "Upload")}
				</Button>
			</header>

			{notice && (
				<div className="sc-creator-notice" role="status">
					<span>{notice}</span>
					<Button variant="ghost" onClick={() => setNotice("")}>
						{t("关闭", "Dismiss")}
					</Button>
				</div>
			)}

			<ThemeProvider mode="dark" className="sc-creator-featured-scope">
				<Card className="sc-creator-featured" aria-label={t("最新视频", "Latest video")}>
					<div className="sc-creator-cover">
						<div className="sc-creator-sun" />
						<div className="sc-creator-horizon" />
						<Button
							variant="contrast"
							className="sc-creator-play"
							aria-label={t("播放《京都的慢节奏早晨》", "Play A slower morning in Kyoto")}
							onClick={() => setNotice(t("正在播放预览", "Preview playing"))}
						>
							<Play size={17} /> {t("预览", "Preview")}
						</Button>
					</div>
					<div className="sc-creator-featured-copy">
						<div>
							<Badge tone="success">{t("已发布", "Published")}</Badge>
							<span>{t("12 分钟前", "12 minutes ago")}</span>
						</div>
						<h3>{t("京都的慢节奏早晨", "A slower morning in Kyoto")}</h3>
						<p>
							{t(
								"你的新影片表现超过近期平均水平。大多数观众会看完安静的开场。",
								"Your new film is performing above your recent average. Most viewers stay through the quiet opening sequence.",
							)}
						</p>
						<div className="sc-creator-quick-stats">
							<span>
								<Eye size={16} />
								<strong>128K</strong> {t("观看", "views")}
							</span>
							<span>
								<Message size={16} />
								<strong>842</strong> {t("评论", "comments")}
							</span>
						</div>
						<Button variant="secondary" onClick={() => setNotice(t("视频详情已打开", "Video details opened"))}>
							{t("查看表现", "View performance")} <ChevronRight size={15} />
						</Button>
					</div>
				</Card>
			</ThemeProvider>

			<div className="sc-creator-grid">
				<Card className="sc-creator-chart">
					<CardHeader className="sc-creator-card-heading">
						<div>
							<CardTitle>{t("受众增长", "Audience growth")}</CardTitle>
							<p>{t("已发布内容的观看次数", "Views across published content")}</p>
						</div>
						<SegmentedControl
							label={t("分析周期", "Analytics period")}
							value={period}
							onValueChange={(value) => setPeriod(value as keyof typeof performance)}
							options={[
								{ value: "week", label: t("7 天", "7 days") },
								{ value: "month", label: t("30 天", "30 days") },
							]}
						/>
					</CardHeader>
					<CardContent>
						<BarChart
							title={t("受众增长", "Audience growth")}
							data={chartData}
							series={[{ key: "views", label: t("观看次数（千）", "Views (thousands)") }]}
							formatValue={(value) => `${value}K`}
							height={236}
						/>
					</CardContent>
				</Card>

				<Card className="sc-creator-pipeline">
					<CardHeader>
						<CardTitle>{t("接下来", "Next up")}</CardTitle>
						<p>{t("本周的轻盈节奏", "A gentle rhythm for the week")}</p>
					</CardHeader>
					<CardContent>
						<List className="sc-creator-next-list" aria-label={t("下一个排期内容", "Next scheduled content")}>
							<ListItem
								className="sc-creator-next"
								leading={
									<span className="sc-creator-next-icon">
										<Calendar size={17} />
									</span>
								}
								trailing={<Badge variant="outline">{t("已排期", "Scheduled")}</Badge>}
							>
								<strong>{t("我每天携带的东西", "What I carry every day")}</strong>
								<small>{t("明天 · 上午 9:30", "Tomorrow · 9:30 AM")}</small>
							</ListItem>
						</List>
						<div className="sc-creator-progress-copy">
							<span>{t("上传检查", "Upload checks")}</span>
							<strong>{t("5 项中的 4 项", "4 of 5")}</strong>
						</div>
						<Progress value={80} aria-label={t("五项上传检查已完成四项", "Four of five upload checks complete")} />
						<div className="sc-creator-checks">
							<span>{t("缩略图", "Thumbnail")}</span>
							<span>{t("字幕", "Captions")}</span>
							<span>{t("版权", "Copyright")}</span>
							<span data-pending>{t("最终审核", "Final review")}</span>
						</div>
						<Button variant="secondary" onClick={() => setNotice(t("排期编辑器已打开", "Schedule editor opened"))}>
							<Clock size={16} /> {t("调整排期", "Adjust schedule")}
						</Button>
					</CardContent>
				</Card>
			</div>

			<Card className="sc-creator-library">
				<CardHeader className="sc-creator-card-heading">
					<div>
						<CardTitle>{t("内容库", "Content library")}</CardTitle>
						<p>{t("近期与即将发布的作品", "Recent and upcoming work")}</p>
					</div>
					<NotificationBadge variant="count" count={2} label={t("有 2 项需要审核", "2 items need review")}>
						<IconButton
							variant="ghost"
							label={t("内容库选项", "Library options")}
							icon={<MoreHorizontal size={18} />}
						/>
					</NotificationBadge>
				</CardHeader>
				<CardContent>
					<Table>
						<thead>
							<tr>
								<th scope="col">{t("标题", "Title")}</th>
								<th scope="col">{t("状态", "Status")}</th>
								<th scope="col">{t("观看", "Views")}</th>
								<th scope="col">{t("留存", "Retention")}</th>
							</tr>
						</thead>
						<tbody>
							{content.map((item) => (
								<tr key={item.title}>
									<th scope="row">
										<span className="sc-creator-video-icon">
											<Video size={16} />
										</span>
										<span>
											<strong>{contentTitle(item.title)}</strong>
											<small>{contentType(item.type)}</small>
										</span>
									</th>
									<td>
										<Badge tone={item.status === "Published" ? "success" : "neutral"}>
											{contentStatus(item.status)}
										</Badge>
									</td>
									<td>{item.views}</td>
									<td>{item.retention}</td>
								</tr>
							))}
						</tbody>
					</Table>
				</CardContent>
			</Card>
		</div>
	);
}
