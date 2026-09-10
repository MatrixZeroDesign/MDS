import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@matrixzero/ui";

export default function Example() {
	return (
		<Accordion type="single" collapsible>
			<AccordionItem value="install">
				<AccordionTrigger>如何安装？ How to install?</AccordionTrigger>
				<AccordionContent>通过私有 registry 安装 / Install through the private registry.</AccordionContent>
			</AccordionItem>
		</Accordion>
	);
}
