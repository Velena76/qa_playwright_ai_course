import {test,expect} from "@playwright/test";

test('форма входа со сломанным селектором', async ({ page }) => {
    await page.goto('/login');

    await expect(page.getByTestId('login-form')).toBeVisible();
    await expect(page.getByTestId('login-input-spot')).toBeVisible();
    await expect(page.getByTestId('password-input')).toBeVisible();
    await expect(page.getByTestId('login-submit')).toBeVisible();
});


test('форма входа с исправленным селектором', async ({ page }) => {
    await page.goto('/login');

    await expect(page.getByTestId('login-form')).toBeVisible();
    await expect(page.getByTestId('login-input')).toBeVisible();
    await expect(page.getByTestId('password-input')).toBeVisible();
    await expect(page.getByTestId('login-submit')).toBeVisible();
});

`/** Со сломанным локатором .getByTestId('login-input-spot') тест падает с ошибкой - проверка не пройдена, 
элемент не найден */`;