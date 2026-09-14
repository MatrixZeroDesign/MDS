import { type DocsLocale, translate } from "../i18n";
import { AvatarGroup } from "@matrixzero/ui";

export default function Example({ locale = "en", size = "md" }: { locale?: DocsLocale; size?: "sm" | "md" | "lg" }) {
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
