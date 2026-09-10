import { useState } from "react";
import { ChoiceMenu } from "@matrixzero/ui";

export default function Example() {
	const [scope, setScope] = useState("all");
	return (
		<ChoiceMenu
			label="范围 Scope"
			value={scope}
			onValueChange={setScope}
			options={[
				{ value: "all", label: "全部 All" },
				{ value: "mine", label: "我的 Mine" },
			]}
		/>
	);
}
