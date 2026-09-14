import { type DocsLocale, translate } from "./i18n";
export function ExampleLoading({ slug, locale }: { slug: string; locale: DocsLocale }) {
	const chart = slug.endsWith("-chart") || slug === "data-table" || slug === "table";
	const cards = ["radio-card", "card", "empty-state"].includes(slug);
	const field = /field|input|select|picker|form|textarea/.test(slug);
	return (
		<div
			className="docs-example-loading"
			role="status"
			aria-label={translate(locale, "正在加载示例", "Loading example")}
			data-layout={chart ? "chart" : cards ? "cards" : field ? "field" : "compact"}
		>
			<span className="docs-loading-sr">{translate(locale, "正在加载示例", "Loading example")}</span>
			<div className="docs-example-loading-art" aria-hidden="true">
				{chart ? (
					<>
						<i className="docs-loading-line" />
						<div className="docs-loading-plot">
							{[42, 68, 53, 85, 72, 95, 64].map((height, index) => (
								<i key={index} style={{ height: height + "%" }} />
							))}
						</div>
					</>
				) : cards ? (
					[0, 1].map((i) => (
						<div className="docs-loading-card" key={i}>
							<i className="docs-loading-dot" />
							<i className="docs-loading-line" />
							<i className="docs-loading-line docs-loading-short" />
						</div>
					))
				) : field ? (
					<>
						<i className="docs-loading-line docs-loading-short" />
						<i className="docs-loading-field" />
						<i className="docs-loading-line" />
					</>
				) : (
					<>
						<i className="docs-loading-control" />
						<i className="docs-loading-control docs-loading-short" />
					</>
				)}
			</div>
		</div>
	);
}
