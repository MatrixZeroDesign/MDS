import { type DocsLocale, translate } from "../i18n";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@matrixzero/ui";

export default function Example({ locale = "en" }: { locale?: DocsLocale }) {
	const t = (zh: string, en: string) => translate(locale, zh, en);
	return (
		<Accordion type="single" collapsible>
			<AccordionItem value="install">
				<AccordionTrigger>{t("如何安装？", "How to install?")}</AccordionTrigger>
				<AccordionContent>{t("通过 npm 安装", "Install from npm.")}</AccordionContent>
			</AccordionItem>
		</Accordion>
	);
}
