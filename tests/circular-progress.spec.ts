import { test, expect } from "@playwright/test";

test("circular progress exposes determinate and indeterminate semantics", async ({ page }) => {
	await page.goto("/docs/circular-progress");
	const example = page.getByRole("region", { name: "Interactive example" }).first();
	const upload = example.getByRole("progressbar", { name: "Upload progress" });
	await expect(upload).toHaveAttribute("aria-valuenow", "72");
	await expect(upload).toContainText("72%");
	await expect(example.getByRole("progressbar", { name: "Syncing" })).not.toHaveAttribute("aria-valuenow");
	await expect(example.getByRole("status", { name: "Build succeeded" })).toBeVisible();
	await expect(example.getByRole("status", { name: "Build failed" })).toBeVisible();
});
