import { useState } from "react";
import { Field, Switch, ThemeProvider } from "@matrixzero/ui";
import { Sun, Moon, Check } from "@matrixzero/icons";
export default function Example({ locale = "en" }: { locale?: "zh" | "en" }) {
	const t = (zh: string, en: string) => (locale === "zh" ? zh : en);
	const [light, setLight] = useState(true);
	const [enabled, setEnabled] = useState(true);
	return (
		<div style={{ display: "grid", gap: 24 }}>
			<ThemeProvider
				mode={light ? "light" : "dark"}
				style={{ padding: 20, borderRadius: 16, display: "grid", gap: 16 }}
			>
				<Field
					label={t("浅色主题", "Light theme")}
					description={t("切换仅影响此示例。", "The theme applies to this example.")}
				>
					<Switch checked={light} onCheckedChange={setLight} checkedIcon={<Sun />} uncheckedIcon={<Moon />} />
				</Field>
			</ThemeProvider>
			<Field
				label={t("自动保存", "Autosave")}
				description={
					enabled
						? t("更改将自动保存。", "Changes will be saved automatically.")
						: t("需要手动保存更改。", "Save changes manually.")
				}
			>
				<Switch checked={enabled} onCheckedChange={setEnabled} checkedIcon={<Check />} />
			</Field>
		</div>
	);
}
