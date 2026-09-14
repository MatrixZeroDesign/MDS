import { useId, useState } from "react";
import { translate, type DocsLocale } from "../../i18n";
import { ScrollNavigator } from "@matrixzero/ui";
export default function Example({ locale = "en" }: { locale?: DocsLocale }) {
	const prefix = useId();
	const t = (zh: string, en: string) => translate(locale, zh, en);
	const [container, setContainer] = useState<HTMLDivElement | null>(null);
	const items = Array.from({ length: 40 }, (_, i) => ({
		id: `${prefix}-${i}`,
		label: t("第 {number} 条记录", "Entry {number}").replace("{number}", String(i + 1)),
		description: t(
			"悬停预览，点击定位。键盘支持上下方向键、Home 和 End。",
			"Hover to preview; select to navigate. Use the arrow keys, Home, and End to explore.",
		),
	}));
	return (
		<div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
			<ScrollNavigator
				items={items}
				label={t("记录导航", "Entry navigation")}
				scrollContainer={container}
				style={{ maxHeight: 320 }}
			/>
			<div
				ref={setContainer}
				style={{ height: 320, flex: 1, minWidth: 0, overflow: "auto", background: "var(--mds-soft)", borderRadius: 16 }}
			>
				{items.map((item) => (
					<section key={item.id} id={item.id} style={{ minHeight: 200, padding: 24 }}>
						<h3>{item.label}</h3>
						<p>{item.description}</p>
					</section>
				))}
			</div>
		</div>
	);
}
