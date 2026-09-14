import { type DocsLocale, translate } from "../i18n";
import {
	MegaMenu,
	MegaMenuList,
	MegaMenuItem,
	MegaMenuTrigger,
	MegaMenuContent,
	MegaMenuGroup,
	MegaMenuLink,
} from "@matrixzero/ui";
export default function Example({ locale = "en" }: { locale?: DocsLocale }) {
	const t = (zh: string, en: string) => translate(locale, zh, en);
	return (
		<MegaMenu label={t("产品导航", "Product navigation")}>
			<MegaMenuList>
				<MegaMenuItem value="products">
					<MegaMenuTrigger>{t("产品", "Products")}</MegaMenuTrigger>
					<MegaMenuContent columns={3}>
						<MegaMenuGroup title={t("构建", "Build")}>
							<MegaMenuLink href="/docs/button" description={t("一致的操作体验", "Consistent actions")}>
								{t("组件", "Components")}
							</MegaMenuLink>
							<MegaMenuLink href="/icons" description={t("自有图标集", "Our icon collection")}>
								{t("图标", "Icons")}
							</MegaMenuLink>
						</MegaMenuGroup>
						<MegaMenuGroup title={t("探索", "Explore")}>
							<MegaMenuLink href="/charts" description={t("交互式数据展示", "Interactive data visualization")}>
								{t("图表", "Charts")}
							</MegaMenuLink>
							<MegaMenuLink href="/showcase">{t("产品场景", "Showcases")}</MegaMenuLink>
						</MegaMenuGroup>
						<MegaMenuGroup title={t("开始使用", "Get started")}>
							<MegaMenuLink href="/docs/start">{t("安装指南", "Installation")}</MegaMenuLink>
							<MegaMenuLink href="/docs/theme">{t("主题定制", "Theming")}</MegaMenuLink>
						</MegaMenuGroup>
					</MegaMenuContent>
				</MegaMenuItem>
				<MegaMenuItem value="resources">
					<MegaMenuTrigger>{t("资源", "Resources")}</MegaMenuTrigger>
					<MegaMenuContent columns={2}>
						<MegaMenuGroup title={t("学习", "Learn")}>
							<MegaMenuLink href="/docs/start">{t("快速开始", "Getting started")}</MegaMenuLink>
						</MegaMenuGroup>
						<MegaMenuGroup title={t("设计", "Design")}>
							<MegaMenuLink href="/docs/theme-motion">{t("主题与动效", "Themes and motion")}</MegaMenuLink>
						</MegaMenuGroup>
					</MegaMenuContent>
				</MegaMenuItem>
			</MegaMenuList>
		</MegaMenu>
	);
}
