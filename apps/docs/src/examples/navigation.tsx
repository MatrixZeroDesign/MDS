import { Navbar, NavRail, NavItem, NavLink } from "@matrixzero/ui";

export default function Example({ locale = "en" }: { locale?: "zh" | "en" }) {
	const t = (zh: string, en: string) => (locale === "zh" ? zh : en);
	return (
		<div style={{ display: "grid", gap: 16 }}>
			<Navbar>Matrix</Navbar>
			<NavRail label={t("主导航", "Main")}>
				<NavLink href="#overview" active>
					{t("概览", "Overview")}
				</NavLink>
				<NavLink href="#docs">{t("文档", "Docs")}</NavLink>
			</NavRail>
		</div>
	);
}
