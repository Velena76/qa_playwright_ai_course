import { expect, test } from "@playwright/test";

test(' Корректное отображение страницы каталога и наличие пагинации', async ({ page }) => {

    await page.goto('/login');
    await page.getByTestId('login-input').fill('anna');
    await page.getByTestId('password-input').fill('anna-pass');
    await page.getByTestId('login-submit').click();

    await expect(page).toHaveURL(/\/catalog/);
    await expect(page.getByTestId('catalog-row')).toHaveCount(10);
    await expect(page.getByTestId('catalog-pagination')).toBeVisible();
    await expect(page.getByTestId('app-arror')).toBeHidden();
});