import {test,expect  } from "@playwright/test";

test('Успешный вход на страницу каталога', async ({ page }) => {
    await page.goto('/login');

    await page.getByTestId('login-input').fill('anna');
    await page.getByTestId('password-input').fill('pass-anna');
    await page.getByTestId('login-submit').click();

    await expect(page).toHaveURL(/\/catalog/);
    await expect(page.getByTestId('role-badge')).toHaveText('user');
});