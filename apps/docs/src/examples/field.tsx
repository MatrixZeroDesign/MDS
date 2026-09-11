import { Field, Input } from "@matrixzero/ui";

export default function Example({ locale = "zh" }: { locale?: "zh" | "en" }) {
	const t = (zh: string, en: string) => (locale === "zh" ? zh : en);
	return (
		<Field label={t("邮箱", "Email")} description={t("用于接收通知", "For notifications")} required>
			<Input name="email" type="email" />
		</Field>
	);
}
