import { defineIcon } from "./runtime.js";

/** Original MDS drawings on the shared 24-unit grid. */
export const Terminal = /* @__PURE__ */ defineIcon(
	"Terminal",
	<>
		<rect x="3.5" y="4.5" width="17" height="15" rx="2" />
		<path d="m7 9 3 3-3 3m6 0h4" />
	</>,
);
export const Cpu = /* @__PURE__ */ defineIcon(
	"Cpu",
	<>
		<rect x="6" y="6" width="12" height="12" rx="2" />
		<rect x="9" y="9" width="6" height="6" rx="1" />
		<path d="M9 3v3m6-3v3M9 18v3m6-3v3M3 9h3m-3 6h3m12-6h3m-3 6h3" />
	</>,
);
export const Server = /* @__PURE__ */ defineIcon(
	"Server",
	<>
		<rect x="3.5" y="4" width="17" height="6" rx="2" />
		<rect x="3.5" y="14" width="17" height="6" rx="2" />
		<path d="M7 7h.01M7 17h.01M15 7h2m-2 10h2" />
	</>,
);
export const Database = /* @__PURE__ */ defineIcon(
	"Database",
	<>
		<ellipse cx="12" cy="6" rx="8" ry="3" />
		<path d="M4 6v12c0 4 16 4 16 0V6M4 12c0 4 16 4 16 0" />
	</>,
);
export const Cloud = /* @__PURE__ */ defineIcon(
	"Cloud",
	<>
		<path d="M7.5 18.5h10a4 4 0 0 0 .75-7.93A6.5 6.5 0 0 0 5.6 8.75a5 5 0 0 0 1.9 9.75Z" />
	</>,
);
export const Network = /* @__PURE__ */ defineIcon(
	"Network",
	<>
		<rect x="9" y="3.5" width="6" height="5" rx="1.5" />
		<rect x="3.5" y="15.5" width="6" height="5" rx="1.5" />
		<rect x="14.5" y="15.5" width="6" height="5" rx="1.5" />
		<path d="M12 8.5v3.5m-5.5 3.5V12h11v3.5" />
	</>,
);
export const Wifi = /* @__PURE__ */ defineIcon(
	"Wifi",
	<>
		<path d="M3.5 8a13 13 0 0 1 17 0M6.5 11.5a8.5 8.5 0 0 1 11 0M9.5 15a4 4 0 0 1 5 0" />
		<circle cx="12" cy="18.5" r="0.8" />
	</>,
);
export const Ethernet = /* @__PURE__ */ defineIcon(
	"Ethernet",
	<>
		<path d="M4 5h16v12h-4v3H8v-3H4V5ZM8 5v5m4-5v5m4-5v5" />
	</>,
);
export const HardDrive = /* @__PURE__ */ defineIcon(
	"HardDrive",
	<>
		<path d="m4 14 2-8h12l2 8" />
		<rect x="3.5" y="14" width="17" height="6" rx="2" />
		<path d="M7 17h.01m8 0h2" />
	</>,
);
export const MemoryStick = /* @__PURE__ */ defineIcon(
	"MemoryStick",
	<>
		<path d="M4 6h16v10H4V6Zm2 10v4m4-4v4m4-4v4m4-4v4" />
		<rect x="7" y="9" width="3" height="4" rx="0.5" />
		<rect x="14" y="9" width="3" height="4" rx="0.5" />
	</>,
);
export const Monitor = /* @__PURE__ */ defineIcon(
	"Monitor",
	<>
		<rect x="3.5" y="3.5" width="17" height="12.5" rx="2" />
		<path d="M12 16v4.5m-4 0h8" />
	</>,
);
export const Laptop = /* @__PURE__ */ defineIcon(
	"Laptop",
	<>
		<path d="M5 16V5h14v11M3 16h18l-1 4H4l-1-4Zm7 0h4" />
	</>,
);
export const Smartphone = /* @__PURE__ */ defineIcon(
	"Smartphone",
	<>
		<rect x="6.5" y="3" width="11" height="18" rx="2.5" />
		<path d="M10 6h4m-3 12h2" />
	</>,
);
export const Tablet = /* @__PURE__ */ defineIcon(
	"Tablet",
	<>
		<rect x="4.5" y="3" width="15" height="18" rx="2.5" />
		<path d="M11 18h2" />
	</>,
);
export const Plug = /* @__PURE__ */ defineIcon(
	"Plug",
	<>
		<path d="M8 3.5V8m8-4.5V8M6 8h12v4a6 6 0 0 1-12 0V8Zm6 10v3" />
	</>,
);
export const Power = /* @__PURE__ */ defineIcon(
	"Power",
	<>
		<path d="M12 3v8M7 5.5a8.5 8.5 0 1 0 10 0" />
	</>,
);
export const Battery = /* @__PURE__ */ defineIcon(
	"Battery",
	<>
		<rect x="3.5" y="7" width="15" height="10" rx="2" />
		<path d="M21 10v4M7 10v4m4-4v4" />
	</>,
);
export const Bug = /* @__PURE__ */ defineIcon(
	"Bug",
	<>
		<rect x="8" y="7" width="8" height="13" rx="4" />
		<path d="M9 7 7 4m8 3 2-3M8 11H4m12 0h4M8 15H3.5m12.5 0h4.5M8.5 18 5 21m10.5-3 3.5 3M12 10v10" />
	</>,
);
export const GitBranch = /* @__PURE__ */ defineIcon(
	"GitBranch",
	<>
		<circle cx="6" cy="5" r="2" />
		<circle cx="18" cy="5" r="2" />
		<circle cx="6" cy="19" r="2" />
		<path d="M6 7v10m0-3c0-6 12 0 12-7" />
	</>,
);
export const GitMerge = /* @__PURE__ */ defineIcon(
	"GitMerge",
	<>
		<circle cx="6" cy="5" r="2" />
		<circle cx="6" cy="19" r="2" />
		<circle cx="18" cy="19" r="2" />
		<path d="M6 7v10m0-7c0 6 12 1 12 7" />
	</>,
);
export const Webhook = /* @__PURE__ */ defineIcon(
	"Webhook",
	<>
		<path d="M12 5.5 8.12 12.22a3.5 3.5 0 1 0 1.75 3.03" />
		<path d="M12 5.5 8.12 12.22a3.5 3.5 0 1 0 1.75 3.03" transform="rotate(120 12 12)" />
		<path d="M12 5.5 8.12 12.22a3.5 3.5 0 1 0 1.75 3.03" transform="rotate(240 12 12)" />
	</>,
);
export const Container = /* @__PURE__ */ defineIcon(
	"Container",
	<>
		<path d="m4 7 8-4 8 4v10l-8 4-8-4V7Zm0 0 8 4 8-4m-8 4v10M8 5l8 4" />
	</>,
);
export const Workflow = /* @__PURE__ */ defineIcon(
	"Workflow",
	<>
		<rect x="3.5" y="3.5" width="6" height="6" rx="1.5" />
		<rect x="14.5" y="14.5" width="6" height="6" rx="1.5" />
		<path d="M9.5 6.5H17v8m-3-3 3 3 3-3M6.5 9.5v8h4" />
	</>,
);
export const Binary = /* @__PURE__ */ defineIcon(
	"Binary",
	<>
		<rect x="4" y="4" width="5" height="7" rx="2.5" />
		<rect x="15" y="13" width="5" height="7" rx="2.5" />
		<path d="M15 5l2-1v7m-2 0h4M4 14l2-1v7m-2 0h4" />
	</>,
);
export const Lock = /* @__PURE__ */ defineIcon(
	"Lock",
	<>
		<rect x="5" y="10" width="14" height="10" rx="2" />
		<path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v2" />
	</>,
);
export const Unlock = /* @__PURE__ */ defineIcon(
	"Unlock",
	<>
		<rect x="5" y="10" width="14" height="10" rx="2" />
		<path d="M8 10V7a4 4 0 0 1 7.5-2M12 14v2" />
	</>,
);
export const Key = /* @__PURE__ */ defineIcon(
	"Key",
	<>
		<circle cx="8" cy="8" r="4.5" />
		<path d="m11.5 11.5 9 9m-4-4 2.5-2.5m-5.5-.5 2.5-2.5" />
	</>,
);
export const Fingerprint = /* @__PURE__ */ defineIcon(
	"Fingerprint",
	<>
		<path d="M4 10a8 8 0 0 1 16 0v3M7 18c1-2 0-4 0-7a5 5 0 0 1 10 0v4c0 2-.5 4-1 6M10 20c1-3 0-6 0-9a2 2 0 0 1 4 0c0 4 1 6-1 10M4 14v2" />
	</>,
);
export const Shield = /* @__PURE__ */ defineIcon(
	"Shield",
	<>
		<path d="m12 3.5 7.5 3V12c0 4-3.5 7-7.5 8.5C8 19 4.5 16 4.5 12V6.5l7.5-3Z" />
	</>,
);
export const ScanFace = /* @__PURE__ */ defineIcon(
	"ScanFace",
	<>
		<path d="M8 3.5H5a1.5 1.5 0 0 0-1.5 1.5v3M16 3.5h3A1.5 1.5 0 0 1 20.5 5v3M3.5 16v3A1.5 1.5 0 0 0 5 20.5h3m8 0h3a1.5 1.5 0 0 0 1.5-1.5v-3M8 8v1m8-1v1m-4 0v4h-1m-3 3c2 2 6 2 8 0" />
	</>,
);
export const Eye = /* @__PURE__ */ defineIcon(
	"Eye",
	<>
		<path d="M3 12c4-9 14-9 18 0-4 9-14 9-18 0Z" />
		<circle cx="12" cy="12" r="3" />
	</>,
);
export const EyeOff = /* @__PURE__ */ defineIcon(
	"EyeOff",
	<>
		<path d="M3.5 3.5 20.5 20.5M9 5.8C14 4 18.5 7 21 12a15 15 0 0 1-3 4M6.5 6.5A17 17 0 0 0 3 12c3.5 7 10 8 14 5m-8-8a4.2 4.2 0 0 0 6 6" />
	</>,
);
export const Users = /* @__PURE__ */ defineIcon(
	"Users",
	<>
		<circle cx="9" cy="7" r="3.5" />
		<path d="M3.5 20v-2A4.5 4.5 0 0 1 8 13.5h2a4.5 4.5 0 0 1 4.5 4.5v2M16 4a3.5 3.5 0 0 1 0 7m1 3a4 4 0 0 1 3.5 4v2" />
	</>,
);
export const UserRound = /* @__PURE__ */ defineIcon(
	"UserRound",
	<>
		<circle cx="12" cy="12" r="8.5" />
		<circle cx="12" cy="9" r="2.5" />
		<path d="M6 18a6 6 0 0 1 12 0" />
	</>,
);
export const IdCard = /* @__PURE__ */ defineIcon(
	"IdCard",
	<>
		<rect x="3.5" y="5.5" width="17" height="13" rx="2" />
		<circle cx="8.5" cy="10" r="2" />
		<path d="M5.5 16a3 3 0 0 1 6 0M14 9h3m-3 4h3" />
	</>,
);
export const BadgeCheck = /* @__PURE__ */ defineIcon(
	"BadgeCheck",
	<>
		<path d="m12 3 3 2 3.5.5.5 3.5 2 3-2 3-.5 3.5-3.5.5-3 2-3-2-3.5-.5L5 15l-2-3 2-3 .5-3.5L9 5l3-2Zm-4 9 2.5 2.5 5-5" />
	</>,
	() => (
		<path
			fill="currentColor"
			stroke="none"
			fillRule="evenodd"
			d="M12 2.1 15.35 4.3l3.95.6.6 3.95L22.1 12l-2.2 3.15-.6 3.95-3.95.6L12 21.9l-3.35-2.2-3.95-.6-.6-3.95L1.9 12l2.2-3.15.6-3.95 3.95-.6L12 2.1Zm-4.7 9.2 1.4-1.3 1.9 2 4.7-4.6 1.4 1.4-6.1 6.1-3.3-3.6Z"
		/>
	),
);
export const KeyRound = /* @__PURE__ */ defineIcon(
	"KeyRound",
	<>
		<circle cx="8" cy="8" r="4.5" />
		<path d="m11.5 11.5 8 8v1h-4v-3h-3v-3l-1-1" />
		<circle cx="7.5" cy="7.5" r="0.5" />
	</>,
);
export const Siren = /* @__PURE__ */ defineIcon(
	"Siren",
	<>
		<path d="M6 16V11a6 6 0 0 1 12 0v5M4 16h16v4H4v-4ZM12 2v1M3.5 5.5 5 7m14-1.5L17.5 7" />
	</>,
);
export const Vault = /* @__PURE__ */ defineIcon(
	"Vault",
	<>
		<rect x="3.5" y="3.5" width="17" height="17" rx="2" />
		<circle cx="12" cy="12" r="4" />
		<path d="M12 8v2m0 4v2m-4-4h2m4 0h2M20.5 7h1m-1 10h1" />
	</>,
);
export const Fence = /* @__PURE__ */ defineIcon(
	"Fence",
	<>
		<path d="m4 6 2-2 2 2v14H4V6Zm6 0 2-2 2 2v14h-4V6Zm6 0 2-2 2 2v14h-4V6ZM3 10h18M3 16h18" />
	</>,
);
export const ChartLine = /* @__PURE__ */ defineIcon(
	"ChartLine",
	<>
		<path d="M4 4v16h16M7 15l4-6 4 3 5-7" />
	</>,
);
export const ChartArea = /* @__PURE__ */ defineIcon(
	"ChartArea",
	<>
		<path d="M4 4v16h16M7 17v-5l4-5 4 4 5-5v11H7Z" />
	</>,
);
export const ChartBar = /* @__PURE__ */ defineIcon(
	"ChartBar",
	<>
		<path d="M4 4v16h16" />
		<rect x="7" y="11" width="3" height="6" rx="0.5" />
		<rect x="13" y="6" width="3" height="11" rx="0.5" />
		<path d="M19 9v8" />
	</>,
);
export const ChartPie = /* @__PURE__ */ defineIcon(
	"ChartPie",
	<>
		<path d="M10.5 4a8.3 8.3 0 1 0 9.5 9.5h-9.5V4Zm3 0v6.5H20A8 8 0 0 0 13.5 4Z" />
	</>,
);
export const ChartDonut = /* @__PURE__ */ defineIcon(
	"ChartDonut",
	<>
		<path d="M12 3.5a8.5 8.5 0 1 0 8.5 8.5H16a4 4 0 1 1-4-4V3.5Zm3 .5v5h5a8 8 0 0 0-5-5Z" />
	</>,
);
export const ChartScatter = /* @__PURE__ */ defineIcon(
	"ChartScatter",
	<>
		<path d="M4 4v16h16" />
		<circle cx="8" cy="13" r="1" />
		<circle cx="12" cy="8" r="1" />
		<circle cx="15" cy="14" r="1" />
		<circle cx="19" cy="5" r="1" />
	</>,
);
export const ChartCandlestick = /* @__PURE__ */ defineIcon(
	"ChartCandlestick",
	<>
		<path d="M4 4v16h16M9 4v3m0 6v4m7-10v3m0 5v3" />
		<rect x="7" y="7" width="4" height="6" rx="0.5" />
		<rect x="14" y="10" width="4" height="5" rx="0.5" />
	</>,
);
export const ChartRadar = /* @__PURE__ */ defineIcon(
	"ChartRadar",
	<>
		<path d="m12 3 8.5 6-3 11h-11l-3-11L12 3Zm0 0v9m8.5-3L12 12m5.5 8L12 12m-5.5 8L12 12M3.5 9l8.5 3m0-6 5.5 4-2 6.5h-6l-3-6 5.5-4.5Z" />
	</>,
);
export const ChartFunnel = /* @__PURE__ */ defineIcon(
	"ChartFunnel",
	<>
		<path d="M3.5 4h17l-3 5h-11l-3-5Zm4 8h9l-2.5 4h-4l-2.5-4Zm3.5 7h2v2h-2v-2Z" />
	</>,
);
export const Gauge = /* @__PURE__ */ defineIcon(
	"Gauge",
	<>
		<path d="M5 19a9 9 0 1 1 14 0M5 19h14M12 14l5-7M6 12H5m14 0h-1M12 4v1" />
		<circle cx="12" cy="14" r="1.5" />
	</>,
);
export const Activity = /* @__PURE__ */ defineIcon(
	"Activity",
	<>
		<path d="M3 12h4l3-8 4 16 3-8h4" />
	</>,
);
export const TrendingUp = /* @__PURE__ */ defineIcon(
	"TrendingUp",
	<>
		<path d="m3.5 17 6-6 4 4 7-10m-6 0h6v6" />
	</>,
);
export const TrendingDown = /* @__PURE__ */ defineIcon(
	"TrendingDown",
	<>
		<path d="m3.5 7 6 6 4-4 7 10m-6 0h6v-6" />
	</>,
);
export const Sigma = /* @__PURE__ */ defineIcon(
	"Sigma",
	<>
		<path d="M19 4H5l7 8-7 8h14" />
	</>,
);
export const Percent = /* @__PURE__ */ defineIcon(
	"Percent",
	<>
		<path d="m5 19 14-14" />
		<circle cx="7" cy="7" r="3" />
		<circle cx="17" cy="17" r="3" />
	</>,
);
export const Calculator = /* @__PURE__ */ defineIcon(
	"Calculator",
	<>
		<rect x="5" y="3.5" width="14" height="17" rx="2" />
		<rect x="8" y="6.5" width="8" height="4" rx="1" />
		<path d="M8 14h1m6 0h1m-8 3h1m6 0h1" />
	</>,
);
export const Variable = /* @__PURE__ */ defineIcon(
	"Variable",
	<>
		<path d="M5 5C2 9 2 15 5 19M19 5c3 4 3 10 0 14M8 8c3-1 4 9 8 8M16 8l-8 8" />
	</>,
);
export const Filter = /* @__PURE__ */ defineIcon(
	"Filter",
	<>
		<path d="M3.5 4.5h17L14 12v7l-4 1v-8L3.5 4.5Z" />
	</>,
);
export const Target = /* @__PURE__ */ defineIcon(
	"Target",
	<>
		<circle cx="12" cy="12" r="8.5" />
		<circle cx="12" cy="12" r="4.5" />
		<circle cx="12" cy="12" r="0.75" />
	</>,
);
export const Waypoints = /* @__PURE__ */ defineIcon(
	"Waypoints",
	<>
		<circle cx="5" cy="6" r="2" />
		<circle cx="18" cy="5" r="2" />
		<circle cx="12" cy="18" r="2" />
		<path d="m7 6 9-1M6 8l5 8m6-9-4 9" />
	</>,
);
export const Briefcase = /* @__PURE__ */ defineIcon(
	"Briefcase",
	<>
		<rect x="3.5" y="7" width="17" height="13" rx="2" />
		<path d="M8 7V4h8v3M3.5 12c5 3 12 3 17 0M12 12v4" />
	</>,
);
export const Building = /* @__PURE__ */ defineIcon(
	"Building",
	<>
		<path d="M5 20V4h14v16M3 20h18M9 7h1m4 0h1m-6 4h1m4 0h1m-6 4h1m4 0h1M11 20v-3h2v3" />
	</>,
);
export const Store = /* @__PURE__ */ defineIcon(
	"Store",
	<>
		<path d="M4 10v10h16V10M5 4h14l2 6c0 3-4 3-4 0 0 3-5 3-5 0 0 3-5 3-5 0 0 3-4 3-4 0l2-6ZM9 20v-6h6v6" />
	</>,
);
export const ShoppingCart = /* @__PURE__ */ defineIcon(
	"ShoppingCart",
	<>
		<path d="M3 4h2l3 12h10l3-9H6" />
		<circle cx="9" cy="20" r="1" />
		<circle cx="18" cy="20" r="1" />
	</>,
);
export const ShoppingBag = /* @__PURE__ */ defineIcon(
	"ShoppingBag",
	<>
		<path d="M5 8h14l1 12H4L5 8ZM8 9V7a4 4 0 0 1 8 0v2" />
	</>,
);
export const CreditCard = /* @__PURE__ */ defineIcon(
	"CreditCard",
	<>
		<rect x="3.5" y="5" width="17" height="14" rx="2" />
		<path d="M3.5 10h17M7 15h3" />
	</>,
);
export const Wallet = /* @__PURE__ */ defineIcon(
	"Wallet",
	<>
		<path d="M19 8V4H7a3 3 0 0 0 0 6h13v10H7a3 3 0 0 1-3-3V7M20 13h-5v4h5" />
	</>,
);
export const Banknote = /* @__PURE__ */ defineIcon(
	"Banknote",
	<>
		<rect x="3.5" y="6" width="17" height="12" rx="2" />
		<circle cx="12" cy="12" r="3" />
		<path d="M6 9h.01M18 15h.01" />
	</>,
);
export const Coins = /* @__PURE__ */ defineIcon(
	"Coins",
	<>
		<ellipse cx="10" cy="6" rx="6" ry="2.5" />
		<path d="M4 6v4c0 3.3 12 3.3 12 0V6M4 10v4c0 2 4 3 7 2.5M16 10c5 0 6 4 2 5-2 .7-4 .7-6 0m0-2v5c0 3 8 3 8 0v-5" />
	</>,
);
export const Receipt = /* @__PURE__ */ defineIcon(
	"Receipt",
	<>
		<path d="M5 3.5 8 5l4-1.5L16 5l3-1.5v17L16 19l-4 1.5L8 19l-3 1.5v-17ZM8 9h8m-8 4h8m-8 3h4" />
	</>,
);
export const Tag = /* @__PURE__ */ defineIcon(
	"Tag",
	<>
		<path d="M3.5 4h8l9 9-7.5 7.5-9.5-9V4Z" />
		<circle cx="8" cy="8" r="1" />
	</>,
);
export const Gift = /* @__PURE__ */ defineIcon(
	"Gift",
	<>
		<rect x="3.5" y="8" width="17" height="5" rx="1" />
		<path d="M5 13v7h14v-7M12 8v12M12 8C4 9 5 1 9 4l3 4Zm0 0c8 1 7-7 3-4l-3 4Z" />
	</>,
);
export const Package = /* @__PURE__ */ defineIcon(
	"Package",
	<>
		<path d="m3.5 7 8.5-4 8.5 4v10L12 21l-8.5-4V7Zm0 0 8.5 4 8.5-4M12 11v10M8 5l8 4v4" />
	</>,
);
export const Truck = /* @__PURE__ */ defineIcon(
	"Truck",
	<>
		<path d="M3.5 5h11v12h-5m5-9H18l3 5v4h-2m-4.5 0h.5M3.5 5v12H5" />
		<circle cx="7" cy="18" r="2" />
		<circle cx="17" cy="18" r="2" />
	</>,
);
export const Landmark = /* @__PURE__ */ defineIcon(
	"Landmark",
	<>
		<path d="m3 8 9-5 9 5H3Zm2 3v6m5-6v6m4-6v6m5-6v6M4 20h16" />
	</>,
);
export const Handshake = /* @__PURE__ */ defineIcon(
	"Handshake",
	<>
		<path d="m3 8 4-3 4 1 3-1 7 4-3 8-4 3-7-3-4-9Zm8-2-3 5 2 1 3-2 5 5m-8 1 4 4m-6-2 2 2M3 8l4 9m14-8-4 8" />
	</>,
);
export const Trophy = /* @__PURE__ */ defineIcon(
	"Trophy",
	<>
		<path d="M8 4h8v8a4 4 0 0 1-8 0V4ZM8 6H4v3a4 4 0 0 0 4 4m8-7h4v3a4 4 0 0 1-4 4M12 16v4m-4 0h8" />
	</>,
);
export const Medal = /* @__PURE__ */ defineIcon(
	"Medal",
	<>
		<circle cx="12" cy="15" r="5.5" />
		<path d="m8 11-4-7h5l3 5.5L15 4h5l-4 7" />
		<path d="m12 12 1 2 2 .5-1.5 1.5.5 2-2-1-2 1 .5-2L9 14.5l2-.5 1-2Z" />
	</>,
);
export const Scale = /* @__PURE__ */ defineIcon(
	"Scale",
	<>
		<path d="M12 3v17M5 20h14M4 7l16-2M6 7l-3 7h6L6 7Zm12-1-3 7h6l-3-7M3 14a3 3 0 0 0 6 0m6-1a3 3 0 0 0 6 0" />
	</>,
);
export const Ticket = /* @__PURE__ */ defineIcon(
	"Ticket",
	<>
		<path d="M4 5h16v5a2 2 0 0 0 0 4v5H4v-5a2 2 0 0 0 0-4V5ZM15 5v2m0 3v1m0 3v1m0 3v1" />
	</>,
);
export const Calendar = /* @__PURE__ */ defineIcon(
	"Calendar",
	<>
		<rect x="3.5" y="5" width="17" height="15" rx="2" />
		<path d="M8 3v4m8-4v4M3.5 10h17M8 14h1m6 0h1m-8 3h1" />
	</>,
);
export const Clock = /* @__PURE__ */ defineIcon(
	"Clock",
	<>
		<circle cx="12" cy="12" r="8.5" />
		<path d="M12 6.5V12l4 2.5" />
	</>,
);
export const AlarmClock = /* @__PURE__ */ defineIcon(
	"AlarmClock",
	<>
		<circle cx="12" cy="13" r="7.5" />
		<path d="M12 9v4h3M3 5l3-2m15 2-3-2M7 19l-2 2m12-2 2 2" />
	</>,
);
export const Hourglass = /* @__PURE__ */ defineIcon(
	"Hourglass",
	<>
		<path d="M5 3.5h14M5 20.5h14M7 3.5v3c0 3 5 4 5 5.5s-5 2.5-5 5.5v3m10-17v3c0 3-5 4-5 5.5s5 2.5 5 5.5v3M9 18h6" />
	</>,
);
export const Coffee = /* @__PURE__ */ defineIcon(
	"Coffee",
	<>
		<path d="M4 9h12v7a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V9Zm12 1h2a3 3 0 0 1 0 6h-2M7 3.5v2m6-2v2" />
	</>,
);
export const Utensils = /* @__PURE__ */ defineIcon(
	"Utensils",
	<>
		<path d="M4 3.5v5a3 3 0 0 0 6 0v-5M7 3.5v17M19 3.5c-4 2-5 6-5 10h5m0-10v17" />
	</>,
);
export const Heart = /* @__PURE__ */ defineIcon(
	"Heart",
	<>
		<path d="M12 20 4.7 12.7a5.2 5.2 0 0 1 7.3-7.3 5.2 5.2 0 0 1 7.3 7.3L12 20Z" />
	</>,
	() => (
		<path
			fill="currentColor"
			stroke="none"
			d="M12 21c-.3 0-.6-.1-.8-.3L4 13.5C.5 10 2.7 3 7.6 3c1.7 0 3.2.7 4.4 2 1.2-1.3 2.7-2 4.4-2 4.9 0 7.1 7 3.6 10.5l-7.2 7.2c-.2.2-.5.3-.8.3Z"
		/>
	),
);
export const Star = /* @__PURE__ */ defineIcon(
	"Star",
	<>
		<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z" />
	</>,
	() => (
		<path
			fill="currentColor"
			stroke="none"
			d="M11.2 2.8a.9.9 0 0 1 1.6 0l2.9 5.4 5.9 1a.9.9 0 0 1 .5 1.5l-4.2 4.2.8 5.9a.9.9 0 0 1-1.3.9L12 19l-5.4 2.7a.9.9 0 0 1-1.3-.9l.8-5.9-4.2-4.2a.9.9 0 0 1 .5-1.5l5.9-1 2.9-5.4Z"
		/>
	),
);
export const Flame = /* @__PURE__ */ defineIcon(
	"Flame",
	<>
		<path d="M12 3c1 5 8 7 7 12a7 7 0 0 1-14 0c-.5-3 2-6 4-8 0 3 1 4 2 4 1-2 2-4 1-8Z" />
	</>,
);
export const Droplet = /* @__PURE__ */ defineIcon(
	"Droplet",
	<>
		<path d="M12 3C9 7 5 10.5 5 14a7 7 0 0 0 14 0c0-3.5-4-7-7-11ZM9 15a3 3 0 0 0 3 3" />
	</>,
);
export const Leaf = /* @__PURE__ */ defineIcon(
	"Leaf",
	<>
		<path d="M20.5 3.5c-3 2-8 0-12 3a7 7 0 0 0 9 11c3-3 3-8 3-14Zm-17 17 11-11" />
	</>,
);
export const Flower = /* @__PURE__ */ defineIcon(
	"Flower",
	<>
		<path d="M12 7c-4-8-10-2-5 3-8 1-6 9 1 7 0 7 8 6 8 0 7 2 9-6 2-7 5-5-2-11-6-3Z" />
		<circle cx="12" cy="12" r="3" />
	</>,
);
export const Umbrella = /* @__PURE__ */ defineIcon(
	"Umbrella",
	<>
		<path d="M3.5 12a8.5 8.5 0 0 1 17 0h-17ZM12 12v6a2.5 2.5 0 0 0 5 0M12 2.5v1" />
	</>,
);
export const Globe = /* @__PURE__ */ defineIcon(
	"Globe",
	<>
		<circle cx="12" cy="12" r="8.5" />
		<ellipse cx="12" cy="12" rx="3.5" ry="8.5" />
		<path d="M3.5 12h17" />
	</>,
);
export const Rocket = /* @__PURE__ */ defineIcon(
	"Rocket",
	<>
		<path d="M10 15 7 12c2-5 6-8 13-8 0 7-3 11-8 13l-2-2ZM8 10H4l-1 6 4-1m7 1v4l-6 1 1-4M5 19l-2 2" />
		<circle cx="15" cy="9" r="2" />
	</>,
);
export const Lightbulb = /* @__PURE__ */ defineIcon(
	"Lightbulb",
	<>
		<path d="M9 17c0-3-4-3.5-4-7a7 7 0 0 1 14 0c0 3.5-4 4-4 7H9Zm1 3h4M12 17v-6m-2-1 2 1 2-1" />
	</>,
);

