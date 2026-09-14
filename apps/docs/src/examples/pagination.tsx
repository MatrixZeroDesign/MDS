import { type DocsLocale, translate } from "../i18n";
import { useState } from "react";
import { Pagination } from "@matrixzero/ui";

export default function Example({ locale = "en" }: { locale?: DocsLocale }) {
	const t = (zh: string, en: string) => translate(locale, zh, en);
	const [page, setPage] = useState(1);
	return (
		<Pagination
			page={page}
			pages={5}
			onPageChange={setPage}
			label={t("分页", "Pages")}
			previousLabel={t("上一页", "Previous")}
			nextLabel={t("下一页", "Next")}
		/>
	);
}
