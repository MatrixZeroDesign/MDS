import { mkdtemp, readFile, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
const dir = await mkdtemp(join(tmpdir(), "mds-consumer-"));
try {
	const archives = [];
	for (const name of ["icons", "ui", "charts"]) {
		const packed = JSON.parse(
			execFileSync("npm", ["pack", "--workspace", "@matrixzero/" + name, "--json", "--pack-destination", dir], {
				encoding: "utf8",
			}),
		)[0];
		if (packed.files.some((f) => /scratchpad|\.npmrc|\.env|node_modules/.test(f.path)))
			throw Error("Unexpected private files in " + name);
		const pkg = JSON.parse(await readFile("packages/" + name + "/package.json", "utf8"));
		for (const target of Object.values(pkg.exports)) {
			const path = typeof target === "string" ? target : target.import;
			if (!packed.files.some((f) => f.path === path.replace("./", ""))) throw Error("Missing export " + path);
		}
		archives.push(join(dir, packed.filename));
		console.log(name + ": " + packed.files.length + " files, " + packed.size + " bytes compressed");
	}
	await writeFile(
		join(dir, "package.json"),
		JSON.stringify({ name: "mds-install-smoke", private: true, type: "module" }),
	);
	execFileSync(
		"npm",
		["install", "--ignore-scripts", "--no-audit", "--no-fund", ...archives, "react@19.2.3", "react-dom@19.2.3"],
		{ cwd: dir, stdio: "pipe" },
	);
	await writeFile(
		join(dir, "render.mjs"),
		"import React from 'react';import {renderToString} from 'react-dom/server';import {ThemeProvider,Button,Field,Input,ToastProvider,Toaster,useToast} from '@matrixzero/ui';import {Plus} from '@matrixzero/icons';import {LineChart} from '@matrixzero/charts';if(!ToastProvider||!Toaster||!useToast)throw Error('Missing toast exports');const html=renderToString(React.createElement(ThemeProvider,{mode:'light'},React.createElement(Field,{label:'中文 / English'},React.createElement(Input)),React.createElement(Button,null,'Save'),React.createElement(Plus),React.createElement(LineChart,{title:'Trend',data:[],series:[]})));if(!html.includes('中文 / English')||!html.includes('Save')||!html.includes('Trend'))throw Error('SSR failed');console.log('All installed tarballs: exports and SSR passed');",
	);
	execFileSync(process.execPath, ["render.mjs"], { cwd: dir, stdio: "inherit" });
} finally {
	await rm(dir, { recursive: true, force: true });
}
