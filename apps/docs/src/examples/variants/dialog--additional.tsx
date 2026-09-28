import { type DocsLocale, translate } from "../../i18n";
import { Dialog, DialogTrigger, DialogContent, DialogClose, Button, CheckField, Callout } from "@matrixzero/ui";

const checks = [
	["设计已批准", "Design approved"],
	["文案已校对", "Copy reviewed"],
	["键盘流程已验证", "Keyboard flow verified"],
	["移动端布局已检查", "Mobile layout checked"],
	["分析事件已配置", "Analytics events configured"],
	["回滚方案已记录", "Rollback plan documented"],
] as const;

export default function Example({ locale = "en" }: { locale?: DocsLocale }) {
	const t = (zh: string, en: string) => translate(locale, zh, en);
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button>{t("检查发布准备", "Review release readiness")}</Button>
			</DialogTrigger>
			<DialogContent
				title={t("发布检查清单", "Release checklist")}
				description={t("在发布前确认关键质量门槛。", "Confirm the critical quality gates before publishing.")}
				closeLabel={t("关闭", "Close")}
			>
				<div style={{ display: "grid", gap: 16, paddingTop: 16 }}>
					<Callout tone="info">
						{t("未完成的项目会保留为草稿。", "Incomplete items keep the release in draft.")}
					</Callout>
					<div style={{ display: "grid", gap: 14 }}>
						{checks.map(([zh, en], index) => (
							<CheckField key={en} label={t(zh, en)} defaultChecked={index < 4} />
						))}
					</div>
					<div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
						<DialogClose asChild>
							<Button variant="ghost">{t("返回", "Back")}</Button>
						</DialogClose>
						<Button variant="primary">{t("保存草稿", "Save draft")}</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
