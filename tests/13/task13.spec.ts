import { expect, test } from "@playwright/test";

async function userAnna(page) {
    await page.goto('/login');

    await page.getByTestId('login-input').fill('anna');
    await page.getByTestId('password-input').fill('anna-pass');
    await page.getByTestId('login-submit').click();

    await expect(page).toHaveURL(/\/catalog/);
};

test('Открытая карточка показывает данные выбранной строки каталога ', async ({ page }) => {
    await userAnna(page);

    await expect(page.getByTestId('catalog-table')).toBeVisible();

    const firstRow = page.getByTestId('catalog-row').first();

    const name = await firstRow.getByRole('cell', { name: /тетрадь|блокнот/i }).textContent();//в строке ищем эл-ты с ролью ячейка и нужным именем
    expect(name).not.toBeNull();
    
    const price = await firstRow.locator('td', { hasText: '₽' }).textContent();//здесь ищем по css-селектору
    expect(price).not.toBeNull();
     
    await firstRow.click();

    await expect(page).toHaveURL(/\/catalog\/\d+/);

    const name2 = await page.getByTestId('product-title').textContent();
    expect(name?.trim()).toBe(name2?.trim());
    
    const price2 = await page.getByTestId('product-price').textContent();
    expect(price?.trim()).toBe(price2?.trim());

    
});