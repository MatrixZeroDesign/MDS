import { Atmosphere, Container, Button } from "@matrixzero/ui";
export default function Example() {
	return (
		<Atmosphere
			tone="iris"
			as="section"
			aria-labelledby="welcome-title"
			style={{ padding: "64px 24px 40px", textAlign: "center" }}
		>
			<Container maxWidth={560}>
				<h2 id="welcome-title">让想法，自然发生。Make room for what’s next.</h2>
				<p>柔和的色彩，清晰的表达。Soft color, clear intentions.</p>
				<Button
					variant="contrast"
					shape="pill"
					onClick={() => {
						window.location.hash = "system";
					}}
				>
					探索组件 Explore components
				</Button>
			</Container>
		</Atmosphere>
	);
}
