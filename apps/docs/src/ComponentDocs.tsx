import { ArrowUpRight, ArrowRight } from "@matrixzero/icons";
import { translatePair, translateProse, type DocsLocale, translate } from "./i18n";
import { ExampleLoading } from "./ExampleLoading";
import { ExampleCode } from "./ExampleCode";
import variantManifest from "./exampleVariants.json";
import { ApiReference } from "./ApiReference";
import { componentTitle } from "./componentNames";
import { playgroundControls, playgroundLabels } from "./playground";
import "@matrixzero/charts/styles.css";
import { lazy, Suspense, useEffect, useState } from "react";
import { Anchor, Button, Field, Select } from "@matrixzero/ui";
import { appPath, routePath } from "./router";
import entries from "../../../docs/content.json";
const examples = import.meta.glob("./examples/*.tsx", { query: "?raw", import: "default", eager: true }) as Record<
	string,
	string
>;
const variantSources = import.meta.glob("./examples/variants/*.tsx", {
	query: "?raw",
	import: "default",
	eager: true,
}) as Record<string, string>;
const variantPreviews = Object.fromEntries(
	Object.entries(
		import.meta.glob<{ default: React.ComponentType<{ locale?: DocsLocale }> }>("./examples/variants/*.tsx"),
	).map(([path, load]) => [path, lazy(load)]),
);
const previews = Object.fromEntries(
	Object.entries(import.meta.glob<{ default: React.ComponentType<{ locale?: DocsLocale }> }>("./examples/*.tsx")).map(
		([path, load]) => [path, lazy(load)],
	),
);
export function ComponentDocs({ locale }: { locale: DocsLocale }) {
	const [selected, setSelected] = useState(() => routePath().split("/")[2] || "");
	const [selection, setSelection] = useState<{ slug: string; values: Record<string, string> }>({
		slug: "",
		values: {},
	});
	const [revision, setRevision] = useState(0);
	const [replays, setReplays] = useState<Record<string, number>>({});

	const text = (value: string) => translateProse(locale, value);
	const t = (zh: string, en: string) => translate(locale, zh, en);
	useEffect(() => {
		const sync = () => {
			setSelected(routePath().split("/")[2] || "");
		};
		window.addEventListener("popstate", sync);
		return () => window.removeEventListener("popstate", sync);
	}, []);
	const entry = entries.find((e) => e.slug === selected);
	const Preview = entry ? previews[`./examples/${entry.slug}.tsx`] : undefined;
	const documentedVariants = (variantManifest as Record<string, { file: string; title: string[] }[]>)[selected] ?? [];
	const sectionId = (name: string) => selected + "-" + name;
	const toc = [
		{
			id: sectionId("example"),
			label: t("示例", "Examples"),
			children: [
				{ id: sectionId("basic-example"), label: t("基本示例", "Basic example") },
				...documentedVariants.map((v) => ({ id: sectionId(v.file), label: translatePair(locale, v.title) })),
			],
		},
		{ id: sectionId("guide"), label: t("使用指南", "Guide") },
		{ id: sectionId("api"), label: "API" },
		{ id: sectionId("accessibility"), label: t("无障碍与键盘", "Accessibility & keyboard") },
		{ id: sectionId("pitfalls"), label: t("常见误用", "Common pitfalls") },
	];
	const controls = (playgroundControls[selected] || []).filter(
		(control) => !documentedVariants.some((variant) => variant.file.startsWith(selected + "--" + control.key + "-")),
	);
	const values = Object.fromEntries(
		controls.map((control) => [
			control.key,
			selection.slug === selected ? (selection.values[control.key] ?? control.initial) : control.initial,
		]),
	);
	const previewProps = Object.fromEntries(
		controls.map((control) => [control.key, control.boolean ? values[control.key] === "true" : values[control.key]]),
	);
	let code = entry
		? examples[`./examples/${entry.slug}.tsx`].replace(/locale = "(?:zh|en)"/, `locale = "${locale}"`)
		: "";
	for (const control of controls) {
		code = code.replace(
			new RegExp(`(${control.key}\\s*=\\s*)("[^"]*"|true|false)`),
			(_, prefix) => prefix + (control.boolean ? values[control.key] : JSON.stringify(values[control.key])),
		);
	}
	return (
		<div className="docs-reference docs-reference-single">
			{entry ? (
				<>
					<aside className="docs-page-contents">
						<p className="docs-eyebrow">{t("本页目录", "On this page")}</p>
						<Anchor key={entry.slug} label={t("本页目录", "On this page")} items={toc} offset={112} />
					</aside>
					<article className="docs-article docs-reference-detail" data-graphic="ambient" key={entry.slug}>
						<div className="docs-row">
							<p className="docs-eyebrow">@matrixzero/{entry.package}</p>
						</div>
						<h1>{componentTitle(entry, locale, true)}</h1>
						<p>{text(entry.purpose)}</p>
						<h2 id={sectionId("example")}>{t("示例", "Examples")}</h2>
						<section
							id={sectionId("basic-example")}
							aria-label={t("交互示例", "Interactive example")}
							className="docs-live-example"
						>
							<h3>{t("基本示例", "Basic example")}</h3>
							{controls.length > 0 && (
								<div className="docs-playground-controls" role="group" aria-label={t("示例设置", "Example settings")}>
									{controls.map((control) => (
										<Field key={control.key} label={t(...control.label)}>
											<Select
												value={values[control.key]}
												onValueChange={(value) =>
													setSelection({ slug: selected, values: { ...values, [control.key]: value } })
												}
												options={control.values.map((value) => ({ value, label: t(...playgroundLabels[value]) }))}
											/>
										</Field>
									))}
									<Button
										variant="ghost"
										size="sm"
										onClick={() => {
											setSelection({ slug: selected, values: {} });
											setRevision((value) => value + 1);
										}}
									>
										{t("重置", "Reset")}
									</Button>
								</div>
							)}
							<div className="docs-live-stage">
								<Suspense fallback={<ExampleLoading slug={entry.slug} locale={locale} />}>
									{Preview && <Preview key={`${locale}-${revision}`} locale={locale} {...previewProps} />}
								</Suspense>
							</div>
							<ExampleCode
								code={code}
								locale={locale}
								onReplay={selected === "feature-highlight" ? () => setRevision((value) => value + 1) : undefined}
							/>
						</section>
						{((variantManifest as Record<string, { file: string; title: string[] }[]>)[entry.slug] ?? []).map(
							(variant) => {
								const path = "./examples/variants/" + variant.file + ".tsx";
								const Variant = variantPreviews[path];
								return (
									<section
										key={variant.file}
										id={sectionId(variant.file)}
										className="docs-live-example"
										aria-label={translatePair(locale, variant.title)}
									>
										<h3>{translatePair(locale, variant.title)}</h3>
										<div className="docs-live-stage">
											<Suspense fallback={<ExampleLoading slug={entry.slug} locale={locale} />}>
												<Variant key={replays[variant.file] ?? 0} locale={locale} />
											</Suspense>
										</div>
										<ExampleCode
											locale={locale}
											onReplay={
												selected === "feature-highlight"
													? () =>
															setReplays((values) => ({ ...values, [variant.file]: (values[variant.file] ?? 0) + 1 }))
													: undefined
											}
											code={variantSources[path].replace(/locale = "(?:zh|en)"/, 'locale = "' + locale + '"')}
										/>
									</section>
								);
							},
						)}
						<h2 id={sectionId("guide")}>{t("使用指南", "Guide")}</h2>
						<p>{text(entry.guide)}</p>
						<h2 id={sectionId("api")}>API</h2>
						<ApiReference api={entry.api} name={entry.names[0]} slug={entry.slug} locale={locale} />
						<p>
							<a href={appPath(`/docs/api/${entry.package}.md`)}>
								{t("完整类型声明（含继承属性）", "Full type declarations, including inherited props")}{" "}
								<ArrowUpRight size={"1em"} className="docs-symbol" />
							</a>
						</p>
						<h2 id={sectionId("accessibility")}>{t("无障碍与键盘", "Accessibility & keyboard")}</h2>
						<p>{text(entry.a11y)}</p>
						<h2 id={sectionId("pitfalls")}>{t("常见误用", "Common pitfalls")}</h2>
						<p>{text(entry.pitfalls)}</p>
						<div className="docs-reference-footer">
							<a href={appPath(`/docs/components/${entry.slug}.md`)}>
								{t("Markdown 文档", "Markdown documentation")} <ArrowUpRight size={"1em"} className="docs-symbol" />
							</a>
							<a href={entry.package === "charts" ? "/charts" : entry.package === "icons" ? "/icons" : "/system"}>
								{t("打开交互示例", "Open interactive examples")} <ArrowRight size={"1em"} className="docs-symbol" />
							</a>
							<a href={appPath(`/docs/examples/${entry.slug}.tsx`)}>
								{t("下载 TSX 示例", "Download TSX example")} <ArrowUpRight size={"1em"} className="docs-symbol" />
							</a>
						</div>
					</article>
				</>
			) : (
				<article className="docs-article docs-reference-detail">
					<p className="docs-eyebrow">COMPONENT REFERENCE</p>
					<h1>{t("组件文档", "Component reference")}</h1>
					<p>
						{t(
							"选择组件阅读用途、API、完整示例、键盘行为与常见误用。图表与图标也遵循同一份文档契约。",
							"Choose a component for its purpose, API, complete example, keyboard behavior and pitfalls. Charts and icons follow the same documentation contract.",
						)}
					</p>
					<div className="docs-guide-grid">
						{entries.map((e) => (
							<a className="docs-guide-card" key={e.slug} href={appPath(`/docs/${e.slug}`)}>
								<h3>{componentTitle(e, locale)}</h3>
								<p>{text(e.purpose)}</p>
								<span>
									{t("阅读指南", "Read guide")} <ArrowRight size={"1em"} className="docs-symbol" />
								</span>
							</a>
						))}
					</div>
				</article>
			)}
		</div>
	);
}
