import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button } from "@matrixzero/ui";
export default function Example() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>工作区 Workspace</CardTitle>
				<CardDescription>应用与用量 Applications and usage</CardDescription>
			</CardHeader>
			<CardContent>3 个应用已连接。3 applications connected.</CardContent>
			<CardFooter>
				<Button
					onClick={() => {
						window.location.hash = "overview";
					}}
				>
					查看概览 View overview
				</Button>
			</CardFooter>
		</Card>
	);
}
