import { translatePair, type DocsLocale, translate } from "../../i18n";
import { AvatarGroup } from "@matrixzero/ui";

function Sample({ locale = "en", size = "md" }: { locale?: DocsLocale; size?: "sm" | "md" | "lg" }) {
	const t = (zh: string, en: string) => translate(locale, zh, en);
	return (
		<AvatarGroup
			size={size}
			label={t("项目成员", "Project members")}
			max={3}
			overflowLabel={(count) => t(`还有 ${count} 位成员`, `${count} more members`)}
			members={[
				{ name: t("陈晨", "Chen Chen"), fallback: t("陈", "CC") },
				{ name: "Alex Morgan", fallback: "AM" },
				{ name: t("林雨", "Lin Yu"), fallback: t("林", "LY") },
				{ name: "Sam Lee", fallback: "SL" },
				{ name: "Taylor Kim", fallback: "TK" },
			]}
		/>
	);
}

export default function Example({ locale = "en" }: { locale?: DocsLocale }) {
	return (
		<div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", gap: 24 }}>
			{(
				[
					{ value: "sm", label: ["小号", "Small"] },
					{ value: "md", label: ["中号", "Medium"] },
					{ value: "lg", label: ["大号", "Large"] },
				] as const
			).map((item) => (
				<div key={item.value} style={{ display: "grid", gap: 12, minWidth: 0, maxWidth: "100%" }}>
					<span style={{ fontSize: 12, color: "var(--mds-muted)" }}>{translatePair(locale, item.label)}</span>
					<Sample locale={locale} size={item.value} />
				</div>
			))}
		</div>
	);
}
