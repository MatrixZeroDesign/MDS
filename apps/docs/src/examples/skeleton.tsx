import { Skeleton } from "@matrixzero/ui";

export default function Example({ locale = "en" }: { locale?: "zh" | "en" }) {
	const t = (zh: string, en: string) => (locale === "zh" ? zh : en);
	return (
		<section aria-busy="true" aria-label={t("加载成员", "Loading members")}>
			<p role="status">{t("加载中", "Loading…")}</p>
			<Skeleton style={{ width: 180, height: 24 }} />
		</section>
	);
}
