import {test, expect} from '@playwright/test';
test('login test', async ({page})=>{
    await page.goto('/users/login');
    await page.getByLabel('Email').fill(process.env.ADMIN_EMAIL!);
    await page.getByLabel('Password *').fill(process.env.ADMIN_PASSWORD!);
    await page.getByRole('button', {name: 'Login'}).click();
    
    await expect(page.getByText(/Welcome, System/i)).toBeVisible();


})