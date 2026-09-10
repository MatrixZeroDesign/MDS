// Browser fixture. Not an entry in the production docs build.
import { useState } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider, ChoiceMenu, Field, Input, Select, NativeSelect, Checkbox, Button } from "@matrixzero/ui";
import "@matrixzero/ui/styles.css";
import "@matrixzero/ui/themes/mt0.css";
function Fixture() {
	const [choice, setChoice] = useState("a");
	const [submitted, setSubmitted] = useState("");
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
				<form
					onSubmit={(event) => {
						event.preventDefault();
						setSubmitted(JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))));
					}}
				>
					<Field label="Form name">
						<Input name="name" defaultValue="Original" />
					</Field>
					<Field label="Native choice">
						<NativeSelect name="scope" defaultValue="a">
							<option value="a">Alpha</option>
							<option value="b">Beta</option>
						</NativeSelect>
					</Field>
					<Field label="Styled choice" required>
						<Select
							name="styled"
							defaultValue="a"
							options={[...options, { value: "disabled", label: "Disabled", disabled: true }]}
						/>
					</Field>
					<Field label="Required choice" required>
						<Select name="required" placeholder="Choose" options={options} />
					</Field>
					<Field label="Controlled choice">
						<Select name="controlled" value={choice} onValueChange={setChoice} options={options} />
					</Field>
					<fieldset disabled>
						<Field label="Disabled choice">
							<Select name="disabled" defaultValue="a" options={options} />
						</Field>
					</fieldset>
					<Button type="submit">Submit choices</Button>
					<output aria-label="Submitted choices">{submitted}</output>
					<Checkbox defaultChecked="indeterminate" aria-label="Mixed" />
					<Button type="reset">Reset</Button>
				</form>
			</ThemeProvider>
		</>
	);
}
createRoot(document.getElementById("root")!).render(<Fixture />);