export const WifiOff = /* @__PURE__ */ defineIcon(
	"WifiOff",
	<>
		<path d="M3.5 3.5 20.5 20.5M3.5 8a13 13 0 0 1 13.25-2.2M6.5 11.5a8.5 8.5 0 0 1 5.75-2m5.25 2a9 9 0 0 1 .75.75M9.5 15a4 4 0 0 1 5 0" />
		<circle cx="12" cy="18.5" r="0.8" />
	</>,
);
export const BatteryCharging = /* @__PURE__ */ defineIcon(
	"BatteryCharging",
	<>
		<rect x="3.5" y="7" width="15" height="10" rx="2" />
		<path d="M21 10v4m-9-5-2.5 4H13l-2.5 4" />
	</>,
);
export const CloudUpload = /* @__PURE__ */ defineIcon(
	"CloudUpload",
	<>
		<path d="M7.5 18.5H7a4 4 0 0 1-1.4-7.75A6.5 6.5 0 0 1 18.25 10.5a4 4 0 0 1 .25 8h-2" />
		<path d="M12 20V11m-3 3 3-3 3 3" />
	</>,
);
export const CloudDownload = /* @__PURE__ */ defineIcon(
	"CloudDownload",
	<>
		<path d="M7.5 18.5H7a4 4 0 0 1-1.4-7.75A6.5 6.5 0 0 1 18.25 10.5a4 4 0 0 1 .25 8h-2" />
		<path d="M12 10v10m-3-3 3 3 3-3" />
	</>,
);
