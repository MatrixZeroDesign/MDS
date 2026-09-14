import { type DocsLocale, translate } from "../../i18n";
import { useId } from "react";
import { Anchor } from "@matrixzero/ui";
export default function Example({ locale = "en" }: { locale?: DocsLocale }) {
	const id = useId();
	const t = (zh: string, en: string) => translate(locale, zh, en);
	const items = [
		{
			id: id + "overview",
			label: t("概览", "Overview"),
			children: [
				{ id: id + "install", label: t("安装", "Installation") },
				{
					id: id + "config",
					label: t("配置", "Configuration"),
					children: [{ id: id + "theme", label: t("主题", "Theme") }],
				},
			],
		},
	];
	return (
		<div style={{ display: "grid", gap: 24 }}>
			<Anchor label={t("嵌套目录", "Nested contents")} items={items} />
			{[items[0], items[0].children[0], items[0].children[1], items[0].children[1].children![0]].map((item) => (
				<section
					id={item.id}
					key={item.id}
					style={{ padding: 24, minHeight: 160, background: "var(--mds-soft)", borderRadius: 12 }}
				>
					<h4>{item.label}</h4>
				</section>
			))}
		</div>
	);
}
