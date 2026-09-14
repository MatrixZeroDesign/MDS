import { Card, CardContent, Typography } from "@matrixzero/ui";

export default function Example() {
	return (
		<div style={{ display: "grid", gap: 20, width: "100%" }}>
			<Card variant="subtle">
				<CardContent style={{ display: "grid", gap: 8 }}>
					<Typography as="h2" variant="title">
						A semantic heading with a section-title style
					</Typography>
					<Typography as="p" variant="title-sm">
						A paragraph can use a stronger visual style without changing the document outline.
					</Typography>
					<Typography as="span" variant="body-sm" tone="muted">
						Supporting metadata · 3 minutes ago
					</Typography>
				</CardContent>
			</Card>

			<div style={{ maxWidth: 360 }}>
				<Typography variant="body" truncate title="This long line is intentionally truncated inside a narrow region">
					This long line is intentionally truncated inside a narrow region
				</Typography>
			</div>
		</div>
	);
}
