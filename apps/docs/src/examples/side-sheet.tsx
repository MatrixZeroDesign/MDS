import { SideSheet, SideSheetTrigger, SideSheetContent, SideSheetClose, Button, Field, Input } from "@matrixzero/ui";

export default function Example() {
	return (
		<SideSheet>
			<SideSheetTrigger asChild>
				<Button>编辑 Edit</Button>
			</SideSheetTrigger>
			<SideSheetContent title="编辑 Edit" description="更新显示名称 / Update your display name" closeLabel="关闭 Close">
				<Field label="名称 Name">
					<Input defaultValue="Matrix" />
				</Field>
				<SideSheetClose asChild>
					<Button>完成 Done</Button>
				</SideSheetClose>
			</SideSheetContent>
		</SideSheet>
	);
}
