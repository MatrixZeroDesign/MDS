import { type DocsLocale, translate } from "../i18n";
import { Avatar } from "@matrixzero/ui";

export default function Example({ locale = "en", size = "md" }: { locale?: DocsLocale; size?: "sm" | "md" | "lg" }) {
	const t = (zh: string, en: string) => translate(locale, zh, en);
	return <Avatar size={size} alt={t("陈晨", "Chen Chen")} fallback="CC" />;
}
