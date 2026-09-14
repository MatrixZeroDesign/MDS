import { type DocsLocale, translate } from "../../i18n";
import { Navbar, NavLink } from "@matrixzero/ui";
export default function Example({ locale = "en" }: { locale?: DocsLocale }) {
	const t = (zh: string, en: string) => translate(locale, zh, en);
	return (
		<div
			role="region"
			aria-label={t("吸顶导航演示", "Sticky navigation demo")}
			tabIndex={0}
			style={{ height: 300, overflow: "auto", border: "1px solid var(--mds-border)", borderRadius: 12 }}
		>
			<Navbar sticky>
				<strong>Matrix</strong>
				<nav aria-label={t("演示导航", "Demo navigation")} style={{ display: "flex", gap: 8 }}>
					<NavLink href="/docs/navigation" active>
						{t("导航栏", "Navbar")}
					</NavLink>
					<NavLink href="/docs/nav-drawer">{t("导航抽屉", "Drawer")}</NavLink>
				</nav>
			</Navbar>
			<div style={{ display: "grid", gap: 24, padding: 24 }}>
				{Array.from({ length: 8 }, (_, index) => (
					<section key={index} style={{ padding: 20, background: "var(--mds-soft)", borderRadius: 12 }}>
						<h4 style={{ margin: "0 0 8px" }}>
							{t("内容区块", "Content section")} {index + 1}
						</h4>
						<p style={{ margin: 0 }}>
							{t("滚动此区域，导航栏保持在顶部。", "Scroll this area; the navigation bar stays at the top.")}
						</p>
					</section>
				))}
			</div>
		</div>
	);
}
