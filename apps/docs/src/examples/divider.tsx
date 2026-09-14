import { Button, Divider, Typography } from "@matrixzero/ui";

export default function Example() {
	return (
		<div style={{ display: "grid", gap: 24, width: "100%" }}>
			<section style={{ display: "grid", gap: 12 }} aria-label="Horizontal divider">
				<Typography as="h3" variant="title-sm">
					Workspace access
				</Typography>
				<Typography tone="muted">Manage the people and applications in this workspace.</Typography>
				<Divider />
				<Typography variant="body-sm">Last updated a few seconds ago</Typography>
			</section>

			<div style={{ display: "flex", alignItems: "stretch", gap: 12 }} aria-label="Vertical divider">
				<Button variant="secondary">Preview</Button>
				<Divider orientation="vertical" />
				<Button variant="primary">Publish</Button>
			</div>
		</div>
	);
}
