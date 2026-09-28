import { type DocsLocale, translate } from "../i18n";
import { Dialog, DialogTrigger, DialogContent, DialogClose, Button, Atmosphere, Badge } from "@matrixzero/ui";
import { ArrowRight, LayoutDashboard } from "@matrixzero/icons";

export default function Example({ locale = "en" }: { locale?: DocsLocale }) {
	const t = (zh: string, en: string) => translate(locale, zh, en);
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button>{t("预览产品导览", "Preview product tour")}</Button>
			</DialogTrigger>
			<DialogContent
				title={t("欢迎来到你的工作区", "Welcome to your workspace")}
				description={t("用一分钟了解团队工作区。", "Take a one-minute tour of your team workspace.")}
				closeLabel={t("关闭", "Close")}
			>
				<div style={{ display: "grid", gap: 20, paddingTop: 16 }}>
					<Atmosphere
						tone="mint"
						style={{
							minHeight: 180,
							padding: 24,
							borderRadius: 16,
							display: "grid",
							alignContent: "space-between",
							gap: 32,
						}}
					>
						<span
							style={{
								display: "grid",
								placeItems: "center",
								width: 44,
								height: 44,
								borderRadius: 12,
								background: "var(--mds-surface)",
							}}
						>
							<LayoutDashboard aria-hidden="true" />
						</span>
						<div style={{ display: "grid", gap: 6 }}>
							<Badge style={{ justifySelf: "start" }}>{t("步骤 1 / 3", "Step 1 of 3")}</Badge>
							<strong>{t("从一个清晰的概览开始", "Start with a clear overview")}</strong>
							<span>
								{t("查看项目、成员和下一步任务。", "See projects, teammates, and the next action in one view.")}
							</span>
						</div>
					</Atmosphere>
					<div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
						<DialogClose asChild>
							<Button variant="ghost">{t("稍后", "Later")}</Button>
						</DialogClose>
						<DialogClose asChild>
							<Button variant="primary" trailingIcon={<ArrowRight />}>
								{t("继续", "Continue")}
							</Button>
						</DialogClose>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
