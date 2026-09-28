import { expect, test } from "@playwright/test";

test("TextField associates its icon, unit, description, and native input", async ({ page }) => {
	await page.goto("/docs/text-field?lang=en");
	const example = page.getByRole("region", { name: "Interactive example" });
	const input = example.getByRole("textbox", { name: "Workspace address" });
	await expect(input).toHaveValue("matrix");
	await expect(example.locator(".mds-input-affix")).toHaveAttribute("aria-hidden", "true");
	await expect(example.locator(".mds-input-unit")).toHaveText(".example.com");
	const describedBy = (await input.getAttribute("aria-describedby"))?.split(" ") ?? [];
	expect(describedBy).toHaveLength(2);
	await expect(page.locator(`#${describedBy[0]}`)).toHaveText(".example.com");
	await expect(page.locator(`#${describedBy[1]}`)).toContainText("Use letters, numbers, and hyphens.");
});

test("NumberField keeps native spinbutton input and bounded step controls", async ({ page }) => {
	await page.goto("/docs/number-field?lang=en");
	const example = page.getByRole("region", { name: "Interactive example" });
	const input = example.getByRole("spinbutton", { name: "Quantity" });
	await expect(input).toHaveValue("1");
	await expect(input).toHaveAttribute("min", "0");
	await expect(input).toHaveAttribute("max", "100");
	await expect(input).toHaveAttribute("step", "1");
	await expect(example.locator(".mds-input-affix, .mds-input-unit")).toHaveCount(0);
	const inputBox = await input.boundingBox();
	const increaseBox = await example.getByRole("button", { name: "Increase quantity" }).boundingBox();
	const decreaseBox = await example.getByRole("button", { name: "Decrease quantity" }).boundingBox();
	const controlBox = await example.locator(".mds-number-field-control").boundingBox();
	expect(inputBox).not.toBeNull();
	expect(increaseBox).not.toBeNull();
	expect(decreaseBox).not.toBeNull();
	expect(controlBox).not.toBeNull();
	expect(increaseBox!.x).toBeGreaterThan(inputBox!.x + inputBox!.width - 1);
	expect(increaseBox!.x).toBe(decreaseBox!.x);
	expect(increaseBox!.y + increaseBox!.height).toBeLessThanOrEqual(decreaseBox!.y + 1);
	expect(increaseBox!.y).toBeGreaterThanOrEqual(controlBox!.y);
	expect(decreaseBox!.y + decreaseBox!.height).toBeLessThanOrEqual(controlBox!.y + controlBox!.height);
	expect(Math.abs(increaseBox!.height - decreaseBox!.height)).toBeLessThanOrEqual(1);

	await input.fill("40");
	await expect(input).toHaveValue("40");
	await example.getByRole("button", { name: "Increase quantity" }).click();
	await expect(input).toHaveValue("41");
	await example.getByRole("button", { name: "Decrease quantity" }).click();
	await expect(input).toHaveValue("40");
	await input.focus();
	await page.keyboard.press("ArrowUp");
	await expect(input).toHaveValue("41");
});

test("TextField examples cover native input types, affixes, validation, and non-editable states", async ({ page }) => {
	await page.goto("/docs/text-field?lang=en");
	const types = page.getByRole("region", { name: "Common input types" });
	for (const [label, type] of [
		["Email", "email"],
		["Password", "password"],
		["Search", "search"],
		["Website", "url"],
		["Phone number", "tel"],
	] as const)
		await expect(types.getByLabel(label)).toHaveJSProperty("type", type);

	const affixes = page.getByRole("region", { name: "Input and status icons" });
	await expect(affixes.locator(".mds-input-affix")).toHaveCount(2);
	await expect(affixes.locator(".mds-input-unit")).toHaveCount(0);

	const states = page.getByRole("region", { name: "Validation and field states" });
	await expect(states.getByLabel("Username")).toHaveAttribute("aria-invalid", "true");
	await expect(states.getByLabel("Organization")).toHaveAttribute("readonly", "");
	await expect(states.getByLabel("Account ID")).toBeDisabled();

	const withoutLabel = page.getByRole("region", { name: "Without a visible label" });
	await expect(withoutLabel.getByRole("searchbox", { name: "Search components" })).toBeVisible();
	await expect(withoutLabel.locator(".mds-label")).toHaveCount(0);
});

test("NumberField examples cover units, decimals, bounds, validation, and non-editable states", async ({ page }) => {
	await page.goto("/docs/number-field?lang=en");
	const sides = page.getByRole("region", { name: "Controls on both sides" });
	const guests = sides.getByRole("spinbutton", { name: "Guests" });
	const removeGuest = sides.getByRole("button", { name: "Remove a guest" });
	const addGuest = sides.getByRole("button", { name: "Add a guest" });
	await expect(guests).toHaveValue("2");
	await addGuest.click();
	await expect(guests).toHaveValue("3");
	await removeGuest.click();
	await expect(guests).toHaveValue("2");
	const [controlBox, removeBox, inputBox, addBox] = await Promise.all([
		sides.locator(".mds-number-field-control").boundingBox(),
		removeGuest.boundingBox(),
		guests.boundingBox(),
		addGuest.boundingBox(),
	]);
	expect(controlBox).not.toBeNull();
	expect(removeBox).not.toBeNull();
	expect(inputBox).not.toBeNull();
	expect(addBox).not.toBeNull();
	expect(removeBox!.x + removeBox!.width).toBeLessThanOrEqual(inputBox!.x + 1);
	expect(inputBox!.x + inputBox!.width).toBeLessThanOrEqual(addBox!.x + 1);
	expect(removeBox!.y).toBe(controlBox!.y + 1);
	expect(addBox!.y + addBox!.height).toBe(controlBox!.y + controlBox!.height - 1);

	const units = page.getByRole("region", { name: "Units and decimal precision" });
	await expect(units.getByRole("spinbutton", { name: "Weight" })).toHaveAttribute("step", "0.25");
	await expect(units.getByRole("spinbutton", { name: "Completion" })).toHaveAttribute("max", "100");
	await expect(units.getByText("ms", { exact: true })).toBeVisible();

	const bounds = page.getByRole("region", { name: "Minimum and maximum bounds" });
	await expect(bounds.getByRole("button", { name: "Increase seats" })).toBeDisabled();

	const states = page.getByRole("region", { name: "Validation and field states" });
	await expect(states.getByRole("spinbutton", { name: "Retry count" })).toHaveAttribute("aria-invalid", "true");
	await expect(states.getByRole("spinbutton", { name: "Storage used" })).toHaveAttribute("readonly", "");
	await expect(states.getByRole("spinbutton", { name: "Archive retention" })).toBeDisabled();

	const withoutLabel = page.getByRole("region", { name: "Without a visible label" });
	await expect(withoutLabel.getByRole("spinbutton", { name: "Zoom level" })).toBeVisible();
	await expect(withoutLabel.locator(".mds-label")).toHaveCount(0);
});
