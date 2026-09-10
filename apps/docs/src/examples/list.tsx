import { List, ListItem, Avatar, Badge } from "@matrixzero/ui";

export default function Example() {
	return (
		<List aria-label="成员 Members">
			<ListItem leading={<Avatar alt="陈晨 Chen Chen" fallback="CC" />} trailing={<Badge>成员 Member</Badge>}>
				陈晨 Chen Chen
			</ListItem>
		</List>
	);
}
