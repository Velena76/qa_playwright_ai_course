import {test,expect} from "@playwright/test";

test.only('Проверка видимости элементов страницы', async ({ page }) => {
    await page.goto('/login');

    await expect(page.getByTestId('login-form')).toBeVisible();
});