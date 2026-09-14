import { Button, Card, CardContent, ToastProvider, Toaster, Typography, useToast } from "@matrixzero/ui";

function UpdateRegion() {
	const { toast } = useToast();
	return (
		<Card variant="subtle" style={{ width: "min(100%, 440px)" }}>
			<CardContent style={{ display: "grid", gap: 16 }}>
				<Typography as="h3" variant="title-sm">
					Application updates
				</Typography>
				<Button
					variant="secondary"
					onClick={() =>
						toast({
							title: "Ready to update",
							description: "Version 2.4 can be installed now.",
							action: { label: "Update now", altText: "Install version 2.4", onClick: () => undefined },
							duration: Infinity,
						})
					}
				>
					Check for updates
				</Button>
				<Toaster placement="inline" />
			</CardContent>
		</Card>
	);
}

export default function Example() {
	return (
		<ToastProvider>
			<UpdateRegion />
		</ToastProvider>
	);
}
