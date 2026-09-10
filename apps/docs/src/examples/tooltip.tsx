import { TooltipProvider, Tooltip, Button } from "@matrixzero/ui";

export default function Example() {
	return (
		<TooltipProvider>
			<Tooltip content="保存在当前设备 / Stored on this device">
				<Button>本地保存 Local save</Button>
			</Tooltip>
		</TooltipProvider>
	);
}
