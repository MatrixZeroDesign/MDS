import { useState } from "react";
import { IconButton } from "@matrixzero/ui";

export default function Example() {
	const [count, setCount] = useState(0);
	return (
		<>
			<IconButton
				label="添加 Add"
				icon={<span>+</span>}
				onClick={() => setCount(count + 1)}
				aria-describedby="add-count"
			/>
			<span id="add-count">{count}</span>
		</>
	);
}
