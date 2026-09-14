import { type DocsLocale, translate } from "../../i18n";
import { useState } from "react";
import { Navbar, NavItem, Button } from "@matrixzero/ui";
export default function Example({ locale = "en" }: { locale?: DocsLocale }) {
	const t = (zh: string, en: string) => translate(locale, zh, en);
	const [active, setActive] = useState("pricing");
	return (
		<Navbar>
			<strong>Matrix</strong>
			<nav aria-label={t("顶部导航", "Top navigation")} style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
				<NavItem active={active === "product"} onClick={() => setActive("product")}>
					{t("产品", "Product")}
				</NavItem>
				<NavItem active={active === "pricing"} onClick={() => setActive("pricing")}>
					{t("价格", "Pricing")}
				</NavItem>
			</nav>
			<Button onClick={() => setActive("account")}>{t("账户", "Account")}</Button>
		</Navbar>
	);
}
