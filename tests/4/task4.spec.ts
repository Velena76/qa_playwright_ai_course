import {test,expect} from "@playwright/test";

test('Проверка видимости элементов страницы входа', async ({ page }) => {
    await page.goto('/login');

    await expect(page.getByTestId('login-form')).toBeVisible();
    await expect(page.getByTestId('login-input')).toBeVisible();
    await expect(page.getByTestId('password-input')).toBeVisible();
    await expect(page.getByTestId('login-submit')).toBeVisible();
});
















`/**await page.goto('/login') Это относительный путь.Base URL обычно задаётся в конфиге Playwright(playwright.config.ts) через baseURL.
Например, если baseURL равен http://localhost:3000, то page.goto('/login') на самом деле откроет http://localhost:3000/login.*/`