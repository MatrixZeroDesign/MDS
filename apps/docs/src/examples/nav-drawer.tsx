import { NavDrawer, NavDrawerTrigger, NavDrawerContent, NavDrawerClose, NavLink, Button } from "@matrixzero/ui";

export default function Example() {
	return (
		<NavDrawer>
			<NavDrawerTrigger asChild>
				<Button>菜单 Menu</Button>
			</NavDrawerTrigger>
			<NavDrawerContent title="导航 Navigation" navigationLabel="移动主导航 Mobile main" closeLabel="关闭 Close">
				<NavDrawerClose asChild>
					<NavLink href="#docs">文档 Docs</NavLink>
				</NavDrawerClose>
			</NavDrawerContent>
		</NavDrawer>
	);
}
