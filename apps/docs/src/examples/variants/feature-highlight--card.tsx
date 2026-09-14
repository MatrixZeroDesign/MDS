import { type DocsLocale, translate } from "../../i18n";
import { useState } from "react";
import { FeatureHighlight, Card, CardHeader, CardTitle, CardDescription, CardFooter, Button } from "@matrixzero/ui";

export default function Example({ locale = "en" }: { locale?: DocsLocale }) {
	const t = (zh: string, en: string) => translate(locale, zh, en);
	const [enabled, setEnabled] = useState(false);
	return (
		<FeatureHighlight active={!enabled} style={{ width: 380, borderRadius: "var(--mds-radius-lg, 16px)" }}>
			<Card style={{ width: "100%" }}>
				<CardHeader>
					<CardTitle>{t("每周摘要", "Weekly digest")}</CardTitle>
					<CardDescription>
						{t("新功能：把团队动态整理成一封每周邮件。", "New: bring your team's updates together in a weekly email.")}
					</CardDescription>
				</CardHeader>
				<CardFooter>
					<Button disabled={enabled} onClick={() => setEnabled(true)}>
						{enabled ? t("已启用", "Enabled") : t("启用摘要", "Enable digest")}
					</Button>
					<span role="status">{enabled ? t("示例订阅已开启", "Demo subscription enabled") : ""}</span>
				</CardFooter>
			</Card>
		</FeatureHighlight>
	);
}
