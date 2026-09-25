import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";

export function Slot({ children, ...props }: { children?: ReactNode } & Record<string, unknown>) {
	if (!isValidElement(children)) return null;
	const child = Children.only(children) as ReactElement<any>;
	const merged = { ...props, ...child.props } as Record<string, unknown>;
	for (const key of Object.keys(props)) {
		if (!key.startsWith("on") || typeof props[key] !== "function" || typeof child.props[key] !== "function") continue;
		merged[key] = (...args: unknown[]) => {
			(child.props[key] as (...values: unknown[]) => void)(...args);
			const event = args[0] as { defaultPrevented?: boolean } | undefined;
			if (!event?.defaultPrevented) (props[key] as (...values: unknown[]) => void)(...args);
		};
	}
	if (props.className && child.props.className) merged.className = `${child.props.className} ${props.className}`;
	return cloneElement(child, merged);
}
