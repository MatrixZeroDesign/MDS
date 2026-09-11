import { Avatar } from "@matrixzero/ui";

export default function Example({ locale = "zh" }: { locale?: "zh" | "en" }) {
	const t = (zh: string, en: string) => (locale === "zh" ? zh : en);
	return <Avatar alt={t("陈晨", "Chen Chen")} fallback="CC" />;
}
