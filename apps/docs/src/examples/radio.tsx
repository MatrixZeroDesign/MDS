import { RadioGroup, RadioItem } from "@matrixzero/ui";

export default function Example() {
	return (
		<RadioGroup aria-label="计费 Billing" defaultValue="monthly">
			<RadioItem value="monthly">月付 Monthly</RadioItem>
			<RadioItem value="annual">年付 Annual</RadioItem>
		</RadioGroup>
	);
}
