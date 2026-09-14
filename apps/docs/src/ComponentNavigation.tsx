import { translatePair, type DocsLocale, translate } from "./i18n";
import { componentSections } from "./componentSections";
import { componentNames, componentTitle } from "./componentNames";
import { useEffect, useState } from "react";
import { Input, NavLink } from "@matrixzero/ui";
import entries from "../../../docs/content.json";

export function ComponentNavigation({
	locale,
	onNavigate,
	kind = "ui",
}: {
	locale: DocsLocale;
	onNavigate?: () => void;
	kind?: "ui" | "charts";
}) {
	const [hash, setHash] = useState(location.pathname);
	const [query, setQuery] = useState("");
	useEffect(() => {
		const sync = () => setHash(location.pathname);
		window.addEventListener("popstate", sync);
		return () => window.removeEventListener("popstate", sync);
	}, []);
	const t = (zh: string, en: string) => translate(locale, zh, en);
	const items = entries
		.filter((e) => e.package === kind)
		.sort((a, b) => a.names[0].localeCompare(b.names[0]))
		.filter((e) =>
			[componentNames[e.slug], e.names.join(" "), e.purpose].join(" ").toLowerCase().includes(query.toLowerCase()),
		);
	const link = (href: string, label: string) => (
		<NavLink
			key={href}
			href={href}
			title={label}
			aria-label={label}
			onClick={onNavigate}
			active={hash === href || (href === "/docs/start" && hash === "/docs")}
		>
			<span className="docs-component-label">{label}</span>
		</NavLink>
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
			<h3 className="docs-eyebrow">{kind === "charts" ? t("图表", "Charts") : t("开始使用", "Get started")}</h3>
			{kind === "charts" ? (
				link("/charts", t("图表总览", "Chart overview"))
			) : (
				<>
					{link("/docs/start", t("快速开始", "Getting started"))}
					{link("/docs/theme-motion", t("主题与动效", "Themes & motion"))}
					{link("/system", t("组件总览", "Component gallery"))}
				</>
			)}
			{componentSections.map((section) => {
				const grouped = section.slugs.flatMap((slug) => items.filter((item) => item.slug === slug));
				if (!grouped.length) return null;
				return (
					<section
						key={section.id}
						className="docs-component-section"
						aria-label={translatePair(locale, section.title)}
					>
						<h3 className="docs-eyebrow">{translatePair(locale, section.title)}</h3>
						{grouped.map((e) => link(`/${kind === "charts" ? "charts" : "docs"}/${e.slug}`, componentTitle(e, locale)))}
					</section>
				);
			})}
			{!items.length && <p className="docs-muted">{t("没有匹配的组件", "No matching components")}</p>}
		</div>
	);
}
