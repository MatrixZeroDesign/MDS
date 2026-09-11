import { Avatar } from "@matrixzero/ui";

export default function Example({ locale = "en", size = "md" }: { locale?: "zh" | "en"; size?: "sm" | "md" | "lg" }) {
	const t = (zh: string, en: string) => (locale === "zh" ? zh : en);
	return <Avatar size={size} alt={t("陈晨", "Chen Chen")} fallback="CC" />;
}
