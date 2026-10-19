import {test,expect } from "@playwright/test";

test('неверный пароль оставляет пользователя на странице входа', async ({ page }) => {
    await page.goto('./login');

    await page.getByTestId('login-input').fill('anna');
    await page.getByTestId('password-input').fill('pass-anna');
    await page.getByTestId('login-submit').click();

    await expect(page.getByText('Ошибка')).toBeVisible();
    await expect(page.getByTestId('app-error-code')).toHaveText('UNAUTHORIZED');

    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByTestId('role-badge')).toHaveCount(0);
});