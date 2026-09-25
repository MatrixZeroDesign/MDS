import { createContext, useContext, type ReactNode } from "react";

export type Direction = "ltr" | "rtl";

const DirectionContext = createContext<Direction>("ltr");

export function DirectionProvider({ dir, children }: { dir: Direction; children: ReactNode }) {
	return <DirectionContext.Provider value={dir}>{children}</DirectionContext.Provider>;
}

export function useDirection(localDir?: Direction): Direction {
	const inherited = useContext(DirectionContext);
	return localDir ?? inherited;
}
