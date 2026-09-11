import { useState } from "react";
import { IconButton } from "@matrixzero/ui";

export default function Example({ locale = "zh" }: { locale?: "zh" | "en" }) {
	const t = (zh: string, en: string) => (locale === "zh" ? zh : en);
	const [count, setCount] = useState(0);
	return (
		<>
			<IconButton
				label={t("添加", "Add")}
				icon={<span>+</span>}
				onClick={() => setCount(count + 1)}
				aria-describedby="add-count"
			/>
			<span id="add-count">{count}</span>
		</>
	);
}
