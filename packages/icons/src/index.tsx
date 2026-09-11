import { defineIcon } from "./runtime.js";
export type { IconProps } from "./runtime.js";
export const Plus = /* @__PURE__ */ defineIcon("Plus", <path d="M5 12h14M12 5v14" />);
export const X = /* @__PURE__ */ defineIcon("X", <path d="m6.5 6.5 11 11m0-11-11 11" />);
export const Check = /* @__PURE__ */ defineIcon("Check", <path d="m4.5 12 5 5L19.5 7" />);
export const Minus = /* @__PURE__ */ defineIcon("Minus", <path d="M5 12h14" />);
export const ChevronDown = /* @__PURE__ */ defineIcon("ChevronDown", <path d="m6 9 6 6 6-6" />);
export const ChevronRight = /* @__PURE__ */ defineIcon("ChevronRight", <path d="m9 6 6 6-6 6" />);
export const ArrowUpRight = /* @__PURE__ */ defineIcon("ArrowUpRight", <path d="M6.5 17.5 17.5 6.5M7.5 6.5h10v10" />);
export const ArrowLeft = /* @__PURE__ */ defineIcon("ArrowLeft", <path d="M19 12H5m6-6-6 6 6 6" />);
export const ArrowRight = /* @__PURE__ */ defineIcon("ArrowRight", <path d="M5 12h14m-6-6 6 6-6 6" />);
export const LoaderCircle = /* @__PURE__ */ defineIcon("LoaderCircle", <path d="M12 4a8 8 0 1 1-8 8" />);
export const Search = /* @__PURE__ */ defineIcon(
	"Search",
	<>
		<circle cx="10.5" cy="10.5" r="6.75" />
		<path d="m15.5 15.5 4.75 4.75" />
	</>,
);
export const Menu = /* @__PURE__ */ defineIcon("Menu", <path d="M4.5 6.5h15m-15 5.5h15m-15 5.5h10" />);
export const MoreHorizontal = /* @__PURE__ */ defineIcon(
	"MoreHorizontal",
	<g fill="currentColor" stroke="none">
		<circle cx="5.5" cy="12" r="1.6" />
		<circle cx="12" cy="12" r="1.6" />
		<circle cx="18.5" cy="12" r="1.6" />
	</g>,
);
export const Sun = /* @__PURE__ */ defineIcon(
	"Sun",
	<>
		<circle cx="12" cy="12" r="4" />
		<path d="M12 2.75v1.5m0 15.5v1.5M2.75 12h1.5m15.5 0h1.5M5.5 5.5l1 1m11 11 1 1m0-13-1 1m-11 11-1 1" />
	</>,
);
export const Moon = /* @__PURE__ */ defineIcon(
	"Moon",
	<path d="M10 3.75a8.5 8.5 0 1 0 10.25 10.5 7 7 0 0 1-10.25-10.5Z" />,
);
export const Blocks = /* @__PURE__ */ defineIcon(
	"Blocks",
	<>
		<rect x="3.75" y="3.75" width="7" height="7" rx="1.75" />
		<rect x="13.25" y="13.25" width="7" height="7" rx="1.75" />
		<rect x="3.75" y="13.25" width="7" height="7" rx="1.75" />
		<path d="M16.75 3.75v7m-3.5-3.5h7" />
	</>,
);
export const LayoutDashboard = /* @__PURE__ */ defineIcon(
	"LayoutDashboard",
	<>
		<rect x="3.75" y="3.75" width="6.5" height="16.5" rx="1.75" />
		<rect x="13.75" y="3.75" width="6.5" height="6.5" rx="1.75" />
		<rect x="13.75" y="13.75" width="6.5" height="6.5" rx="1.75" />
	</>,
);
export const SlidersHorizontal = /* @__PURE__ */ defineIcon(
	"SlidersHorizontal",
	<>
		<path d="M4 7.5h3m5 0h8M4 16.5h8m5 0h3" />
		<rect x="7" y="5" width="5" height="5" rx="1.5" />
		<rect x="12" y="14" width="5" height="5" rx="1.5" />
	</>,
);
const panel = (
	<>
		<rect x="3.5" y="4.5" width="17" height="15" rx="2.5" />
		<path d="M9 4.5v15" />
	</>
);
export const PanelLeftClose = /* @__PURE__ */ defineIcon(
	"PanelLeftClose",
	<>
		{panel}
		<path d="m16.5 9-3 3 3 3" />
	</>,
);
export const PanelLeftOpen = /* @__PURE__ */ defineIcon(
	"PanelLeftOpen",
	<>
		{panel}
		<path d="m13.5 9 3 3-3 3" />
	</>,
);
export const Inbox = /* @__PURE__ */ defineIcon(
	"Inbox",
	<>
		<path d="m4 12 2.25-6.25A2 2 0 0 1 8.1 4.5h7.8a2 2 0 0 1 1.85 1.25L20 12v5a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17v-5Z" />
		<path d="M4 12h4.5v1a3.5 3.5 0 0 0 7 0v-1H20" />
	</>,
);
export const ShieldCheck = /* @__PURE__ */ defineIcon(
	"ShieldCheck",
	<>
		<path d="M12 3.25 19.5 6v6c0 4.25-3.25 7-7.5 8.75C7.75 19 4.5 16.25 4.5 12V6L12 3.25Z" />
		<path d="m8.5 11.75 2.5 2.5 4.5-4.5" />
	</>,
);
export const Copy = /* @__PURE__ */ defineIcon(
	"Copy",
	<>
		<rect x="8" y="8" width="12" height="12" rx="2.5" />
		<path d="M15.5 5.5v-.25A1.75 1.75 0 0 0 13.75 3.5h-8.5A1.75 1.75 0 0 0 3.5 5.25v8.5a1.75 1.75 0 0 0 1.75 1.75h.25" />
	</>,
);
const tray = <path d="M4.5 15.5V18A2 2 0 0 0 6.5 20h11a2 2 0 0 0 2-2v-2.5" />;
export const Download = /* @__PURE__ */ defineIcon(
	"Download",
	<>
		{tray}
		<path d="M12 3.5v11m-4-4 4 4 4-4" />
	</>,
);
export const Upload = /* @__PURE__ */ defineIcon(
	"Upload",
	<>
		{tray}
		<path d="M12 14.5v-11m-4 4 4-4 4 4" />
	</>,
);
export const Trash = /* @__PURE__ */ defineIcon(
	"Trash",
	<>
		<path d="M4 6.5h16M8.5 6.5V5a1.5 1.5 0 0 1 1.5-1.5h4A1.5 1.5 0 0 1 15.5 5v1.5m-10 0 .75 12a2 2 0 0 0 2 2h7.5a2 2 0 0 0 2-2l.75-12M10 10.5v6m4-6v6" />
	</>,
);
export const Settings = /* @__PURE__ */ defineIcon(
	"Settings",
	<>
		<path d="m9.5 3.5 5 0 .75 2.25 2.25 1 2.25-.5 2 4.25L20 12l1.75 1.5-2 4.25-2.25-.5-2.25 1-.75 2.25h-5l-.75-2.25-2.25-1-2.25.5-2-4.25L4 12l-1.75-1.5 2-4.25 2.25.5 2.25-1 .75-2.25Z" />
		<circle cx="12" cy="12" r="3" />
	</>,
);
const ring = <circle cx="12" cy="12" r="8.25" />;
export const Info = /* @__PURE__ */ defineIcon(
	"Info",
	<>
		{ring}
		<path d="M11 11h1v5h1" />
		<circle cx="12" cy="7.5" r=".85" fill="currentColor" stroke="none" />
	</>,
);
export const AlertCircle = /* @__PURE__ */ defineIcon(
	"AlertCircle",
	<>
		{ring}
		<path d="M12 7.5v5.75" />
		<circle cx="12" cy="16.5" r=".85" fill="currentColor" stroke="none" />
	</>,
);
export const User = /* @__PURE__ */ defineIcon(
	"User",
	<>
		<circle cx="12" cy="7.5" r="3.75" />
		<path d="M4.5 20v-1.25A5.25 5.25 0 0 1 9.75 13.5h4.5a5.25 5.25 0 0 1 5.25 5.25V20" />
	</>,
);
export const Bell = /* @__PURE__ */ defineIcon(
	"Bell",
	<>
		<path d="M6.5 9a5.5 5.5 0 0 1 11 0v3.5l2 3v1h-15v-1l2-3V9Zm3 11h5" />
	</>,
	() => (
		<path
			fill="currentColor"
			stroke="none"
			d="M12 2.6A6.4 6.4 0 0 0 5.6 9v3.2l-1.9 2.9a.9.9 0 0 0-.2.5v.9c0 .5.4.9.9.9h15.2c.5 0 .9-.4.9-.9v-.9a.9.9 0 0 0-.2-.5l-1.9-2.9V9A6.4 6.4 0 0 0 12 2.6ZM9.5 19a2.5 2.5 0 0 0 5 0Z"
		/>
	),
);
export const ExternalLink = /* @__PURE__ */ defineIcon(
	"ExternalLink",
	<>
		<path d="M10 4.5H6.5a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V14M13.5 4.5h6v6m0-6-9 9" />
	</>,
);

export * from "./interface.js";
export * from "./content.js";
export * from "./systems.js";

export * from "./social.js";
