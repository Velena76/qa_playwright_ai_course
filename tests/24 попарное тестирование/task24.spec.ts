import { expect, test } from "@playwright/test";
import { beforeEach } from "node:test";

test.beforeEach('', async ({ page }) => {
    await page.goto('/login');

    await page.getByTestId('login-input').fill('anna');
    await page.getByTestId('password-input').fill('anna-pass');
    await page.getByTestId('login-submit').click();

    await expect(page).toHaveURL(/\/catalog/);
});


test('пустой поиск,все категории,name:asc', async ({ page }) => {

    const catalogSearch = await page.getByTestId('catalog-search');
    await catalogSearch.fill('');
    await catalogSearch.press('Enter');

    await page.getByTestId('catalog-category').selectOption('all');

    await page.getByTestId('catalog-sort').selectOption('name:asc');
    
    await expect(page).toHaveURL(/\/catalog/);
    
});

test('пустой поиск,выбранная категория,name:desc', async ({ page }) => {
    
    const catalogSearch = await page.getByTestId('catalog-search');
    await catalogSearch.fill('');
    await catalogSearch.press('Enter');
    
    await page.getByTestId('catalog-category').selectOption('pens');
    await page.getByTestId('catalog-sort').selectOption('name:desc');
    
    const rows = page.getByTestId('catalog-row');
    await expect(rows).not.toHaveCount(0);
    
    const rowCount = await rows.count();
    for (let i = 0; i < rowCount; i++) {
        const categoryCell = rows.nth(i).locator("td:nth-child(2)");
        const text = await categoryCell.textContent();
        expect(text?.trim()).toBe('pens');
    }
    
});

test('непустой поиск и категории все', async ({ page }) => {
    
    const catalogSearch = await page.getByTestId('catalog-search');
    await catalogSearch.fill('тетрадь');
    await catalogSearch.press('Enter');
    
    await page.getByTestId('catalog-category').selectOption('all');
    await page.getByTestId('catalog-sort').selectOption('price:asc');

    const rows = page.getByTestId('catalog-row');
    await expect(rows).not.toHaveCount(0);

    const rowCount = await rows.count();
    for (let i = 0; i < rowCount; i++) {
        const categoryCell = rows.nth(i).locator("td:nth-child(1)");
        const text = await categoryCell.textContent();
        expect(text?.trim().toLowerCase()).toContain("тетрадь");
    }

});


test('непустой поиск, категория выбрана,price:desc ', async ({ page }) => {

    const catalogSearch = await page.getByTestId('catalog-search');
    await catalogSearch.fill('тетрадь');
    await catalogSearch.press('Enter');

    await page.getByTestId('catalog-category').selectOption('pens');
    await page.getByTestId('catalog-sort').selectOption('price:desc');

    const rows = page.getByTestId('catalog-row');
    await expect(rows).not.toHaveCount(0);

    const rowCount = await rows.count();
    for (let i = 0; i < rowCount; i++) {
        const categoryCell = rows.nth(i).locator("td:nth-child(1)");
        const text = await categoryCell.textContent();
        expect(text?.trim().toLowerCase()).toContain("тетрадь");
    }
    for (let i = 0; i < rowCount; i++) {
        const categoryCell = rows.nth(i).locator("td:nth-child(2)");
        const textName = await categoryCell.textContent();
        expect(textName?.trim()).toBe('pens');
    }
});