import { expect, test } from "@playwright/test";

async function userAnna(page) {
    await page.goto('/login');

    await page.getByTestId('login-input').fill('anna');
    await page.getByTestId('password-input').fill('anna-pass');
    await page.getByTestId('login-submit').click();

    await expect(page).toHaveURL(/\/catalog/);
};

test('выбор категории оставляет только товары этой категории', async ({ page }) => {
    await userAnna(page);

    await page.getByTestId('catalog-category').selectOption('notebooks');

    const rows = page.getByTestId('catalog-row');
    await expect(rows).not.toHaveCount(0);

    const rowCount = await rows.count();
    for (let i = 0; i < rowCount; i++) {
        const categoryCell = rows.nth(i).locator("td:nth-child(2)");
        const text = await categoryCell.textContent();
        expect(text?.trim()).toBe("notebooks");
    }
    await expect(page.getByTestId('app-error')).toBeHidden();
});