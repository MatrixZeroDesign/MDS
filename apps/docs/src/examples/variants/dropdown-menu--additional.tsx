import { type DocsLocale, translate } from "../../i18n";
import { useState } from "react";
import {
	DropdownMenu,
	DropdownTrigger,
	DropdownContent,
	DropdownItem,
	DropdownSeparator,
	Button,
} from "@matrixzero/ui";

export default function Example({ locale = "en" }: { locale?: DocsLocale }) {
	const t = (zh: string, en: string) => translate(locale, zh, en);
	const [message, setMessage] = useState("");
	return (
		<div style={{ display: "grid", gap: 16 }}>
			<DropdownMenu modal={false}>
				<DropdownTrigger asChild>
					<Button>{t("操作", "Actions")}</Button>
				</DropdownTrigger>
				<DropdownContent placement="top-end">
					<DropdownItem onSelect={() => setMessage(t("已保存", "Saved"))}>{t("保存", "Save")}</DropdownItem>
					<DropdownSeparator />
					<DropdownItem disabled>{t("删除", "Delete")}</DropdownItem>
				</DropdownContent>
			</DropdownMenu>
			<p role="status" style={{ margin: 0 }}>
				{message}
			</p>
		</div>
	);
}
