import { type DocsLocale, translate } from "../i18n";
import { useState } from "react";
import { TextField } from "@matrixzero/ui";
import { AtSign } from "@matrixzero/icons";

export default function Example({ locale = "en" }: { locale?: DocsLocale }) {
	const t = (zh: string, en: string) => translate(locale, zh, en);
	const [workspace, setWorkspace] = useState("matrix");
	return (
		<TextField
			label={t("工作区地址", "Workspace address")}
			description={t("使用字母、数字和连字符。", "Use letters, numbers, and hyphens.")}
			leadingIcon={<AtSign />}
			unit=".example.com"
			name="workspace"
			value={workspace}
			onChange={(event) => setWorkspace(event.target.value)}
			autoComplete="off"
		/>
	);
}
