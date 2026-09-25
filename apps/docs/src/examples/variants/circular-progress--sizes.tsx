import { CircularProgress } from "@matrixzero/ui";

export default function Example() {
	return (
		<div style={{ display: "flex", alignItems: "center", gap: 24 }}>
			{(["xs", "sm", "md", "lg"] as const).map((size) => (
				<CircularProgress key={size} size={size} value={64} aria-label={`${size} progress`} />
			))}
		</div>
	);
}
