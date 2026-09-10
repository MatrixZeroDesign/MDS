import { useState } from "react";
import { Button } from "@matrixzero/ui";

export default function Example() {
	const [count, setCount] = useState(0);
	return (
		<>
			<Button variant="primary" onClick={() => setCount(count + 1)}>
				添加 Add
			</Button>
			<p role="status">{count}</p>
		</>
	);
}
