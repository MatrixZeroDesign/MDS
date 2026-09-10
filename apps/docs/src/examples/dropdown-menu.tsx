import { useState } from "react";
import {
	DropdownMenu,
	DropdownTrigger,
	DropdownContent,
	DropdownItem,
	DropdownSeparator,
	Button,
} from "@matrixzero/ui";

export default function Example() {
	const [message, setMessage] = useState("");
	return (
		<>
			<DropdownMenu modal={false}>
				<DropdownTrigger asChild>
					<Button>操作 Actions</Button>
				</DropdownTrigger>
				<DropdownContent>
					<DropdownItem onSelect={() => setMessage("已保存 Saved")}>保存 Save</DropdownItem>
					<DropdownSeparator />
					<DropdownItem disabled>删除 Delete</DropdownItem>
				</DropdownContent>
			</DropdownMenu>
			<p role="status">{message}</p>
		</>
	);
}
