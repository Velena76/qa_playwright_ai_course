import { expect, test } from "@playwright/test";
test("успешная авторизация пользователя", async ({ page }) => {

    await test.step('открыть страницу входа', async () => {

        await page.goto('/login');
        await expect(page.getByTestId('login-input')).toBeVisible();
    });

    await test.step('ввести логин и пароль', async () => {
        await page.getByTestId('login-input').fill('anna');
        await page.getByTestId('password-input').fill('anna-pass');
    });

    await test.step('нажать кнопку входа', async () => {
        await page.getByTestId('login-submit').click();
    });
    await test.step('проверить каталог и шапку покупателя', async () => {
        await expect(page).toHaveURL(/\/catalog/);
        await expect(page.getByTestId('role-badge')).toHaveText('user');
        await expect(page.getByTestId('nav-admin-products')).toHaveCount(0);
        await expect(page.getByTestId('app-error')).toBeHidden();
    });
});