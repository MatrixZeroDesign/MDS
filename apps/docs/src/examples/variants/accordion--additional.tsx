import { type DocsLocale, translate } from "../../i18n";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@matrixzero/ui";

export default function Example({ locale = "en" }: { locale?: DocsLocale }) {
	const t = (zh: string, en: string) => translate(locale, zh, en);
	return (
		<Accordion type="multiple" defaultValue={["install"]}>
			<AccordionItem value="install">
				<AccordionTrigger>{t("如何安装？", "How to install?")}</AccordionTrigger>
				<AccordionContent>{t("通过 npm 安装", "Install from npm.")}</AccordionContent>
			</AccordionItem>
			<AccordionItem value="usage">
				<AccordionTrigger>{t("如何使用？", "How to use it?")}</AccordionTrigger>
				<AccordionContent>{t("在主题容器内渲染组件。", "Render components inside a theme provider.")}</AccordionContent>
			</AccordionItem>
		</Accordion>
	);
}
