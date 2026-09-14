import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { useArabicDirection } from "./test-utils";
const ids = ["projects", "crm", "support", "team", "billing", "shop", "travel", "learning", "music", "wellness"];

for (const path of ["overview", "policy"])
	test(`${path} uses the shared scenario detail layout`, async ({ page }) => {
		await page.goto("/" + path);
		await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
		await expect(page.locator(".docs-page-heading .docs-eyebrow")).toHaveText("MATRIX / DESIGN SYSTEM");
		await expect(page.locator(".sc-detail-bar").getByRole("link", { name: /All scenarios/ })).toHaveAttribute(
			"href",
			"/showcase",
		);
		await expect(page.getByRole("region", { name: "Product scenario" })).toBeVisible();
		await expect(page.locator(".sc-components")).toBeVisible();
	});
test("showcase catalog filters all scenarios and clears empty search", async ({ page }) => {
	await page.goto("/showcase");
	await expect(page.locator(".sc-gallery-card")).toHaveCount(19);
	await page.getByRole("radio", { name: "Consumer · 10", exact: true }).click();
	await expect(page.locator(".sc-gallery-card")).toHaveCount(10);
	await page.getByRole("searchbox", { name: "Search scenarios" }).fill("zzzz");
	await expect(page.getByRole("heading", { name: "No matching scenarios" })).toBeVisible();
	await page.getByRole("button", { name: "Clear filters" }).click();
	await expect(page.locator(".sc-gallery-card")).toHaveCount(19);
});
for (const id of ids)
	test(`${id} is accessible, has source and fits mobile RTL`, async ({ page }) => {
		await page.goto("/showcase-" + id);
		const scene = page.getByRole("region", { name: "Product scenario" });
		await expect(scene.locator(".mds-card").first()).toBeVisible();
		expect((await new AxeBuilder({ page }).include(".sc-product").analyze()).violations).toEqual([]);
		await page.getByText("View scenario source", { exact: true }).click();
		await expect(page.locator(".sc-source pre").first()).toContainText("@matrixzero/");
		await page.getByText("View scenario source", { exact: true }).click();
		await useArabicDirection(page);
		await page.setViewportSize({ width: 320, height: 900 });
		await expect(page.locator(".sc-product")).toBeVisible();
		await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBeTruthy();
	});
test("business scenarios complete their main workflows", async ({ page }) => {
	await page.goto("/showcase-projects");
	let scene = page.locator(".sc-product");
	await scene.getByRole("textbox", { name: "Task name" }).fill("Review release");
	await scene.getByRole("button", { name: "Add task", exact: true }).click();
	await expect(scene.getByRole("heading", { name: "Review release" })).toBeVisible();
	await scene.getByRole("button", { name: "Move forward" }).first().click();
	await expect(scene.getByRole("heading", { name: "In progress · 2" })).toBeVisible();
	await page.goto("/showcase-crm");
	await scene.getByRole("combobox", { name: "Sales stage" }).click();
	await page.getByRole("option", { name: "Won", exact: true }).click();
	await expect(scene.getByRole("status")).toHaveText("Current stage: Won");
	await page.goto("/showcase-support");
	await scene.getByRole("textbox", { name: "Your reply" }).fill("I have updated your permissions.");
	await scene.getByRole("button", { name: "Send reply" }).click();
	await expect(scene.getByText("I have updated your permissions.")).toBeVisible();
	await scene.getByRole("button", { name: "Resolve ticket" }).click();
	await expect(scene.getByRole("button", { name: "Send reply" })).toBeDisabled();
	await page.goto("/showcase-team");
	await scene.getByRole("textbox", { name: "Invite email" }).fill("new@example.com");
	await scene.getByRole("button", { name: "Add member" }).click();
	await expect(scene.getByRole("combobox", { name: "Role: new@example.com" })).toBeVisible();
	await page.goto("/showcase-billing");
	await scene.getByRole("radio", { name: "Scale", exact: true }).click();
	await scene.getByRole("button", { name: "Review change" }).click();
	await page.getByRole("button", { name: "Confirm change" }).click();
	await expect(scene.locator(".sc-stat").first()).toContainText("Scale");
});
test("consumer scenarios update shopping, booking, learning, player and habits", async ({ page }) => {
	await page.goto("/showcase-shop");
	const scene = page.locator(".sc-product");
	await scene.getByRole("button", { name: /Add to bag/ }).click();
	await expect(scene.getByRole("status")).toHaveText("Your bag contains 1 item");
	await scene.getByRole("radio", { name: "Ink", exact: true }).click();
	await expect(scene.locator(".sc-product-art")).toHaveAttribute("data-color", "ink");
	await page.goto("/showcase-travel");
	await scene.getByRole("button", { name: "Review reservation" }).click();
	await scene.getByRole("button", { name: "Confirm demo reservation" }).click();
	await expect(scene.getByText("Your itinerary is ready")).toBeVisible();
	await page.goto("/showcase-learning");
	await scene.getByRole("button", { name: "Mark lesson complete" }).click();
	await expect(scene.getByRole("status")).toHaveText("Completed 1 of 3 lessons");
	await page.goto("/showcase-music");
	await scene.getByRole("button", { name: "Play", exact: true }).click();
	await expect(scene.getByRole("button", { name: "Pause", exact: true })).toBeVisible();
	await scene.getByRole("button", { name: "Favorite Morning Light" }).click();
	await expect(scene.getByRole("button", { name: "Favorite Morning Light" })).toHaveAttribute("aria-pressed", "true");
	await page.goto("/showcase-wellness");
	await scene.getByRole("checkbox", { name: "Read ten pages" }).check();
	await expect(scene.getByRole("progressbar", { name: "Habit completion" })).toHaveAttribute(
		"aria-valuenow",
		"66.66666666666666",
	);
	await scene.getByRole("button", { name: "Log a glass" }).click();
	await expect(scene.locator(".sc-stat").nth(1)).toContainText("4");
});
