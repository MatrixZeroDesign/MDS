import { readFile, mkdtemp, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
const flag = process.argv.indexOf("--package");
const name = flag >= 0 ? process.argv[flag + 1] : process.env.CI_COMMIT_TAG?.split("-v")[0];
if (!["icons", "ui", "charts"].includes(name)) throw Error("Specify --package icons|ui|charts");
const pkg = JSON.parse(await readFile("packages/" + name + "/package.json", "utf8"));
const preview = process.argv.includes("--preview");
const isPrerelease = pkg.version.includes("-");
if (preview && !isPrerelease) throw Error("Preview publish requires a prerelease version");
if (!preview) {
	if (process.env.CI_COMMIT_TAG !== name + "-v" + pkg.version) throw Error("Git tag must match package version");
	execFileSync("git", ["fetch", "origin", "main"]);
	execFileSync("git", ["merge-base", "--is-ancestor", "HEAD", "origin/main"]);
}
const token = process.env.CI_JOB_TOKEN || process.env.MDS_NPM_TOKEN;
if (!token) throw Error("CI_JOB_TOKEN or MDS_NPM_TOKEN is required");
const dir = await mkdtemp(join(tmpdir(), "mds-publish-"));
try {
	// Literal placeholder only. The actual token is never written to disk.
	const config = join(dir, "npmrc");
	await writeFile(config, "//gitlab.com/api/v4/projects/86296621/packages/npm/:_authToken=${MDS_NPM_TOKEN}\n", {
		mode: 0o600,
	});
	execFileSync(
		"npm",
		["publish", "--workspace", pkg.name, "--ignore-scripts", "--tag", isPrerelease ? "next" : "latest"],
		{ stdio: "inherit", env: { ...process.env, MDS_NPM_TOKEN: token, NPM_CONFIG_USERCONFIG: config } },
	);
} finally {
	await rm(dir, { recursive: true, force: true });
}
