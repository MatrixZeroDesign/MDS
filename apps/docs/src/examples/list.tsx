import { List, ListItem, Avatar, Badge } from "@matrixzero/ui";

export default function Example({ locale = "en" }: { locale?: "zh" | "en" }) {
	const t = (zh: string, en: string) => (locale === "zh" ? zh : en);
	return (
		<List aria-label={t("成员", "Members")}>
			<ListItem
				leading={<Avatar alt={t("陈晨", "Chen Chen")} fallback="CC" />}
				trailing={<Badge>{t("成员", "Member")}</Badge>}
			>
				{t("陈晨", "Chen Chen")}
			</ListItem>
		</List>
	);
}
