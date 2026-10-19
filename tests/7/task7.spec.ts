import {test,expect  } from "@playwright/test";

test('Пустые поля логина и пароля не создают сессию', async ({ page }) => {
    await page.goto('/login');

    await page.getByTestId('login-submit').click();

    await expect(page.getByText('Ошибка')).toBeVisible();
    await expect(page.getByTestId('app-error-code')).toHaveText('VALIDATION');
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByTestId('role-badge')).toHaveCount(0);
});