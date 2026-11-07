import { expect, test } from "@playwright/test";

test('без сессии нельзя открыть каталог', async ({ page }) => {

    await page.goto('/catalog');

    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByTestId('login-form')).toBeVisible();
    await expect(page.getByTestId('app-error')).toBeHidden();
});