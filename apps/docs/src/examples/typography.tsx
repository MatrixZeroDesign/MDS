import { Divider, Typography } from "@matrixzero/ui";

export default function Example() {
	return (
		<div style={{ display: "grid", gap: 16, width: "100%" }}>
			<Typography variant="overline" tone="muted">
				Product workspace
			</Typography>
			<Typography as="h2" variant="display">
				Clear ideas, carefully expressed.
			</Typography>
			<Typography variant="body-lg" tone="muted">
				Choose the visual style independently from the HTML element so the document outline stays correct.
			</Typography>
			<Divider decorative />
			<Typography as="code" variant="code" dir="ltr">
				npm install @matrixzero/ui
			</Typography>
			<Divider decorative />
			<div>
				<Typography as="h3" variant="title" gutter>
					Automatic title gutter
				</Typography>
				<Typography tone="muted">
					The bottom space follows the selected type size, which keeps document flow balanced without manual margins.
				</Typography>
			</div>
		</div>
	);
}
