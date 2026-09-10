import { useState } from "react";
import { SegmentedControl } from "@matrixzero/ui";

export default function Example() {
	const [value, setValue] = useState("monthly");
	return (
		<SegmentedControl
			label="计费 Billing"
			value={value}
			onValueChange={setValue}
			options={[
				{ value: "monthly", label: "月付 Monthly" },
				{ value: "annual", label: "年付 Annual" },
			]}
		/>
	);
}
