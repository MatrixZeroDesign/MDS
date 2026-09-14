import { type DocsLocale, translate } from "../i18n";
import { useState } from "react";
import { Avatar, Badge, SelectionList, SelectionListItem } from "@matrixzero/ui";

export default function Example({ locale = "en" }: { locale?: DocsLocale }) {
	const [value, setValue] = useState("avery");
	const t = (zh: string, en: string) => translate(locale, zh, en);
	return (
		<SelectionList
			label={t("选择团队成员", "Choose a teammate")}
			value={value}
			onValueChange={setValue}
			style={{ maxWidth: 420 }}
		>
			<SelectionListItem
				value="avery"
				leading={<Avatar alt="Avery Morgan" fallback="AM" />}
				trailing={<Badge>{t("所有者", "Owner")}</Badge>}
			>
				<strong>Avery Morgan</strong>
				<div className="mds-description">{t("产品设计", "Product design")}</div>
			</SelectionListItem>
			<SelectionListItem
				value="mina"
				leading={<Avatar alt="Mina Lee" fallback="ML" />}
				trailing={<Badge>{t("编辑者", "Editor")}</Badge>}
			>
				<strong>Mina Lee</strong>
				<div className="mds-description">{t("研究", "Research")}</div>
			</SelectionListItem>
			<SelectionListItem
				value="sam"
				leading={<Avatar alt="Sam Rivera" fallback="SR" />}
				trailing={<Badge>{t("查看者", "Viewer")}</Badge>}
			>
				<strong>Sam Rivera</strong>
				<div className="mds-description">{t("工程", "Engineering")}</div>
			</SelectionListItem>
		</SelectionList>
	);
}
