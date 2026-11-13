/**
 * marketplace.spec.ts
 *
 * Smoke tests for the PinballHEIR asset marketplace (/assets).
 * Verifies:
 *   - Page loads with correct heading
 *   - Browse and Upload tabs are visible
 *   - No JavaScript errors on load
 */

import { expect, test } from "@playwright/test";

const ASSETS_URL = "/assets";

// ─── TEST 1: Asset marketplace page loads ─────────────────────────────────────

test("asset marketplace loads with correct heading and tabs", async ({
  page,
}) => {
  await page.goto(ASSETS_URL);
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(500);

  // Screenshot for review
  await page.screenshot({
    path: "test-results/marketplace-load.png",
    fullPage: false,
  });

  // Page title or heading should mention "Marketplace" or "Assets"
  const heading = page
    .locator("h1, h2, h3, [class*='title'], [data-ocid*='heading']")
    .filter({ hasText: /marketplace|assets/i })
    .first();

  const headingCount = await heading.count();
  console.log(`[TEST] Marketplace heading found: ${headingCount > 0}`);
  expect(headingCount).toBeGreaterThan(0);

  // Browse tab should be visible
  const browseTab = page
    .locator(`button, [role="tab"], a`)
    .filter({ hasText: /browse/i })
    .first();
  const browseCount = await browseTab.count();
  console.log(`[TEST] "Browse" tab found: ${browseCount > 0}`);
  expect(browseCount).toBeGreaterThan(0);

  // Upload tab should be visible
  const uploadTab = page
    .locator(`button, [role="tab"], a`)
    .filter({ hasText: /upload/i })
    .first();
  const uploadCount = await uploadTab.count();
  console.log(`[TEST] "Upload" tab found: ${uploadCount > 0}`);
  expect(uploadCount).toBeGreaterThan(0);
});

// ─── TEST 2: No JavaScript errors on marketplace load ─────────────────────────

test("no critical JavaScript errors on marketplace load", async ({ page }) => {
  const jsErrors: string[] = [];
  const consoleErrors: string[] = [];

  page.on("pageerror", (err) => jsErrors.push(err.message));
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });

  await page.goto(ASSETS_URL);
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1_000);

  // Filter out known benign errors (WebGL, network, CORS for local dev)
  const criticalJsErrors = jsErrors.filter(
    (e) =>
      !e.includes("WebGL") &&
      !e.includes("ResizeObserver") &&
      !e.includes("CONTEXT_LOST") &&
      !e.includes("Failed to fetch") &&
      !e.includes("NetworkError"),
  );

  const criticalConsoleErrors = consoleErrors.filter(
    (e) =>
      !e.includes("Failed to fetch") &&
      !e.includes("NetworkError") &&
      !e.includes("CORS") &&
      !e.includes("net::ERR"),
  );

  if (criticalJsErrors.length > 0) {
    console.warn("[TEST] Critical JS page errors:", criticalJsErrors);
  }
  if (criticalConsoleErrors.length > 0) {
    console.warn("[TEST] Critical console errors:", criticalConsoleErrors);
  }

  expect(criticalJsErrors).toHaveLength(0);
  expect(criticalConsoleErrors).toHaveLength(0);
});

// ─── TEST 3: Submit Code tab is present ───────────────────────────────────────

test("marketplace has a Submit Code tab for programmatic assets", async ({
  page,
}) => {
  await page.goto(ASSETS_URL);
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(300);

  // "Submit Code" or "Code" tab
  const codeTab = page
    .locator(`button, [role="tab"], a`)
    .filter({ hasText: /code|submit code/i })
    .first();
  const codeCount = await codeTab.count();
  console.log(`[TEST] "Submit Code" tab found: ${codeCount > 0}`);
  expect(codeCount).toBeGreaterThan(0);
});
