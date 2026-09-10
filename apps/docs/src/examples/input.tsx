import { useState } from "react";
import { Field, Input } from "@matrixzero/ui";

export default function Example() {
	const [name, setName] = useState("");
	return (
		<Field label="名称 Name">
			<Input name="name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
		</Field>
	);
}
