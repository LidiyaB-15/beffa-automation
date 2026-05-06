import { test, expect } from '@playwright/test';
test('create inventory test', async ({ page }) => {
  await page.goto('/users/login');
  await page.getByRole('textbox', { name: /email/i }).fill(process.env.ADMIN_EMAIL!);
  await page.getByRole('textbox', { name: /password/i }).fill(process.env.ADMIN_PASSWORD!);
  await page.locator('button[type="submit"]').click();
  await expect(page.getByText(/welcome/i)).toBeVisible({ timeout: 15000 });
  await page.getByRole('link', { name: 'Dashboard' }).click();
  
  await page.goto('http://157.180.20.112:4173/inventories/items/new');
  await page.waitForURL('**/inventories/items/new');

  const uniqueId = `inv-${Date.now()}`;
  await page.getByRole('textbox', { name: 'Code/ID *' }).fill(uniqueId);
  await page.getByRole('textbox', { name: 'Name *' }).fill('Automated Test Item');
  await page.getByRole('spinbutton', { name: 'Quantity *' }).fill('2');
  await page.getByRole('spinbutton', { name: 'Unit Cost' }).fill('10');

  await page.getByRole('button', { name: 'Warehouse selector' }).click();
  await page.getByRole('group').filter({ hasText: 'Default Warehouse' }).click();
  
  await page.getByRole('button', { name: 'Location selector' }).click();
  await page.getByRole('group').filter({ hasText: 'Default Warehouse Location' }).click();

  await page.getByLabel('Item Class *').selectOption('RWT');
  await page.getByLabel('Category *').selectOption('Raw Materials');
  await page.getByLabel('Cost Method').selectOption('FIFO');
  await page.getByLabel('Unit of Measurement *').selectOption('Each (ea)');

  const fillGLAccount = async (selector: string, search: string, result: string | RegExp) => {
    await page.getByRole('button', { name: selector }).click();
    await page.getByRole('textbox', { name: 'Search...' }).fill(search);
    await page.getByRole('group').filter({ hasText: result }).click();
  };

  await fillGLAccount('GL Cost Account selector', 'cost', 'Cost of Others');
  await fillGLAccount('GL Sales Account selector', 'sal', /^Sales$/);
  await fillGLAccount('GL Inventory Account selector', 'in', /^Inventory$/);

  await page.locator('#undefined-input-id').fill('Testing item creation via direct URL');
  await page.getByRole('button', { name: 'Add Now' }).click();

  await expect(page).toHaveURL(/.*detail/);
  console.log(`Success: Created item ${uniqueId}`);
});
