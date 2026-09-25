# Integration example

```tsx
import { Button, Field, Input, ThemeProvider } from "@matrixzero/ui";
import { ArrowRight } from "@matrixzero/icons";
import "@matrixzero/ui/styles.css";

export function AccountForm() {
	return (
		<ThemeProvider mode="system" density="comfortable">
			<form aria-label="Account settings">
				<Field label="Display name">
					<Input name="displayName" autoComplete="name" />
				</Field>
				<Button variant="primary">
					Save <ArrowRight size={16} aria-hidden="true" />
				</Button>
			</form>
		</ThemeProvider>
	);
}
```

Give an AI tool the repository folder `skills/mds`, or copy its raw GitHub URL and ask it to follow the skill while building or reviewing an MDS interface.
