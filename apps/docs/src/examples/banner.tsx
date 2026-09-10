import { useState } from "react";
import { Banner, Button } from "@matrixzero/ui";
export default function Example() {
	const [visible, setVisible] = useState(true);
	return visible ? (
		<Banner
			label="服务通知 Service notice"
			title="维护提醒 Maintenance notice"
			onDismiss={() => setVisible(false)}
			dismissLabel="关闭通知 Dismiss notice"
		>
			计划维护期间可继续查看数据。Data remains readable during maintenance.
		</Banner>
	) : (
		<Button autoFocus onClick={() => setVisible(true)}>
			重新显示 Show notice again
		</Button>
	);
}
