import { AvatarGroup } from "@matrixzero/ui";

export default function Example() {
	return (
		<AvatarGroup
			label="项目成员 Project members"
			max={3}
			size="md"
			overflowLabel={(count) => `还有 ${count} 位成员 / ${count} more members`}
			members={[
				{ name: "陈晨 Chen Chen", fallback: "陈" },
				{ name: "Alex Morgan", fallback: "AM" },
				{ name: "林雨 Lin Yu", fallback: "林" },
				{ name: "Sam Lee", fallback: "SL" },
				{ name: "Taylor Kim", fallback: "TK" },
			]}
		/>
	);
}
