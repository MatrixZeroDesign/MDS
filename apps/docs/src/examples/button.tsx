import { useState } from "react";
import { Button } from "@matrixzero/ui";

export default function Example({ locale = "en" }: { locale?: "zh" | "en" }) {
	const t = (zh: string, en: string) => (locale === "zh" ? zh : en);
	const [count, setCount] = useState(0);
	return (
		<>
			<Button variant="primary" onClick={() => setCount(count + 1)}>
				{t("添加", "Add")}
			</Button>
			<p role="status">{count}</p>
		</>
	);
}
