import { translatePair, type DocsLocale, translate } from "../../i18n";
import { useToast } from "@matrixzero/ui";
import { Atmosphere, Container, Button } from "@matrixzero/ui";
function Sample({
	locale = "en",
	tone = "brand",
}: {
	locale?: DocsLocale;
	tone?: "brand" | "iris" | "mint" | "peach";
}) {
	const { toast } = useToast();
	const t = (zh: string, en: string) => translate(locale, zh, en);
	return (
		<Atmosphere
			tone={tone}
			as="section"
			aria-labelledby="welcome-title"
			style={{ padding: "64px 24px 40px", textAlign: "center" }}
		>
			<Container maxWidth={560}>
				<h2 id="welcome-title">{t("让想法，自然发生。", "Make room for what’s next.")}</h2>
				<p>{t("柔和的色彩，清晰的表达。", "Soft color, clear intentions.")}</p>
				<Button
					variant="contrast"
					shape="pill"
					onClick={() => {
						toast({ title: t("示例操作已完成", "Example action completed") });
					}}
				>
					{t("探索组件", "Explore components")}
				</Button>
			</Container>
		</Atmosphere>
	);
}

export default function Example({ locale = "en" }: { locale?: DocsLocale }) {
	return (
		<div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", gap: 24 }}>
			{(
				[
					{ value: "brand", label: ["跟随主题", "Follow theme"] },
					{ value: "iris", label: ["鸢尾", "Iris"] },
					{ value: "mint", label: ["薄荷", "Mint"] },
					{ value: "peach", label: ["暖桃", "Peach"] },
				] as const
			).map((item) => (
				<div key={item.value} style={{ display: "grid", gap: 12, minWidth: 0, maxWidth: "100%", width: "100%" }}>
					<span style={{ fontSize: 12, color: "var(--mds-muted)" }}>{translatePair(locale, item.label)}</span>
					<Sample locale={locale} tone={item.value} />
				</div>
			))}
		</div>
	);
}
