import { useState } from "react";
import { Button, Field, Input, Form, FormSubmit, Avatar, Badge, Progress, EmptyState } from "@matrixzero/ui";
import { Panel, Stat, translator, type SceneProps } from "./shared";
export default function Projects({ locale }: SceneProps) {
	const t = translator(locale);
	const [tasks, setTasks] = useState([
		{ id: 1, title: t("访谈五位用户", "Interview five customers"), stage: 0 },
		{ id: 2, title: t("完善移动端导航", "Refine mobile navigation"), stage: 1 },
		{ id: 3, title: t("发布设计规范", "Publish design principles"), stage: 2 },
	]);
	const stages = [t("待办", "Planned"), t("进行中", "In progress"), t("已完成", "Done")];
	const done = tasks.filter((x) => x.stage === 2).length;
	return (
		<div className="sc-stack">
			<div className="sc-hero">
				<div>
					<Badge>{t("产品团队 · 第 24 次迭代", "Product team · Sprint 24")}</Badge>
					<h2>{t("让下一次发布更出色。", "Make the next release matter.")}</h2>
					<p>{t("从想法到交付，每一步都清晰。", "A shared space for ideas, progress and delivery.")}</p>
				</div>
				<Stat label={t("已完成", "Completed")} value={`${done}/${tasks.length}`} />
			</div>
			<Progress value={(done / tasks.length) * 100} aria-label={t("迭代进度", "Sprint progress")} />
			<Panel title={t("添加任务", "Add a task")}>
				<Form
					onSubmit={(e) => {
						e.preventDefault();
						const form = e.currentTarget;
						const title = String(new FormData(form).get("title") || "").trim();
						if (title) {
							setTasks([...tasks, { id: Date.now(), title, stage: 0 }]);
							form.reset();
						}
					}}
				>
					<div className="sc-inline-form">
						<Field label={t("任务名称", "Task name")} required>
							<Input name="title" required maxLength={80} />
						</Field>
						<FormSubmit variant="primary">{t("添加任务", "Add task")}</FormSubmit>
					</div>
				</Form>
			</Panel>
			<div className="sc-board">
				{stages.map((stage, i) => (
					<Panel key={stage} title={`${stage} · ${tasks.filter((x) => x.stage === i).length}`}>
						{tasks
							.filter((x) => x.stage === i)
							.map((task) => (
								<div className="sc-task" key={task.id}>
									<h3>{task.title}</h3>
									<div className="sc-row">
										<Avatar fallback="AL" alt={t("负责人 Alex", "Assigned to Alex")} />
										<Button
											size="sm"
											variant="ghost"
											onClick={() => setTasks(tasks.map((x) => (x.id === task.id ? { ...x, stage: (i + 1) % 3 } : x)))}
										>
											{i === 2 ? t("重新打开", "Reopen") : t("推进任务", "Move forward")}
										</Button>
									</div>
								</div>
							))}
						{!tasks.some((x) => x.stage === i) && <EmptyState title={t("暂时没有任务", "No tasks here")} />}
					</Panel>
				))}
			</div>
		</div>
	);
}
