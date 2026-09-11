import { AvatarGroup } from "@matrixzero/ui";

export default function Example({ locale = "zh" }: { locale?: "zh" | "en" }) {
	const t = (zh: string, en: string) => (locale === "zh" ? zh : en);
	return (
		<AvatarGroup
			label={t("项目成员", "Project members")}
			max={3}
			size="md"
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
