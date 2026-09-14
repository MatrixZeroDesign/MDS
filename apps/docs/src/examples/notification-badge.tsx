import { Avatar, Button, IconButton, NotificationBadge } from "@matrixzero/ui";
import { Bell, Mail } from "@matrixzero/icons";

export default function Example() {
	return (
		<div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 28, padding: 8 }}>
			<NotificationBadge variant="dot" label="New activity">
				<Avatar alt="Alex Morgan" fallback="AM" />
			</NotificationBadge>

			<NotificationBadge variant="count" count={7} label="7 unread notifications">
				<IconButton label="Notifications" icon={<Bell size={18} />} />
			</NotificationBadge>

			<NotificationBadge variant="count" count={128} max={99} label="128 unread messages">
				<Button variant="secondary">
					<Mail size={16} /> Inbox
				</Button>
			</NotificationBadge>
		</div>
	);
}
