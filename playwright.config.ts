import { defineConfig } from "@playwright/test";
export default defineConfig({
	testDir: "tests",
	fullyParallel: true,
	workers: process.env.CI ? 2 : undefined,
	retries: process.env.CI ? 1 : 0,
	use: { baseURL: "http://127.0.0.1:4173", viewport: { width: 1280, height: 1000 }, trace: "retain-on-failure" },
	webServer: {
		command: "npm run dev -w @matrixzero/mds-docs",
		url: "http://127.0.0.1:4173",
		reuseExistingServer: !process.env.CI,
	},
	reporter: process.env.CI ? [["list"], ["junit", { outputFile: "test-results/results.xml" }]] : "list",
});
