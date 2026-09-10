import { Steps } from "@matrixzero/ui";

export default function Example() {
	return (
		<Steps
			label="创建流程 Creation flow"
			current={1}
			steps={[
				{ id: "details", label: "填写 Details" },
				{ id: "review", label: "确认 Review" },
				{ id: "done", label: "完成 Done" },
			]}
		/>
	);
}
