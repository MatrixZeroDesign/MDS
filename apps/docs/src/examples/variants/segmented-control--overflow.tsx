import { useState } from "react";
import { SegmentedControl } from "@matrixzero/ui";
import { type DocsLocale } from "../../i18n";
import scrollLabels from "../../i18n/segmented-scroll.json";

export default function Example({ locale = "en" }: { locale?: DocsLocale }) {
	const [value, setValue] = useState("Home");
	return (
		<div style={{ maxWidth: 320, width: "100%" }}>
			<SegmentedControl
				label={scrollLabels[locale][2]}
				value={value}
				onValueChange={setValue}
				scrollLeftLabel={scrollLabels[locale][0]}
				scrollRightLabel={scrollLabels[locale][1]}
				options={["Home", "Projects", "Calendar", "Team", "Settings"].map((label, index) => ({
					value: label,
					label: scrollLabels[locale][index + 3],
				}))}
			/>
		</div>
	);
}
