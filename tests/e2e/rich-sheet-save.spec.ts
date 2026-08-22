import { test, expect } from '@playwright/test';
import {
  openSpreadsheet,
  saveSpreadsheetAs,
  waitForSpreadsheetReady,
  generateUniqueUser,
  registerUser,
  loginUser,
} from './helpers/app-helper';

// Helper: send a single SocialCalc sheet command and wait for editor idle.
async function sc(page: any, cmd: string) {
  await page.evaluate((c: string) => {
    (window as any).spreadsheet.editor.EditorScheduleSheetCommands(c, true, false);
  }, cmd);
  await page.waitForFunction(
    () => (window as any).spreadsheet.editor.busy === false,
    { timeout: 10000 }
  );
}

test('rich multi-cell sheet: numbers, formulas, formatting — save and report key', async ({ page }) => {
  const credentials = generateUniqueUser();
  const sheetName = `rich_${Date.now()}`;

  await registerUser(page, credentials.email, credentials.password);
  await loginUser(page, credentials.email, credentials.password);
  await openSpreadsheet(page, 'default');

  // ── Headers (row 1) ──────────────────────────────────────────────────────
  await sc(page, 'set A1 text t Product');
  await sc(page, 'set B1 text t Q1 Sales');
  await sc(page, 'set C1 text t Q2 Sales');
  await sc(page, 'set D1 text t Total');

  // Bold the header row
  await sc(page, 'set A1:D1 font normal bold * *');

  // ── Data rows ────────────────────────────────────────────────────────────
  await sc(page, 'set A2 text t Widget A');
  await sc(page, 'set B2 value n 4200');
  await sc(page, 'set C2 value n 5100');
  await sc(page, 'set D2 formula SUM(B2:C2)');

  await sc(page, 'set A3 text t Widget B');
  await sc(page, 'set B3 value n 3800');
  await sc(page, 'set C3 value n 4600');
  await sc(page, 'set D3 formula SUM(B3:C3)');

  await sc(page, 'set A4 text t Grand Total');
  await sc(page, 'set B4 formula SUM(B2:B3)');
  await sc(page, 'set C4 formula SUM(C2:C3)');
  await sc(page, 'set D4 formula SUM(D2:D3)');

  // ── Formatting ───────────────────────────────────────────────────────────
  // Number format on numeric/formula cells
  await sc(page, 'set B2:D4 nontextvalueformat #,##0.00');
  // Highlight header row background
  await sc(page, 'set A1:D1 bgcolor #CCCCFF');
  // Highlight Grand Total row
  await sc(page, 'set A4:D4 bgcolor #FFCC99');
  // Bold Grand Total row
  await sc(page, 'set A4:D4 font normal bold * *');

  // ── Verify formula cells resolved (recalc must have run) ─────────────────
  const d4val = await page.evaluate(() => {
    const sc = (window as any).spreadsheet;
    const cell = sc.sheet.cells['D4'];
    return cell ? cell.datavalue : null;
  });
  // SUM(D2:D3) = (4200+5100) + (3800+4600) = 17700
  expect(d4val).toBe(17700);

  // ── Save ─────────────────────────────────────────────────────────────────
  await saveSpreadsheetAs(page, sheetName);

  // Log the MinIO key so the round-trip script can find it
  console.log(`SHEET_NAME=${sheetName}`);
  console.log(`USER_EMAIL=${credentials.email}`);

  // Verify it appears on the dashboard
  await page.goto('/save');
  await expect(page.locator('tr', { hasText: sheetName })).toBeVisible();
});
