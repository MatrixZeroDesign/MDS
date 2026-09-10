import { Field, Textarea } from "@matrixzero/ui";

export default function Example() {
	return (
		<Field label="说明 Description" description="最多 500 字符 / Up to 500 characters">
			<Textarea name="description" rows={4} maxLength={500} />
		</Field>
	);
}
