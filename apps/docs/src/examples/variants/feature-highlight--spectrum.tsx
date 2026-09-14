import { type DocsLocale, translate } from "../../i18n";
import { useState } from "react";
import { Button, FeatureHighlight } from "@matrixzero/ui";

export default function Example({ locale = "en" }: { locale?: DocsLocale }) {
	const t = (zh: string, en: string) => translate(locale, zh, en);
	const [seen, setSeen] = useState<string[]>([]);
	return (
		<div style={{ display: "flex", flexWrap: "wrap", gap: 32 }}>
			{(["theme", "spectrum"] as const).map((effect) => (
				<div key={effect} style={{ display: "grid", gap: 16, justifyItems: "start" }}>
					<span>{effect === "theme" ? t("跟随主题", "Theme accent") : t("彩色流光", "Spectrum")}</span>
					<FeatureHighlight effect={effect} active={!seen.includes(effect)}>
						<Button onClick={() => setSeen((values) => [...values, effect])}>
							{t("探索新功能", "Explore new feature")}
						</Button>
					</FeatureHighlight>
				</div>
			))}
		</div>
	);
}
