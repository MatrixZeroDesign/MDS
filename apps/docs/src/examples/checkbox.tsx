import { useState } from "react";
import { Checkbox, CheckField } from "@matrixzero/ui";

export default function Example() {
	const [checked, setChecked] = useState(false);
	return (
		<CheckField
			label="接收通知 Receive notifications"
			checked={checked}
			onCheckedChange={(v) => setChecked(v === true)}
		/>
	);
}
