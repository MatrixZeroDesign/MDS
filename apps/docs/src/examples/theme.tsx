import { type DocsLocale, translate } from "../i18n";
import { useState } from "react";
import { ThemeProvider, Button, Field, Input, type ThemePalette } from "@matrixzero/ui";
export default function Example({ locale = "en", palette = "mint" }: { locale?: DocsLocale; palette?: ThemePalette }) {
	const t = (zh: string, en: string) => translate(locale, zh, en);
	const [confirmed, setConfirmed] = useState(false);
	const surfaceStyle = {
		padding: 24,
		border: "1px solid var(--mds-border)",
		borderRadius: 16,
		background: "var(--mds-surface)",
		color: "var(--mds-text)",
		display: "grid",
		gap: 16,
	};
	return (
		<div style={{ display: "grid", gap: 16 }}>
			{(["light", "dark"] as const).map((mode) => (
				<ThemeProvider key={mode} palette={palette} mode={mode} style={surfaceStyle}>
					<Field label={mode === "light" ? t("浅色预览", "Light preview") : t("深色预览", "Dark preview")}>
						<Input placeholder={t("输入内容…", "Type here…")} />
					</Field>
					<Button variant="primary" style={{ justifySelf: "start" }} onClick={() => setConfirmed(true)}>
						{confirmed ? t("已确认", "Confirmed") : t("确认", "Confirm")}
					</Button>
				</ThemeProvider>
			))}
			<ThemeProvider
				mode="light"
				palette={palette}
				style={{
					border: "1px solid var(--mds-border)",
					borderRadius: 16,
					background: "var(--mds-surface)",
					color: "var(--mds-text)",
					overflow: "hidden",
				}}
			>
				<div style={{ padding: 20 }}>
					<strong>{t("外层浅色主题", "Outer light scope")}</strong>
				</div>
				<ThemeProvider
					mode="dark"
					style={{ padding: 20, background: "var(--mds-surface)", color: "var(--mds-text)", display: "grid", gap: 12 }}
				>
					<strong>{t("内层覆盖为深色", "Inner dark override")}</strong>
					<Input placeholder={t("内层输入框", "Inner scoped input")} />
				</ThemeProvider>
			</ThemeProvider>
		</div>
	);
}
