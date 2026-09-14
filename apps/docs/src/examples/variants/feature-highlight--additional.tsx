import { type DocsLocale, translate } from "../../i18n";
import { useState } from "react";
import { FeatureHighlight, Button } from "@matrixzero/ui";
export default function Example({ locale = "en" }: { locale?: DocsLocale }) {
	const [active, setActive] = useState(true);
	const t = (zh: string, en: string) => translate(locale, zh, en);
	return (
		<div style={{ display: "flex", gap: 24, alignItems: "center" }}>
			<FeatureHighlight active={active} iterations="infinite">
				<Button onClick={() => setActive(false)}>{t("体验新功能", "Try the new feature")}</Button>
			</FeatureHighlight>
		</div>
	);
}
