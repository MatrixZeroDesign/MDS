import { Steps } from "@matrixzero/ui";

export default function Example({ locale = "en" }: { locale?: "zh" | "en" }) {
	const t = (zh: string, en: string) => (locale === "zh" ? zh : en);
	return (
		<Steps
			label={t("创建流程", "Creation flow")}
			current={1}
			steps={[
				{ id: "details", label: t("填写", "Details") },
				{ id: "review", label: t("确认", "Review") },
				{ id: "done", label: t("完成", "Done") },
			]}
		/>
	);
}
