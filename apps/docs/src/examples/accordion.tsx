import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@matrixzero/ui";

export default function Example({ locale = "zh" }: { locale?: "zh" | "en" }) {
	const t = (zh: string, en: string) => (locale === "zh" ? zh : en);
	return (
		<Accordion type="single" collapsible>
			<AccordionItem value="install">
				<AccordionTrigger>{t("如何安装？", "How to install?")}</AccordionTrigger>
				<AccordionContent>{t("通过私有 registry 安装", "Install through the private registry.")}</AccordionContent>
			</AccordionItem>
		</Accordion>
	);
}
