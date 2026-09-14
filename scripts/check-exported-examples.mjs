import ts from "typescript";
import fs from "node:fs";
import path from "node:path";
const directory = "apps/docs/public/docs/examples";
const files = fs
	.readdirSync(directory, { recursive: true })
	.filter((file) => file.endsWith(".tsx"))
	.map((file) => path.resolve(directory, file));
const config = ts.readConfigFile("apps/docs/tsconfig.json", ts.sys.readFile).config;
const parsed = ts.parseJsonConfigFileContent(config, ts.sys, path.resolve("apps/docs"));
const program = ts.createProgram(files, { ...parsed.options, noEmit: true });
const diagnostics = ts.getPreEmitDiagnostics(program);
if (diagnostics.length) {
	console.error(
		ts.formatDiagnosticsWithColorAndContext(diagnostics, {
			getCanonicalFileName: (file) => file,
			getCurrentDirectory: () => process.cwd(),
			getNewLine: () => "\n",
		}),
	);
	process.exitCode = 1;
} else console.log(`Verified ${files.length} standalone exported TSX examples.`);
