import { type DocsLocale, translate } from "../../i18n";
import { Steps } from "@matrixzero/ui";

export default function Example({ locale = "en" }: { locale?: DocsLocale }) {
	const t = (zh: string, en: string) => translate(locale, zh, en);
	return (
		<Steps
			label={t("创建流程", "Creation flow")}
			current={2}
			steps={[
				{ id: "details", label: t("填写", "Details") },
				{ id: "review", label: t("确认", "Review") },
				{ id: "done", label: t("完成", "Done") },
			]}
		/>
	);
}
