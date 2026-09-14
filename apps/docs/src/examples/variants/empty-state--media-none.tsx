import { type DocsLocale, translate } from "../../i18n";
import { EmptyState } from "@matrixzero/ui";
import { Search } from "@matrixzero/icons";

export default function Example({
	locale = "en",
	media = "none",
	thumbnailSize = "md",
}: {
	locale?: DocsLocale;
	media?: "icon" | "illustration" | "none";
	thumbnailSize?: "sm" | "md" | "lg";
}) {
	const t = (zh: string, en: string) => translate(locale, zh, en);
	// Decorative vector illustration: no external assets or duplicated screen-reader text.
	const illustration = (
		<svg viewBox="0 0 160 160" aria-hidden="true" focusable="false">
			<circle cx="80" cy="80" r="72" fill="var(--mds-soft)" />
			<rect
				x="38"
				y="31"
				width="70"
				height="94"
				rx="12"
				fill="var(--mds-surface)"
				stroke="var(--mds-border)"
				strokeWidth="2"
			/>
			<path
				d="M54 51h36M54 65h28M54 79h19"
				fill="none"
				stroke="var(--mds-muted)"
				strokeWidth="3"
				strokeLinecap="round"
			/>
			<circle cx="103" cy="103" r="22" fill="var(--mds-tint)" stroke="var(--mds-accent)" strokeWidth="3" />
			<path d="m119 119 15 15" stroke="var(--mds-accent)" strokeWidth="5" strokeLinecap="round" />
		</svg>
	);
	return (
		<EmptyState
			thumbnail={media === "illustration" ? illustration : media === "icon" ? <Search /> : undefined}
			thumbnailSize={thumbnailSize}
			title={t("没有匹配项", "No matches")}
			description={t("尝试更短的关键词，或调整筛选条件。", "Try a shorter query or adjust your filters.")}
		/>
	);
}
