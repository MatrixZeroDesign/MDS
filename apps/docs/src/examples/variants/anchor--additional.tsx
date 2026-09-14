import { type DocsLocale, translate } from "../../i18n";
import { useId } from "react";
import { Anchor } from "@matrixzero/ui";
export default function Example({ locale = "en" }: { locale?: DocsLocale }) {
	const id = useId();
	const t = (zh: string, en: string) => translate(locale, zh, en);
	const items = [
		{ id: id + "-intro", label: t("简介", "Introduction") },
		{ id: id + "-details", label: t("详情", "Details") },
	];
	return (
		<div style={{ display: "grid", gap: 24 }}>
			<Anchor smooth={false} offset={24} label={t("本页内容", "On this page")} items={items} />
			{items.map((item) => (
				<section
					id={item.id}
					key={item.id}
					style={{ minHeight: 180, padding: 20, background: "var(--mds-soft)", borderRadius: 12 }}
				>
					<h4>{item.label}</h4>
					<p>{t("点击目录跳转到此章节。", "Use the contents navigation to jump to this section.")}</p>
				</section>
			))}
		</div>
	);
}
