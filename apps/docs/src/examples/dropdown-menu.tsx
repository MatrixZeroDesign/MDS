import { useState } from "react";
import {
	DropdownMenu,
	DropdownTrigger,
	DropdownContent,
	DropdownItem,
	DropdownSeparator,
	Button,
} from "@matrixzero/ui";

export default function Example({ locale = "zh" }: { locale?: "zh" | "en" }) {
	const t = (zh: string, en: string) => (locale === "zh" ? zh : en);
	const [message, setMessage] = useState("");
	return (
		<>
			<DropdownMenu modal={false}>
				<DropdownTrigger asChild>
					<Button>{t("操作", "Actions")}</Button>
				</DropdownTrigger>
				<DropdownContent>
					<DropdownItem onSelect={() => setMessage(t("已保存", "Saved"))}>{t("保存", "Save")}</DropdownItem>
					<DropdownSeparator />
					<DropdownItem disabled>{t("删除", "Delete")}</DropdownItem>
				</DropdownContent>
			</DropdownMenu>
			<p role="status">{message}</p>
		</>
	);
}
