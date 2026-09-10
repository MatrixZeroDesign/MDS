import { Callout } from "@matrixzero/ui";
export default function Example() {
	return (
		<Callout
			tone="warning"
			title="发布前检查 Review before publishing"
			action={<a href="#docs/select">阅读选择器指南 Read the Select guide</a>}
		>
			确认受影响的应用和权限。Confirm affected applications and permissions.
		</Callout>
	);
}
