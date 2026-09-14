import { type DocsLocale, translate } from "../i18n";
import { Button, ToastProvider, Toaster, useToast, type ToastOptions } from "@matrixzero/ui";
function Notifications({ locale, tone }: { locale: DocsLocale; tone: ToastOptions["tone"] }) {
	const { toast, clear } = useToast();
	const t = (zh: string, en: string) => translate(locale, zh, en);
	return (
		<div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
			<Button
				onClick={() =>
					toast({
						title: t("可以更新了", "Ready to update"),
						description: t("新版本已准备好。", "A new version is ready."),
						tone,
						action: {
							label: t("立即更新", "Update now"),
							altText: t("立即安装更新", "Install the update now"),
							onClick: () =>
								toast({
									title: t("正在更新", "Updating"),
									description: t("完成后会通知你。", "We will let you know when it is complete."),
									tone: "info",
								}),
						},
					})
				}
			>
				{t("显示操作通知", "Show actionable toast")}
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
export default function Example({
	locale = "en",
	tone = "success",
}: {
	locale?: DocsLocale;
	tone?: ToastOptions["tone"];
}) {
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
