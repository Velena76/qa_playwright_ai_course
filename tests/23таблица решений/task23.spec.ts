import { expect, test } from "@playwright/test";

async function userAnna(page) {
    await page.goto('/login');

    await page.getByTestId('login-input').fill('anna');
    await page.getByTestId('password-input').fill('anna-pass');
    await page.getByTestId('login-submit').click();

    await expect(page).toHaveURL(/\/catalog/);
};


test('пустой поиск и все категории', async ({ page }) => {
    await userAnna(page);

    const catalogSearch = await page.getByTestId('catalog-search');
    await catalogSearch.fill('');
    await catalogSearch.press('Enter');

    await page.getByTestId('catalog-category').selectOption('all');

    await expect(page).toHaveURL(/\/catalog/);

});

test('пустой поиск и выбранная категория', async ({ page }) => {
    await userAnna(page);

    const catalogSearch = await page.getByTestId('catalog-search');
    await catalogSearch.fill('');
    await catalogSearch.press('Enter');

    await page.getByTestId('catalog-category').selectOption('paper');

    const rows = page.getByTestId('catalog-row');
    await expect(rows).not.toHaveCount(0);

    const rowCount = await rows.count();
    for (let i = 0; i < rowCount; i++) {
        const categoryCell = rows.nth(i).locator("td:nth-child(2)");
        const text = await categoryCell.textContent();
        expect(text?.trim()).toBe('paper');
    }
    await expect(page.getByTestId('app-error')).toBeHidden();
});

test('непустой поиск и категории все', async ({ page }) => {
    await userAnna(page);

    const catalogSearch = await page.getByTestId('catalog-search');
    await catalogSearch.fill('тетрадь');
    await catalogSearch.press('Enter');

    await page.getByTestId('catalog-category').selectOption('all');

    const rows = page.getByTestId('catalog-row');
    await expect(rows).not.toHaveCount(0);

    const rowCount = await rows.count();
    for (let i = 0; i < rowCount; i++) {
        const categoryCell = rows.nth(i).locator("td:nth-child(1)");
        const text = await categoryCell.textContent();
        expect(text?.trim().toLowerCase()).toContain("тетрадь");
    }
    await expect(page.getByTestId('app-error')).toBeHidden();
});

test('невалидное значение поиска дает пустую таблицу', async ({ page }) => {
    await userAnna(page);

    await page.getByTestId('catalog-search').fill('56');
    await page.getByTestId('catalog-search').press('Enter');

    await page.getByTestId('catalog-category').selectOption('all');

    await expect(page.getByTestId('catalog-row')).toHaveCount(0);
    await expect(page.getByTestId('catalog-empty')).toBeVisible();
    await expect(page.getByTestId('app-error')).toBeHidden();
});
