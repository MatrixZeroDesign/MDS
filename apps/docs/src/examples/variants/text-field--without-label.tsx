import { type DocsLocale, translate } from "../../i18n";
import { TextField } from "@matrixzero/ui";
import { Search } from "@matrixzero/icons";

export default function Example({ locale = "en" }: { locale?: DocsLocale }) {
	const t = (zh: string, en: string) => translate(locale, zh, en);
	return (
		<div role="search" style={{ width: "min(100%, 420px)" }}>
			<TextField
				type="search"
				aria-label={t("搜索组件", "Search components")}
				placeholder={t("搜索组件", "Search components")}
				leadingIcon={<Search />}
			/>
		</div>
	);
}
