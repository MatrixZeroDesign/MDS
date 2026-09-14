import { useState } from "react";
import { Button, Progress, Badge } from "@matrixzero/ui";
import { Panel, translator, type SceneProps } from "./shared";
export default function Learning({ locale }: SceneProps) {
	const t = translator(locale);
	const [lesson, setLesson] = useState(0);
	const [done, setDone] = useState<number[]>([]);
	const titles = [
		t("建立视觉层级", "Build visual hierarchy"),
		t("用留白组织内容", "Make space work"),
		t("设计清晰的反馈", "Design clear feedback"),
	];
	const descriptions = [
		t(
			"从最重要的信息开始。使用字号、字重和位置引导阅读，而不是让所有内容争夺注意力。",
			"Start with the most important information. Use size, weight and placement to guide reading instead of making every element compete.",
		),
		t(
			"将相关内容放在一起，用更大的间距分开不同的主题。留白表达关系，而不只是装饰。",
			"Keep related content together and separate topics with larger gaps. Space communicates relationships; it is more than decoration.",
		),
		t(
			"每次操作都应得到可理解的反馈。区分加载、成功与失败，并给出明确的下一步。",
			"Give every action understandable feedback. Distinguish loading, success and failure, and offer a clear next step.",
		),
	];
	return (
		<div className="sc-split">
			<Panel title={t("界面设计基础", "Interface design essentials")}>
				<Badge>{t("三节课 · 自定节奏", "Three lessons · self-paced")}</Badge>
				<Progress value={(done.length / 3) * 100} aria-label={t("课程进度", "Course progress")} />
				<p role="status">{t(`已完成 ${done.length} / 3 节`, `Completed ${done.length} of 3 lessons`)}</p>
				{titles.map((title, i) => (
					<Button
						key={title}
						variant={lesson === i ? "primary" : "ghost"}
						aria-pressed={lesson === i}
						onClick={() => setLesson(i)}
					>
						{done.includes(i) ? "✓ " : `${i + 1}. `}
						{title}
					</Button>
				))}
			</Panel>
			<Panel title={titles[lesson]} description={t("阅读 · 三分钟", "Reading · three minutes")}>
				<div className="sc-lesson-art" aria-hidden="true">
					<span>Aa</span>
					<i />
					<i />
				</div>
				<p className="sc-reading">{descriptions[lesson]}</p>
				<div className="sc-note">
					<strong>{t("试一试", "Try it")}</strong>
					<p>
						{t(
							"选择一个常用页面，找出最重要的动作，并减少围绕它的视觉干扰。",
							"Choose a page you use often. Identify its most important action and reduce the distractions around it.",
						)}
					</p>
				</div>
				<Button disabled={done.includes(lesson)} onClick={() => setDone([...done, lesson])}>
					{done.includes(lesson) ? t("已完成", "Completed") : t("标记本课完成", "Mark lesson complete")}
				</Button>
				{lesson < 2 && (
					<Button variant="secondary" onClick={() => setLesson(lesson + 1)}>
						{t("下一课", "Next lesson")}
					</Button>
				)}
			</Panel>
		</div>
	);
}
