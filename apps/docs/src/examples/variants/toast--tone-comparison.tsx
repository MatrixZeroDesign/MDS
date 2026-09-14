import { translatePair, type DocsLocale, translate } from "../../i18n";
import { Button, ToastProvider, Toaster, useToast, type ToastOptions } from "@matrixzero/ui";
function Notifications({ locale, tone }: { locale: DocsLocale; tone: ToastOptions["tone"] }) {
	const { toast, clear } = useToast();
	const t = (zh: string, en: string) => translate(locale, zh, en);
	return (
		<div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
			<Button
				onClick={() =>
					toast({
						title: t("导出完成", "Export completed"),
						description: t("文件已准备好，可以下载。", "Your file is ready to download."),
						tone,
					})
				}
			>
				{t("显示通知", "Show toast")}
			</Button>
			<Button
				onClick={() => {
					toast({ title: t("更改已保存", "Changes saved"), tone: "success" });
					toast({
						title: t("正在准备报告", "Preparing report"),
						description: t("报告准备好后会通知你。", "We will let you know when it is ready."),
						tone: "info",
					});
					toast({
						title: t("导出完成", "Export completed"),
						description: t(
							"悬停或聚焦以展开所有通知并暂停计时。",
							"Hover or focus to expand all notifications and pause their timers.",
						),
						tone: "success",
					});
				}}
			>
				{t("叠加三条", "Stack three")}
			</Button>
			<Button
				onClick={() =>
					toast({
						title: t("连接已断开", "Connection lost"),
						description: t("此通知需要手动关闭。", "This notification stays until dismissed."),
						tone: "warning",
						duration: Infinity,
					})
				}
			>
				{t("持续通知", "Persistent toast")}
			</Button>
			<Button variant="ghost" onClick={clear}>
				{t("清空通知", "Clear toasts")}
			</Button>
		</div>
	);
}
function Sample({ locale = "en", tone = "success" }: { locale?: DocsLocale; tone?: ToastOptions["tone"] }) {
	return (
		<ToastProvider label={translate(locale, "通知", "Notification")}>
			<Notifications locale={locale} tone={tone} />
			<Toaster
				label={translate(locale, "通知 ({hotkey})", "Notifications ({hotkey})")}
				closeLabel={translate(locale, "关闭通知", "Dismiss notification")}
			/>
		</ToastProvider>
	);
}

export default function Example({ locale = "en" }: { locale?: DocsLocale }) {
	return (
		<div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", gap: 24 }}>
			{(
				[
					{ value: "neutral", label: ["中性", "Neutral"] },
					{ value: "info", label: ["信息", "Information"] },
					{ value: "success", label: ["成功", "Success"] },
					{ value: "warning", label: ["警告", "Warning"] },
					{ value: "danger", label: ["危险", "Danger"] },
				] as const
			).map((item) => (
				<div key={item.value} style={{ display: "grid", gap: 12, minWidth: 0, maxWidth: "100%" }}>
					<span style={{ fontSize: 12, color: "var(--mds-muted)" }}>{translatePair(locale, item.label)}</span>
					<Sample locale={locale} tone={item.value} />
				</div>
			))}
		</div>
	);
}
