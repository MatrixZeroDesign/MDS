import { Field, Input } from "@matrixzero/ui";

export default function Example() {
	return (
		<Field label="邮箱 Email" description="用于接收通知 / For notifications" required>
			<Input name="email" type="email" />
		</Field>
	);
}
