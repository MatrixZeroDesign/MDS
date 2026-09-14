import { Card, CardContent, Grid, Typography } from "@matrixzero/ui";

const items = [
	["Design", "12 active projects"],
	["Engineering", "8 releases this month"],
	["Research", "24 insights collected"],
];

export default function Example() {
	return (
		<Grid minColumnWidth={180} gap={16} style={{ width: "100%" }}>
			{items.map(([title, description]) => (
				<Card key={title}>
					<CardContent style={{ display: "grid", gap: 6 }}>
						<Typography as="h3" variant="title-sm">
							{title}
						</Typography>
						<Typography variant="body-sm" tone="muted">
							{description}
						</Typography>
					</CardContent>
				</Card>
			))}
		</Grid>
	);
}
