import { RadioCardGroup, RadioCard } from "@matrixzero/ui";

export default function Example() {
	return (
		<RadioCardGroup aria-label="方案 Plan" defaultValue="standard">
			<RadioCard value="standard" title="标准 Standard" description="日常使用 / Everyday use" />
			<RadioCard value="pro" title="专业 Pro" />
		</RadioCardGroup>
	);
}
