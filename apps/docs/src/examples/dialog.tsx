import { Dialog, DialogTrigger, DialogContent, DialogClose, Button, Field, Input } from "@matrixzero/ui";

export default function Example() {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button>编辑 Edit</Button>
			</DialogTrigger>
			<DialogContent title="编辑 Edit" description="更新显示名称 / Update your display name" closeLabel="关闭 Close">
				<Field label="名称 Name">
					<Input defaultValue="Matrix" />
				</Field>
				<DialogClose asChild>
					<Button>完成 Done</Button>
				</DialogClose>
			</DialogContent>
		</Dialog>
	);
}
