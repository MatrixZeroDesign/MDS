import { build } from "esbuild";
import assert from "node:assert/strict";
const cases = [
	["ui", "Button", ["date-time", "cascader", "data-table"]],
	["ui", "Divider", ["date-time", "cascader", "data-table"]],
	["ui", "Grid", ["date-time", "cascader", "data-table"]],
	["ui", "Typography", ["date-time", "cascader", "data-table"]],
	["icons", "Plus", ["/catalog.js", "/interface.js"]],
	["charts", "LineChart", ["/BarChart.js", "/PieChart.js", "/AreaChart.js"]],
	["charts", "AreaChart", ["/BarChart.js", "/PieChart.js", "/LineChart.js"]],
	["charts", "BarChart", ["/PieChart.js", "/LineChart.js", "/AreaChart.js"]],
	["charts", "DonutChart", ["/BarChart.js", "/LineChart.js", "/AreaChart.js"]],
];
for (const [pkg, symbol, forbidden] of cases) {
	const result = await build({
		stdin: { contents: `export { ${symbol} } from "@matrixzero/${pkg}";`, resolveDir: process.cwd() },
		bundle: true,
		write: false,
		format: "esm",
		minify: true,
		metafile: true,
		external: ["react", "react-dom", "react/jsx-runtime"],
	});
	const inputs = Object.entries(Object.values(result.metafile.outputs)[0].inputs)
		.filter(([, info]) => info.bytesInOutput > 0)
		.map(([path]) => path);
	for (const fragment of forbidden)
		assert(!inputs.some((path) => path.includes(fragment)), `${symbol} retains ${fragment}`);
	console.log(`${pkg}/${symbol}: ${result.outputFiles[0].contents.length} bytes; unused component checks passed`);
}
