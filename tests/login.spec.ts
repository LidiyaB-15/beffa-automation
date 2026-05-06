import {test, expect} from '@playwright/test';
import process from 'process';
test('login test', async ({page})=>{
    await page.goto('/users/login');
    await page.getByRole('textbox', { name: /email/i }).fill(process.env.ADMIN_EMAIL!);
    await page.getByRole('textbox', { name: /password/i }).fill(process.env.ADMIN_PASSWORD!);
  await page.locator('button[type="submit"]').click();

  await expect(page.getByText(/welcome/i)).toBeVisible({ timeout: 15000 });

  // 4. Target the Dashboard button specifically
  // We add .waitFor() to ensure the button is fully ready for interaction
  const dashboardLnk = page.getByRole('link', { name: /dashboard/i }).first();
  await dashboardLnk.waitFor({ state: 'visible' }); 
  await dashboardLnk.click();

  // 5. Final destination check
  await expect(page).toHaveURL(/.*dashboard/, { timeout: 15000 });
  await page.waitForTimeout(5000);
});