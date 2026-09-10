// Browser fixture. Not an entry in the production docs build.
import { useState } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider, ChoiceMenu, Field, Input, Select, Checkbox, Button } from "@matrixzero/ui";
import "@matrixzero/ui/styles.css";
import "@matrixzero/ui/themes/mt0.css";
function Fixture() {
	const [a, setA] = useState("a"),
		[b, setB] = useState("a");
	const options = [
		{ value: "a", label: "Alpha" },
		{ value: "b", label: "Beta" },
	];
	return (
		<>
			<p id="host">Host text</p>
			<ThemeProvider brand="mt0" mode="dark" data-testid="dark-root">
				<ChoiceMenu label="Dark choice" value={a} onValueChange={setA} options={options} />
			</ThemeProvider>
			<ThemeProvider
				brand="test-only"
				mode="light"
				style={{ "--mds-text": "#3a3024", "--mds-surface": "#fffaf3" }}
				data-testid="custom-root"
			>
				<ChoiceMenu label="Custom choice" value={b} onValueChange={setB} options={options} />
				<form>
					<Field label="Form name">
						<Input name="name" defaultValue="Original" />
					</Field>
					<Field label="Native choice">
						<Select name="scope" defaultValue="a">
							<option value="a">Alpha</option>
							<option value="b">Beta</option>
						</Select>
					</Field>
					<Checkbox defaultChecked="indeterminate" aria-label="Mixed" />
					<Button type="reset">Reset</Button>
				</form>
			</ThemeProvider>
		</>
	);
}
createRoot(document.getElementById("root")!).render(<Fixture />);
