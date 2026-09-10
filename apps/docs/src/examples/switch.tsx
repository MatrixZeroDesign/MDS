import { useState } from "react";
import { Field, Switch } from "@matrixzero/ui";

export default function Example() {
	const [enabled, setEnabled] = useState(true);
	return (
		<Field label="自动保存 Autosave">
			<Switch checked={enabled} onCheckedChange={setEnabled} />
		</Field>
	);
}
