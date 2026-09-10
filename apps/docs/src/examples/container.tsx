import { Container, Card, CardContent } from "@matrixzero/ui";
export default function Example() {
	return (
		<Container as="section" aria-label="内容区域 Content area" maxWidth={960} gutter={24}>
			<Card>
				<CardContent>居中且具有响应式留白的内容。Centered content with responsive gutters.</CardContent>
			</Card>
		</Container>
	);
}
