export interface PlaygroundControl {
	key: string;
	label: [string, string];
	values: string[];
	initial: string;
	boolean?: boolean;
}
const size: PlaygroundControl = { key: "size", label: ["尺寸", "Size"], values: ["sm", "md", "lg"], initial: "md" };
const shape: PlaygroundControl = {
	key: "shape",
	label: ["形状", "Shape"],
	values: ["rounded", "pill"],
	initial: "rounded",
};
const variant: PlaygroundControl = {
	key: "variant",
	label: ["样式", "Variant"],
	values: ["primary", "secondary", "ghost", "danger", "contrast"],
	initial: "primary",
};
const tone = (initial: string, values = ["neutral", "info", "success", "warning", "danger"]): PlaygroundControl => ({
	key: "tone",
	label: ["颜色", "Color"],
	values,
	initial,
});
const motion: PlaygroundControl = {
	key: "motion",
	label: ["动效", "Motion"],
	values: ["true", "false"],
	initial: "true",
	boolean: true,
};
export const playgroundControls: Record<string, PlaygroundControl[]> = {
	spinner: [size],
	"segmented-control": [size, shape],
	theme: [
		{
			key: "palette",
			label: ["配色方案", "Palette"],
			values: ["mint", "mono", "blue", "violet", "rose", "amber"],
			initial: "mint",
		},
	],
	"empty-state": [
		{ key: "media", label: ["配图", "Thumbnail"], values: ["illustration", "icon", "none"], initial: "illustration" },
		{ ...size, key: "thumbnailSize" },
	],
	toast: [tone("success")],
	button: [variant, size, shape],
	"icon-button": [{ ...variant, initial: "secondary" }, size, shape],
	avatar: [size],
	"avatar-group": [size],
	badge: [tone("success", ["neutral", "success", "warning", "danger"])],
	callout: [tone("warning")],
	banner: [tone("info")],
	alert: [tone("success", ["info", "success", "warning", "danger"])],
	atmosphere: [tone("brand", ["brand", "iris", "mint", "peach"])],
	"line-chart": [motion],
	"area-chart": [
		motion,
		{ key: "stacked", label: ["堆叠", "Stacked"], values: ["false", "true"], initial: "false", boolean: true },
	],
	"bar-chart": [
		motion,
		{ key: "stacked", label: ["堆叠", "Stacked"], values: ["false", "true"], initial: "false", boolean: true },
	],
	"donut-chart": [motion],
};
export const playgroundLabels: Record<string, [string, string]> = {
	brand: ["跟随主题", "Follow theme"],
	default: ["默认", "Default"],
	segmented: ["分段", "Segmented"],
	mono: ["黑白", "Monochrome"],
	blue: ["蓝色", "Blue"],
	violet: ["紫罗兰", "Violet"],
	rose: ["玫瑰", "Rose"],
	amber: ["琥珀", "Amber"],
	illustration: ["插画", "Illustration"],
	icon: ["图标", "Icon"],
	none: ["无配图", "None"],
	sm: ["小号", "Small"],
	md: ["中号", "Medium"],
	lg: ["大号", "Large"],
	rounded: ["圆角", "Rounded"],
	pill: ["胶囊", "Pill"],
	primary: ["主要", "Primary"],
	secondary: ["次要", "Secondary"],
	ghost: ["轻量", "Ghost"],
	danger: ["危险", "Danger"],
	contrast: ["高对比", "Contrast"],
	neutral: ["中性", "Neutral"],
	info: ["信息", "Information"],
	success: ["成功", "Success"],
	warning: ["警告", "Warning"],
	iris: ["鸢尾", "Iris"],
	mint: ["薄荷", "Mint"],
	peach: ["暖桃", "Peach"],
	true: ["开启", "On"],
	false: ["关闭", "Off"],
};
