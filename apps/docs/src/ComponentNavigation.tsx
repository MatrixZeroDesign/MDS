import { componentNames, componentTitle } from "./componentNames";
import { useEffect, useState } from "react";
import { Input } from "@matrixzero/ui";
import entries from "../../../docs/content.json";

export function ComponentNavigation({
	locale,
	onNavigate,
	kind = "ui",
}: {
	locale: "zh" | "en";
	onNavigate?: () => void;
	kind?: "ui" | "charts";
}) {
	const [hash, setHash] = useState(location.hash);
	const [query, setQuery] = useState("");
	useEffect(() => {
		const sync = () => setHash(location.hash);
		window.addEventListener("hashchange", sync);
		return () => window.removeEventListener("hashchange", sync);
	}, []);
	const t = (zh: string, en: string) => (locale === "zh" ? zh : en);
	const items = entries
		.filter((e) => e.package === kind)
		.sort((a, b) => a.names[0].localeCompare(b.names[0]))
		.filter((e) =>
			[componentNames[e.slug], e.names.join(" "), e.purpose].join(" ").toLowerCase().includes(query.toLowerCase()),
		);
	const link = (href: string, label: string) => (
		<a
			key={href}
			href={href}
			title={label}
			aria-label={label}
			onClick={onNavigate}
			aria-current={hash === href || (href === "#docs/start" && hash === "#docs") ? "page" : undefined}
		>
			<span className="docs-component-label">{label}</span>
		</a>
	);
	return (
		<div className="docs-component-navigation">
			<div className="docs-component-search">
				<Input
					aria-label={t("搜索组件文档", "Search component documentation")}
					placeholder={t("查找组件…", "Find a component…")}
					value={query}
					onChange={(e) => setQuery(e.target.value)}
				/>
			</div>
			<p className="docs-eyebrow">{kind === "charts" ? t("图表", "Charts") : t("开始使用", "Get started")}</p>
			{kind === "charts" ? (
				link("#charts", t("图表总览", "Chart overview"))
			) : (
				<>
					{link("#docs/start", t("快速开始", "Getting started"))}
					{link("#docs/theme-motion", t("主题与动效", "Themes & motion"))}
					{link("#system", t("基础与组件", "Foundations & components"))}
					<p className="docs-eyebrow">{t("组件", "Components")}</p>
				</>
			)}
			{items.map((e) => link(`#${kind === "charts" ? "charts" : "docs"}/${e.slug}`, componentTitle(e, locale)))}
			{!items.length && <p className="docs-muted">{t("没有匹配的组件", "No matching components")}</p>}
		</div>
	);
}
