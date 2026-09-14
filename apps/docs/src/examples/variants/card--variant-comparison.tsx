import { type DocsLocale, translate } from "../../i18n";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Badge } from "@matrixzero/ui";
export default function Example({ locale = "en" }: { locale?: DocsLocale }) {
	const t = (zh: string, en: string) => translate(locale, zh, en);
	return (
		<div
			style={{
				display: "grid",
				gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
				gap: 24,
				width: "100%",
				paddingBlock: 8,
			}}
		>
			{(["outlined", "elevated", "subtle", "plain"] as const).map((variant) => (
				<div key={variant} style={{ display: "grid", gap: 12 }}>
					<span>
						{variant === "outlined"
							? t("描边", "Outlined")
							: variant === "elevated"
								? t("阴影", "Elevated")
								: variant === "subtle"
									? t("柔和背景", "Subtle")
									: t("透明无边框", "Plain")}
					</span>
					{variant === "plain" ? (
						<Card variant={variant}>
							<CardHeader>
								<CardTitle>{t("设计工作区", "Design workspace")}</CardTitle>
								<CardDescription>{t("让团队协作井然有序。", "A shared space for thoughtful work.")}</CardDescription>
							</CardHeader>
							<CardContent>
								<p>{t("3 个项目 · 12 位成员", "3 projects · 12 members")}</p>
								<Badge>{t("团队空间", "Team space")}</Badge>
							</CardContent>
						</Card>
					) : (
						<Card variant={variant}>
							<CardHeader>
								<CardTitle>{t("设计工作区", "Design workspace")}</CardTitle>
								<CardDescription>{t("让团队协作井然有序。", "A shared space for thoughtful work.")}</CardDescription>
							</CardHeader>
							<CardContent>
								<p>{t("3 个项目 · 12 位成员", "3 projects · 12 members")}</p>
								<Badge>{t("团队空间", "Team space")}</Badge>
							</CardContent>
						</Card>
					)}
				</div>
			))}
		</div>
	);
}
