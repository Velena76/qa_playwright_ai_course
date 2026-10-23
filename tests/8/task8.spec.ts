import {test,expect  } from "@playwright/test";

test('Успешный вход на страницу каталога', async ({ page }) => {
    await page.goto('/login');

    await page.getByTestId('login-input').fill('anna');
    await page.getByTestId('password-input').fill('anna-pass');
    await page.getByTestId('login-submit').click();

    await expect(page).toHaveURL(/\/catalog/);
    await expect(page.getByTestId('role-badge')).toHaveText('user');
    await expect(page.getByTestId('nav-admin-products')).toHaveCount(0);
    await expect(page.getByTestId('app-arror')).toBeHidden();
});