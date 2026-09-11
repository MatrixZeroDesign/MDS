import { useState } from "react";
import { Banner, Button } from "@matrixzero/ui";
export default function Example({ locale = "zh" }: { locale?: "zh" | "en" }) {
	const t = (zh: string, en: string) => (locale === "zh" ? zh : en);
	const [visible, setVisible] = useState(true);
	return (
		<div style={{ border: "1px solid var(--mds-border)", borderRadius: 12, overflow: "hidden" }}>
			{visible ? (
				<Banner
					label={t("服务通知", "Service notice")}
					onDismiss={() => setVisible(false)}
					dismissLabel={t("关闭通知", "Dismiss notice")}
					action={<a href="#docs/theme-motion">{t("查看详情", "Learn more")}</a>}
				>
					{t("今晚 22:00 进行维护，数据仍可查看。", "Maintenance at 22:00. Your data remains available.")}
				</Banner>
			) : (
				<Button autoFocus variant="ghost" onClick={() => setVisible(true)}>
					{t("重新显示通知", "Show notice again")}
				</Button>
			)}
			<div style={{ padding: 24 }}>
				<h3 style={{ margin: "0 0 8px" }}>{t("工作区", "Workspace")}</h3>
				<p style={{ margin: 0 }}>
					{t("页面内容从通知条下方开始。", "Page content starts below the announcement bar.")}
				</p>
			</div>
		</div>
	);
}
