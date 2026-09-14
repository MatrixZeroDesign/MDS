import { useEffect, useRef, useState } from "react";
import {
	Avatar,
	Badge,
	Button,
	Card,
	CardContent,
	Divider,
	IconButton,
	NavDrawer,
	NavDrawerContent,
	NavDrawerTrigger,
	SelectionList,
	SelectionListItem,
	Textarea,
} from "@matrixzero/ui";
import { Copy, MessagePlus, Paperclip, Refresh, Send, Stop } from "@matrixzero/icons";
import { translator, type SceneProps } from "./shared";
import "./chatbot.css";
import { useMobileViewport } from "../useMobileViewport";

const conversations = [
	["launch", "产品发布计划", "Product launch plan"],
	["research", "研究摘要", "Research summary"],
	["writing", "欢迎邮件", "Welcome email"],
] as const;
const answers = {
	zh: "先从一个清晰的发布叙事开始：说明产品为谁解决什么问题。然后围绕产品内引导、客户案例和发布后的反馈循环，安排三周计划。",
	en: "Start with one clear launch narrative: who the product is for and which problem it solves. Then shape a three-week plan around in-product education, customer stories, and a post-launch feedback loop.",
};

export default function Chatbot({ locale }: SceneProps) {
	const t = translator(locale);
	const mobile = useMobileViewport();
	const [navigationOpen, setNavigationOpen] = useState(false);
	const localizedAnswer = () => answers[locale === "zh" || locale === "zh-TW" ? "zh" : "en"];
	const [conversation, setConversation] = useState("launch");
	const [draft, setDraft] = useState("");
	const [question, setQuestion] = useState(
		t("如何让新产品的发布更有影响力？", "How can we make a new product launch feel more meaningful?"),
	);
	const [response, setResponse] = useState(localizedAnswer());
	const [generating, setGenerating] = useState(false);
	const [copied, setCopied] = useState(false);
	const timer = useRef<number | undefined>(undefined);
	const generate = (prompt: string) => {
		window.clearInterval(timer.current);
		setQuestion(prompt);
		setCopied(false);
		const text = localizedAnswer();
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			setResponse(text);
			setGenerating(false);
			return;
		}
		setResponse("");
		setGenerating(true);
		let cursor = 0;
		timer.current = window.setInterval(() => {
			cursor += locale === "zh" || locale === "zh-TW" ? 2 : 4;
			setResponse(text.slice(0, cursor));
			if (cursor >= text.length) {
				window.clearInterval(timer.current);
				setGenerating(false);
			}
		}, 34);
	};
	useEffect(() => () => window.clearInterval(timer.current), []);
	return (
		<Card className="sc-chatbot-shell">
			<NavDrawer
				variant={mobile ? "modal" : "standard"}
				open={mobile && navigationOpen}
				onOpenChange={setNavigationOpen}
			>
				<NavDrawerTrigger asChild>
					<Button className="sc-chatbot-menu" variant="secondary">
						{t("会话导航", "Conversation navigation")}
					</Button>
				</NavDrawerTrigger>
				<NavDrawerContent
					className={mobile ? "sc-chatbot-mobile-navigation" : "sc-chatbot-sidebar"}
					title={mobile ? t("会话导航", "Conversation navigation") : ""}
					closeLabel={t("关闭会话导航", "Close conversation navigation")}
					navigationLabel={t("会话导航", "Conversation navigation")}
				>
					<div className="sc-chatbot-brand">
						<span aria-hidden="true">M</span>
						<strong>{t("Matrix 助手", "Matrix Assistant")}</strong>
					</div>
					<Button variant="secondary" onClick={() => setDraft("")}>
						<MessagePlus size={16} /> {t("新建对话", "New conversation")}
					</Button>
					<div className="sc-chatbot-history">
						<small>{t("最近对话", "RECENT")}</small>
						<SelectionList
							label={t("会话历史", "Conversation history")}
							value={conversation}
							onValueChange={(value) => {
								setConversation(value);
								setNavigationOpen(false);
							}}
						>
							{conversations.map(([id, zh, en]) => (
								<SelectionListItem key={id} value={id}>
									<span className="sc-chatbot-history-copy">
										<span>{t(zh, en)}</span>
										<small>
											{id === "launch"
												? t("刚刚", "Now")
												: id === "research"
													? t("昨天", "Yesterday")
													: t("周一", "Monday")}
										</small>
									</span>
								</SelectionListItem>
							))}
						</SelectionList>
					</div>
					<div className="sc-chatbot-profile-region">
						<Divider decorative />
						<div className="sc-chatbot-profile">
							<Avatar alt="Avery Morgan" fallback="AM" size="sm" />
							<div>
								<strong>Avery Morgan</strong>
								<small>{t("个人空间", "Personal workspace")}</small>
							</div>
						</div>
					</div>
				</NavDrawerContent>
			</NavDrawer>
			<CardContent className="sc-chatbot-main">
				<header className="sc-chatbot-topbar">
					<div>
						<strong>{t("产品发布计划", "Product launch plan")}</strong>
						<span>
							<i /> {t("已连接", "Connected")}
						</span>
					</div>
					<Badge>{t("私人对话", "Private")}</Badge>
				</header>
				<div className="sc-chatbot-thread" aria-live="polite">
					<div className="sc-chatbot-welcome">
						<div className="sc-chatbot-orb" aria-hidden="true">
							✦
						</div>
						<h2>{t("今天想一起思考什么？", "What shall we think through today?")}</h2>
						<p>
							{t(
								"我可以帮你梳理想法、研究问题或完善文字。",
								"I can help shape an idea, explore a question, or refine your writing.",
							)}
						</p>
					</div>
					<div className="sc-chatbot-message sc-chatbot-user">
						<p>{question}</p>
					</div>
					<div className="sc-chatbot-message sc-chatbot-assistant">
						<div className="sc-chatbot-avatar" aria-hidden="true">
							M
						</div>
						<div>
							<p>
								{response}
								<span className="sc-chatbot-caret" data-active={generating || undefined} />
							</p>
							{!generating && response && (
								<div className="sc-chatbot-message-actions">
									<IconButton
										variant="ghost"
										size="sm"
										label={copied ? t("已复制", "Copied") : t("复制回答", "Copy response")}
										icon={<Copy size={15} />}
										onClick={async () => {
											await navigator.clipboard?.writeText(response);
											setCopied(true);
										}}
									/>
									<IconButton
										variant="ghost"
										size="sm"
										label={t("重新生成", "Regenerate response")}
										icon={<Refresh size={15} />}
										onClick={() => generate(question)}
									/>
								</div>
							)}
						</div>
					</div>
				</div>
				<div className="sc-chatbot-suggestions" aria-label={t("建议问题", "Suggested prompts")}>
					{[
						t("帮我制定三周发布计划", "Create a three-week launch plan"),
						t("把这个想法变得更清晰", "Make this idea more focused"),
						t("列出需要验证的假设", "List the assumptions to validate"),
					].map((prompt) => (
						<Button key={prompt} variant="secondary" onClick={() => generate(prompt)}>
							{prompt}
						</Button>
					))}
				</div>
				<form
					className="sc-chatbot-composer"
					onSubmit={(event) => {
						event.preventDefault();
						const prompt = draft.trim();
						if (prompt) {
							generate(prompt);
							setDraft("");
						}
					}}
				>
					<Textarea
						value={draft}
						onChange={(event) => setDraft(event.target.value)}
						aria-label={t("输入消息", "Message Matrix Assistant")}
						placeholder={t("输入消息…", "Message Matrix Assistant…")}
						rows={2}
					/>
					<div className="sc-chatbot-composer-actions">
						<IconButton
							type="button"
							variant="ghost"
							label={t("添加附件", "Add attachment")}
							icon={<Paperclip size={17} />}
							onClick={() => setDraft((value) => value || t("请分析这个附件：", "Please review this attachment: "))}
						/>
						{generating ? (
							<IconButton
								type="button"
								variant="primary"
								label={t("停止生成", "Stop generating")}
								icon={<Stop size={15} />}
								onClick={() => {
									window.clearInterval(timer.current);
									setGenerating(false);
								}}
							/>
						) : (
							<IconButton
								type="submit"
								variant="primary"
								disabled={!draft.trim()}
								label={t("发送消息", "Send message")}
								icon={<Send size={16} />}
							/>
						)}
					</div>
				</form>
				<p className="sc-chatbot-disclaimer">
					{t(
						"Matrix Assistant 可能会出错，请核对重要信息。",
						"Matrix Assistant can make mistakes. Check important information.",
					)}
				</p>
			</CardContent>
		</Card>
	);
}
