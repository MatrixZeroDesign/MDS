import { Collapse, CollapseTrigger, CollapseContent, Button } from "@matrixzero/ui";

export default function Example() {
	return (
		<Collapse>
			<CollapseTrigger asChild>
				<Button>高级设置 Advanced</Button>
			</CollapseTrigger>
			<CollapseContent>
				<p>高级选项 / Advanced options</p>
			</CollapseContent>
		</Collapse>
	);
}
