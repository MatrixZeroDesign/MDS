import { ApiReference } from "./ApiReference";
import { componentTitle } from "./componentNames";
import { playgroundControls, playgroundLabels } from "./playground";
import "@matrixzero/charts/styles.css";
import { lazy, Suspense, useEffect, useState } from "react";
import { Button, Field, Select } from "@matrixzero/ui";
import entries from "../../../docs/content.json";
const examples = import.meta.glob("./examples/*.tsx", { query: "?raw", import: "default", eager: true }) as Record<
	string,
	string
>;
const previews = Object.fromEntries(
	Object.entries(import.meta.glob<{ default: React.ComponentType<{ locale?: "zh" | "en" }> }>("./examples/*.tsx")).map(
		([path, load]) => [path, lazy(load)],
	),
);
export function ComponentDocs({ locale }: { locale: "zh" | "en" }) {
	const [selected, setSelected] = useState(() => location.hash.split("/")[1] || "");
	const [selection, setSelection] = useState<{ slug: string; values: Record<string, string> }>({
		slug: "",
		values: {},
	});
	const [revision, setRevision] = useState(0);
	const [status, setStatus] = useState("");
	const text = (value: string) => value.split(" / ")[locale === "zh" ? 0 : 1] || value;
	const t = (zh: string, en: string) => (locale === "zh" ? zh : en);
	useEffect(() => {
		const sync = () => {
			setSelected(location.hash.split("/")[1] || "");
			setStatus("");
		};
		window.addEventListener("hashchange", sync);
		return () => window.removeEventListener("hashchange", sync);
	}, []);
	const entry = entries.find((e) => e.slug === selected);
	const Preview = entry ? previews[`./examples/${entry.slug}.tsx`] : undefined;
	const controls = playgroundControls[selected] || [];
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
				<article className="docs-article docs-reference-detail" key={entry.slug}>
					<div className="docs-row">
						<p className="docs-eyebrow">@matrixzero/{entry.package}</p>
						<a href={`./docs/components/${entry.slug}.md`}>Markdown ↗</a>
					</div>
					<h2>{componentTitle(entry, locale, true)}</h2>
					<p>{text(entry.purpose)}</p>
					<section aria-label={t("交互示例", "Interactive example")} className="docs-live-example">
						<h3>{t("示例", "Example")}</h3>
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
							<Suspense fallback={<p role="status">{t("加载示例…", "Loading example…")}</p>}>
								{Preview && <Preview key={`${locale}-${revision}`} locale={locale} {...previewProps} />}
							</Suspense>
						</div>
					</section>
					<h3>{t("使用指南", "Guide")}</h3>
					<p>{text(entry.guide)}</p>
					<h3>API</h3>
					<ApiReference api={entry.api} name={entry.names[0]} slug={entry.slug} locale={locale} />
					<p>
						<a href={`./docs/api/${entry.package}.md`}>
							{t("完整类型声明（含继承属性）", "Full type declarations, including inherited props")} ↗
						</a>
					</p>
					<div className="docs-row">
						<h3>{t("完整示例", "Usage example")}</h3>
						<Button
							size="sm"
							onClick={async () => {
								try {
									await navigator.clipboard.writeText(code);
									setStatus(t("已复制完整示例", "Complete example copied"));
								} catch {
									setStatus(t("无法访问剪贴板，请手动复制代码。", "Clipboard unavailable; copy the code manually."));
								}
							}}
						>
							{t("复制示例", "Copy example")}
						</Button>
					</div>
					<p className="docs-muted">
						{t(
							"先按快速开始导入 CSS，并在 ThemeProvider 内渲染。本示例包含导入与所需状态，已纳入类型检查。",
							"Import CSS and render within ThemeProvider as shown in Getting started. This complete module is included in type checking.",
						)}
					</p>
					<pre>
						<code>{code}</code>
					</pre>
					<p role="status">{status}</p>
					<h3>{t("无障碍与键盘", "Accessibility & keyboard")}</h3>
					<p>{text(entry.a11y)}</p>
					<h3>{t("常见误用", "Common pitfalls")}</h3>
					<p>{text(entry.pitfalls)}</p>
					<div className="docs-reference-footer">
						<a href={entry.package === "charts" ? "#charts" : entry.package === "icons" ? "#icons" : "#system"}>
							{t("打开交互示例", "Open interactive examples")} →
						</a>
						<a href={`./docs/examples/${entry.slug}.tsx`}>{t("下载 TSX 示例", "Download TSX example")} ↗</a>
					</div>
				</article>
			) : (
				<article className="docs-article docs-reference-detail">
					<p className="docs-eyebrow">COMPONENT REFERENCE</p>
					<h2>{t("知道何时用，也知道怎么用。", "Know when to use it—and how.")}</h2>
					<p>
						{t(
							"选择组件阅读用途、API、完整示例、键盘行为与常见误用。图表与图标也遵循同一份文档契约。",
							"Choose a component for its purpose, API, complete example, keyboard behavior and pitfalls. Charts and icons follow the same documentation contract.",
						)}
					</p>
					<div className="docs-guide-grid">
						{entries.map((e) => (
							<a className="docs-guide-card" key={e.slug} href={`#docs/${e.slug}`}>
								<h3>{componentTitle(e, locale)}</h3>
								<p>{text(e.purpose)}</p>
								<span>{t("阅读指南", "Read guide")} →</span>
							</a>
						))}
					</div>
				</article>
			)}
		</div>
	);
}
