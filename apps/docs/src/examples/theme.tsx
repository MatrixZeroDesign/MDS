import { useState } from "react";
import { ThemeProvider, Button, Field, Input, type ThemePalette } from "@matrixzero/ui";
export default function Example({ locale = "en", palette = "mint" }: { locale?: "zh" | "en"; palette?: ThemePalette }) {
	const t = (zh: string, en: string) => (locale === "zh" ? zh : en);
	const [confirmed, setConfirmed] = useState(false);
	return (
		<div style={{ display: "grid", gap: 16 }}>
			{(["light", "dark"] as const).map((mode) => (
				<ThemeProvider
					key={mode}
					palette={palette}
					mode={mode}
					style={{ padding: 24, borderRadius: 16, display: "grid", gap: 16 }}
				>
					<Field label={mode === "light" ? t("浅色预览", "Light preview") : t("深色预览", "Dark preview")}>
						<Input placeholder={t("输入内容…", "Type here…")} />
					</Field>
					<Button variant="primary" style={{ justifySelf: "start" }} onClick={() => setConfirmed(true)}>
						{confirmed ? t("已确认", "Confirmed") : t("确认", "Confirm")}
					</Button>
				</ThemeProvider>
			))}
		</div>
	);
}
