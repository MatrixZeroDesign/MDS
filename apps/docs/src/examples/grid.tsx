import { type DocsLocale, translate } from "../i18n";
import { Card, CardContent, Grid, Typography } from "@matrixzero/ui";

const items = [
	[
		["设计", "Design"],
		["12 个进行中的项目", "12 active projects"],
	],
	[
		["工程", "Engineering"],
		["本月发布 8 次", "8 releases this month"],
	],
	[
		["研究", "Research"],
		["已收集 24 条洞察", "24 insights collected"],
	],
] as const;

export default function Example({ locale = "en" }: { locale?: DocsLocale }) {
	return (
		<Grid minColumnWidth={180} gap={16} style={{ width: "100%" }}>
			{items.map(([title, description]) => (
				<Card key={title[1]}>
					<CardContent style={{ display: "grid", gap: 6 }}>
						<Typography as="h3" variant="title-sm">
							{translate(locale, title[0], title[1])}
						</Typography>
						<Typography variant="body-sm" tone="muted">
							{translate(locale, description[0], description[1])}
						</Typography>
					</CardContent>
				</Card>
			))}
		</Grid>
	);
}
