import { type DocsLocale, translate } from "../../i18n";
import { List, ListItem, Avatar, Badge } from "@matrixzero/ui";

export default function Example({ locale = "en" }: { locale?: DocsLocale }) {
	const t = (zh: string, en: string) => translate(locale, zh, en);
	return (
		<List aria-label={t("成员", "Members")}>
			{[1, 2, 3].map((i) => (
				<ListItem
					key={i}
					leading={<Avatar alt={t("陈晨", "Chen Chen")} fallback="CC" />}
					trailing={<Badge>{t("成员", "Member")}</Badge>}
				>
					{t("陈晨", "Chen Chen")}
				</ListItem>
			))}
		</List>
	);
}
