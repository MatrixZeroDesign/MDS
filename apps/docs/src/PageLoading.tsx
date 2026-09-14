import { type DocsLocale, translate } from "./i18n";
/** Reserves the document layout without flashing a text-only loading screen. */
export function PageLoading({ locale }: { locale: DocsLocale }) {
	return (
		<div className="docs-page-loading" role="status" aria-label={translate(locale, "正在加载页面", "Loading page")}>
			<span className="docs-loading-sr">{translate(locale, "正在加载页面", "Loading page")}</span>
			<div className="docs-page-loading-art" aria-hidden="true">
				<i className="docs-page-loading-eyebrow" />
				<i className="docs-page-loading-title" />
				<i className="docs-page-loading-description" />
				<i className="docs-page-loading-heading" />
				<div className="docs-page-loading-preview">
					<i />
					<i />
				</div>
				<div className="docs-page-loading-actions">
					<i />
					<i />
				</div>
			</div>
		</div>
	);
}
