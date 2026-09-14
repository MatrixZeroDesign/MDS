import { translatePair, type DocsLocale, translate } from "../../i18n";
import { useState } from "react";
import { ThemeProvider, Button, Field, Input, type ThemePalette } from "@matrixzero/ui";
function Sample({ locale = "en", palette = "mint" }: { locale?: DocsLocale; palette?: ThemePalette }) {
	const t = (zh: string, en: string) => translate(locale, zh, en);
	const [confirmed, setConfirmed] = useState(false);
	return (
		<div className="docs-theme-palette-modes">
			{(["light", "dark"] as const).map((mode) => (
				<ThemeProvider key={mode} palette={palette} mode={mode} className="docs-theme-palette-surface">
					<span className="docs-theme-palette-mode">{mode === "light" ? t("浅色", "Light") : t("深色", "Dark")}</span>
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

export default function Example({ locale = "en" }: { locale?: DocsLocale }) {
	return (
		<div className="docs-theme-palette-grid">
			{(
				[
					{ value: "mint", label: ["薄荷", "Mint"] },
					{ value: "mono", label: ["黑白", "Monochrome"] },
					{ value: "blue", label: ["蓝色", "Blue"] },
					{ value: "violet", label: ["紫罗兰", "Violet"] },
					{ value: "rose", label: ["玫瑰", "Rose"] },
					{ value: "amber", label: ["琥珀", "Amber"] },
				] as const
			).map((item) => (
				<section key={item.value} className="docs-theme-palette-card">
					<header className="docs-theme-palette-heading">
						<strong>{translatePair(locale, item.label)}</strong>
						<span>{item.value}</span>
					</header>
					<Sample locale={locale} palette={item.value} />
				</section>
			))}
		</div>
	);
}
