import { type DocsLocale, translate } from "../i18n";
import { Skeleton } from "@matrixzero/ui";

export default function Example({ locale = "en" }: { locale?: DocsLocale }) {
	const t = (zh: string, en: string) => translate(locale, zh, en);
	return (
		<section style={{ display: "grid", gap: 16 }} aria-busy="true" aria-label={t("加载成员", "Loading members")}>
			<p role="status" style={{ margin: 0 }}>
				{t("加载中", "Loading…")}
			</p>
			<Skeleton style={{ width: 180, height: 24 }} />
		</section>
	);
}
