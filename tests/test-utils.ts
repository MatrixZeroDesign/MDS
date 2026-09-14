import { expect, type Page } from "@playwright/test";

export async function useArabicDirection(page: Page) {
	await page.getByRole("button", { name: "Change language" }).click();
	await page.getByRole("menuitemradio", { name: "العربية", exact: true }).click();
	await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
}
