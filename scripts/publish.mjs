import { readFile, mkdtemp, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
const flag = process.argv.indexOf("--package");
const tag = process.env.GITHUB_REF_NAME || process.env.CI_COMMIT_TAG;
const name = flag >= 0 ? process.argv[flag + 1] : tag?.split("-v")[0];
if (!["icons", "ui", "charts"].includes(name)) throw Error("Specify --package icons|ui|charts");
const pkg = JSON.parse(await readFile("packages/" + name + "/package.json", "utf8"));
const preview = process.argv.includes("--preview");
const isPrerelease = pkg.version.includes("-");
if (preview && !isPrerelease) throw Error("Preview publish requires a prerelease version");
if (!preview) {
	if (tag !== name + "-v" + pkg.version) throw Error("Git tag must match package version");
	execFileSync("git", ["fetch", "origin", "main"]);
	execFileSync("git", ["merge-base", "--is-ancestor", "HEAD", "origin/main"]);
}
const token = process.env.NODE_AUTH_TOKEN || process.env.NPM_TOKEN || process.env.MDS_NPM_TOKEN;
if (!token) throw Error("NODE_AUTH_TOKEN, NPM_TOKEN or MDS_NPM_TOKEN is required");
const dir = await mkdtemp(join(tmpdir(), "mds-publish-"));
try {
	// Literal placeholder only. The actual token is never written to disk.
	const config = join(dir, "npmrc");
	await writeFile(
		config,
		"registry=https://registry.npmjs.org/\n//registry.npmjs.org/:_authToken=${NODE_AUTH_TOKEN}\n",
		{
			mode: 0o600,
		},
	);
	const publishArgs = [
		"publish",
		"--workspace",
		pkg.name,
		"--ignore-scripts",
		"--access",
		"public",
		"--tag",
		isPrerelease ? "next" : "latest",
	];
	if (process.env.GITHUB_ACTIONS) publishArgs.push("--provenance");
	execFileSync("npm", publishArgs, {
		stdio: "inherit",
		env: { ...process.env, NODE_AUTH_TOKEN: token, NPM_CONFIG_USERCONFIG: config },
	});
} finally {
	await rm(dir, { recursive: true, force: true });
}
