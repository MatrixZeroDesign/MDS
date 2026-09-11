import { DirectionProvider, useDirection } from "@radix-ui/react-direction";
import { createContext, useContext, useState } from "react";
import type { ComponentProps, CSSProperties } from "react";
export type ThemeMode = "light" | "dark" | "system";
export type ThemeStyle = CSSProperties & { [token: `--mds-${string}`]: string | number };
const PortalContext = createContext<HTMLElement | null>(null);
export function usePortalContainer() {
	return useContext(PortalContext);
}
export interface ThemeProviderProps extends Omit<ComponentProps<"div">, "style" | "dir"> {
	dir?: "ltr" | "rtl";
	brand?: string;
	mode?: ThemeMode;
	density?: "comfortable" | "compact";
	style?: ThemeStyle;
}
/** Brand names select an explicitly imported theme. No runtime fetch or brand fallback. */
export function ThemeProvider({
	dir,
	brand = "neutral",
	mode = "system",
	density = "comfortable",
	className = "",
	children,
	...props
}: ThemeProviderProps) {
	const direction = useDirection(dir);
	const [container, setContainer] = useState<HTMLDivElement | null>(null);
	return (
		<DirectionProvider dir={direction}>
			<div
				{...props}
				dir={direction}
				className={`mds-root ${className}`}
				data-mds-brand={brand}
				data-mds-mode={mode}
				data-mds-density={density}
			>
				<PortalContext.Provider value={container}>
					{children}
					<div ref={setContainer} className="mds-portals" />
				</PortalContext.Provider>
			</div>
		</DirectionProvider>
	);
}
