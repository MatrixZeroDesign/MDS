import { useState } from "react";
import { Avatar, Badge, SelectionList, SelectionListItem } from "@matrixzero/ui";

export default function Example() {
	const [value, setValue] = useState("avery");
	return (
		<SelectionList label="Choose a teammate" value={value} onValueChange={setValue} style={{ maxWidth: 420 }}>
			<SelectionListItem
				value="avery"
				leading={<Avatar alt="Avery Morgan" fallback="AM" />}
				trailing={<Badge>Owner</Badge>}
			>
				<strong>Avery Morgan</strong>
				<div className="mds-description">Product design</div>
			</SelectionListItem>
			<SelectionListItem
				value="mina"
				leading={<Avatar alt="Mina Lee" fallback="ML" />}
				trailing={<Badge>Editor</Badge>}
			>
				<strong>Mina Lee</strong>
				<div className="mds-description">Research</div>
			</SelectionListItem>
			<SelectionListItem
				value="sam"
				leading={<Avatar alt="Sam Rivera" fallback="SR" />}
				trailing={<Badge>Viewer</Badge>}
			>
				<strong>Sam Rivera</strong>
				<div className="mds-description">Engineering</div>
			</SelectionListItem>
		</SelectionList>
	);
}
