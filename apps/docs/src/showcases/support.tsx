import { useState } from "react";
import { Button, Avatar, Badge, Field, Textarea, Form, FormSubmit, Tabs, TabList, Tab, TabPanel } from "@matrixzero/ui";
import { Panel, translator, type SceneProps } from "./shared";
export default function Support({ locale }: SceneProps) {
	const t = translator(locale);
	const [resolved, setResolved] = useState(false);
	const [replies, setReplies] = useState<string[]>([]);
	return (
		<div className="sc-split">
			<Panel title={t("收件箱", "Inbox")} description={t("今天 · 一条待处理会话", "Today · one customer conversation")}>
				<div className="sc-note">
					<Badge tone={resolved ? "success" : "warning"}>
						{resolved ? t("已解决", "Resolved") : t("待回复", "Needs reply")}
					</Badge>
					<h3>{t("无法导出报表", "Report export is unavailable")}</h3>
					<p>Jordan Lee · 09:42</p>
				</div>
				<p>{t("服务目标：两小时内首次响应。", "Response target: first reply within two hours.")}</p>
			</Panel>
			<Panel title={t("无法导出报表", "Report export is unavailable")}>
				<div className="sc-row">
					<Avatar alt="Jordan Lee" fallback="JL" />
					<strong>Jordan Lee</strong>
				</div>
				<div className="sc-message">
					{t(
						"你好，我看不到导出按钮。可以帮我检查一下团队权限吗？",
						"Hi, I cannot see the export button. Could you help me check my team permissions?",
					)}
				</div>
				<div aria-live="polite" className="sc-stack">
					{replies.map((reply, i) => (
						<div className="sc-message sc-message-self" key={i}>
							{reply}
						</div>
					))}
				</div>
				<Tabs defaultValue="reply">
					<TabList aria-label={t("会话信息", "Conversation information")}>
						<Tab value="reply">{t("回复", "Reply")}</Tab>
						<Tab value="details">{t("客户详情", "Customer details")}</Tab>
					</TabList>
					<TabPanel value="reply">
						<Form
							onSubmit={(e) => {
								e.preventDefault();
								const f = e.currentTarget;
								const value = String(new FormData(f).get("reply") || "").trim();
								if (value) {
									setReplies([...replies, value]);
									f.reset();
								}
							}}
						>
							<Field label={t("回复内容", "Your reply")} required>
								<Textarea name="reply" required disabled={resolved} />
							</Field>
							<div className="sc-row">
								<FormSubmit disabled={resolved}>{t("发送回复", "Send reply")}</FormSubmit>
								<Button variant="secondary" onClick={() => setResolved(!resolved)}>
									{resolved ? t("重新打开", "Reopen ticket") : t("标记为已解决", "Resolve ticket")}
								</Button>
							</div>
						</Form>
					</TabPanel>
					<TabPanel value="details">
						<p>
							{t(
								"团队：Forma Labs。方案：专业版。最近联系：今天。",
								"Team: Forma Labs. Plan: Pro. Last contact: today.",
							)}
						</p>
					</TabPanel>
				</Tabs>
			</Panel>
		</div>
	);
}
