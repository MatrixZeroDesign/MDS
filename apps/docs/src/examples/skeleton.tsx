import { Skeleton } from "@matrixzero/ui";

export default function Example() {
	return (
		<section aria-busy="true" aria-label="加载成员 Loading members">
			<p role="status">加载中 Loading…</p>
			<Skeleton style={{ width: 180, height: 24 }} />
		</section>
	);
}
