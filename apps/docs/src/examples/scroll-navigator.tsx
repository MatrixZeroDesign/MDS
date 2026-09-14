import { useId, useState } from "react";
import { translate, type DocsLocale } from "../i18n";
import { ScrollNavigator, Badge } from "@matrixzero/ui";
export default function Example({ locale = "en" }: { locale?: DocsLocale }) {
	const prefix = useId();
	const [container, setContainer] = useState<HTMLDivElement | null>(null);
	const t = (zh: string, en: string) => translate(locale, zh, en);
	const chapters = [
		[
			t("构思与方向", "A clear direction"),
			t(
				"先确定需要解决的问题，让每个细节都有意义。",
				"Start with the problem to solve, and give every detail a purpose.",
			),
		],
		[
			t("探索与实验", "Room to explore"),
			t(
				"收集灵感、测试假设，把新的可能性放到一起。",
				"Collect inspiration, test assumptions, and bring new possibilities together.",
			),
		],
		[
			t("打磨与完善", "The thoughtful details"),
			t(
				"清晰的层次、舒适的留白和及时的反馈，让体验更自然。",
				"Clear hierarchy, generous spacing, and timely feedback make the experience feel natural.",
			),
		],
		[
			t("交付与成长", "Ready to grow"),
			t("从真实反馈中学习，不断改进。", "Learn from real feedback and keep improving."),
		],
	];
	const items = chapters.map(([label, description], index) => ({ id: `${prefix}-${index}`, label, description }));
	return (
		<div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
			<ScrollNavigator items={items} label={t("阅读进度", "Reading progress")} scrollContainer={container} />
			<div
				ref={setContainer}
				style={{ height: 340, overflow: "auto", flex: 1, minWidth: 0, borderRadius: 16, background: "var(--mds-soft)" }}
			>
				{items.map((item, index) => (
					<section key={item.id} id={item.id} style={{ minHeight: 280, padding: 28, scrollMarginTop: 24 }}>
						<Badge>{String(index + 1).padStart(2, "0")}</Badge>
						<h3>{item.label}</h3>
						<p style={{ color: "var(--mds-muted)", lineHeight: 1.7, maxWidth: 480 }}>{item.description}</p>
					</section>
				))}
			</div>
		</div>
	);
}
