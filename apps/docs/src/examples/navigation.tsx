import { Navbar, NavRail, NavItem, NavLink } from "@matrixzero/ui";

export default function Example() {
	return (
		<>
			<Navbar>Matrix</Navbar>
			<NavRail label="主导航 Main">
				<NavLink href="#overview" active>
					概览 Overview
				</NavLink>
				<NavLink href="#docs">文档 Docs</NavLink>
			</NavRail>
		</>
	);
}
