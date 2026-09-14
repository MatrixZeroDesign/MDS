import { Divider, Typography } from "@matrixzero/ui";

const styles = [
	["display", "Build calmer products"],
	["title-lg", "Large section title"],
	["title", "Section title"],
	["title-sm", "Compact card title"],
	["body-lg", "Lead body text for a short introduction."],
	["body", "Default body text for most interface content."],
	["body-sm", "Supporting body text for compact surfaces."],
	["label", "Form and control label"],
	["caption", "Updated 3 minutes ago"],
	["overline", "Workspace overview"],
	["code", "const ready = true;"],
] as const;

export default function Example() {
	return (
		<div style={{ display: "grid", gap: 0, width: "100%" }}>
			{styles.map(([variant, sample], index) => (
				<div key={variant}>
					<div
						style={{
							display: "grid",
							gridTemplateColumns: "minmax(88px, 0.28fr) minmax(0, 1fr)",
							alignItems: "baseline",
							gap: 20,
							paddingBlock: 14,
						}}
					>
						<Typography variant="caption" tone="muted">
							{variant}
						</Typography>
						<Typography variant={variant}>{sample}</Typography>
					</div>
					{index < styles.length - 1 && <Divider decorative />}
				</div>
			))}
		</div>
	);
}
