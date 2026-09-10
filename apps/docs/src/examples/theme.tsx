import { ThemeProvider } from "@matrixzero/ui";

export default function Example() {
	return (
		<ThemeProvider brand="mt0" mode="system">
			<p>你好，Matrix. Hello, Matrix.</p>
		</ThemeProvider>
	);
}
