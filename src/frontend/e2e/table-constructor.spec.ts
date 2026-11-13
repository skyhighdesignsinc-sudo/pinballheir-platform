/**
 * table-constructor.spec.ts
 *
 * Smoke tests for the PinballHEIR table constructor (/constructor).
 * Verifies that:
 *   - All 9 tabs are present and clickable
 *   - The Visuals tab exposes color pickers and theme selectors
 *   - The Economy tab shows the platform fee as read-only (DAO-controlled)
 */

import { expect, test } from "@playwright/test";

const CONSTRUCTOR_URL = "/constructor";

// ─── TEST 1: All 9 tabs load ──────────────────────────────────────────────────

test("table constructor loads all 9 tabs", async ({ page }) => {
  await page.goto(CONSTRUCTOR_URL);

  // Wait for the page to stabilise
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(500);

  const expectedTabs = [
    "Layout",
    "Visuals",
    "Physics",
    "Economy",
    "Ruleset",
    "Metadata",
    "Access",
    "DAO",
    "Sound",
  ];

  for (const tabName of expectedTabs) {
    // Tabs can be button or [role="tab"]
    const tab = page
      .locator(`button, [role="tab"]`)
      .filter({ hasText: tabName })
      .first();
    const count = await tab.count();
    console.log(`[TEST] Tab "${tabName}" found: ${count > 0}`);
    expect(count).toBeGreaterThan(0);
  }

  // Screenshot for visual confirmation
  await page.screenshot({
    path: "test-results/constructor-tabs.png",
    fullPage: false,
  });
});

// ─── TEST 2: Visuals tab has color pickers and themes ─────────────────────────

test("visuals tab has color pickers and theme buttons", async ({ page }) => {
  await page.goto(CONSTRUCTOR_URL);
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(300);

  // Click the Visuals tab
  const visualsTab = page
    .locator(`button, [role="tab"]`)
    .filter({ hasText: "Visuals" })
    .first();
  await visualsTab.click();
  await page.waitForTimeout(400);

  // At least 3 color inputs should be visible (primary, secondary, accent)
  const colorInputs = page.locator('input[type="color"]');
  const colorCount = await colorInputs.count();
  console.log(`[TEST] Color inputs found: ${colorCount}`);
  expect(colorCount).toBeGreaterThanOrEqual(3);

  // Theme buttons — check for at least "Cyberpunk", "Space", "Ocean"
  const themeNames = ["Cyberpunk", "Space", "Ocean"];
  for (const theme of themeNames) {
    const themeBtn = page.locator("button").filter({ hasText: theme }).first();
    const count = await themeBtn.count();
    console.log(`[TEST] Theme "${theme}" found: ${count > 0}`);
    expect(count).toBeGreaterThan(0);
  }

  // Screenshot for visual confirmation
  await page.screenshot({
    path: "test-results/constructor-visuals.png",
    fullPage: false,
  });
});

// ─── TEST 3: Economy tab platform fee is read-only ────────────────────────────

test("economy tab platform fee is read-only (DAO-controlled)", async ({
  page,
}) => {
  await page.goto(CONSTRUCTOR_URL);
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(300);

  // Click the Economy tab
  const economyTab = page
    .locator(`button, [role="tab"]`)
    .filter({ hasText: "Economy" })
    .first();
  await economyTab.click();
  await page.waitForTimeout(400);

  // Screenshot of economy tab
  await page.screenshot({
    path: "test-results/constructor-economy.png",
    fullPage: false,
  });

  // Look for "Platform Fee" text anywhere on the page
  const platformFeeText = page.locator("text=Platform Fee").first();
  const feeTextCount = await platformFeeText.count();
  console.log(`[TEST] "Platform Fee" text found: ${feeTextCount > 0}`);
  expect(feeTextCount).toBeGreaterThan(0);

  // Check for "Set by DAO" label or a lock icon / disabled input
  // The fee field should have a "Set by DAO" note or the input should be disabled
  const setByDaoText = page.locator("text=Set by DAO").first();
  const daoLockText = page.locator("text=DAO").first();
  const disabledInputs = page.locator(
    'input[disabled], input[readonly], [aria-disabled="true"]',
  );

  const setByDaoCount = await setByDaoText.count();
  const disabledCount = await disabledInputs.count();

  console.log(`[TEST] "Set by DAO" found: ${setByDaoCount > 0}`);
  console.log(`[TEST] Disabled/readonly inputs: ${disabledCount}`);

  // At least one of: "Set by DAO" text present OR at least one disabled input
  expect(setByDaoCount + disabledCount).toBeGreaterThan(0);

  // Also confirm DAO text appears somewhere in economy context
  const daoMention = await daoLockText.count();
  expect(daoMention).toBeGreaterThan(0);
});
