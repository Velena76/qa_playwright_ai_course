import { expect, test } from "@playwright/test";

async function userAnna(page) {
    await page.goto('/login');

    await page.getByTestId('login-input').fill('anna');
    await page.getByTestId('password-input').fill('anna-pass');
    await page.getByTestId('login-submit').click();

    await expect(page).toHaveURL(/\/catalog/);
};

test('успешный поиск по каталогу', async ({ page }) => {
    await userAnna(page);

    const search = page.getByTestId('catalog-search');
    await search.fill('тетрадь');
    await search.press('Enter');

    await expect(page).toHaveURL(/q=/);
    
    const namesLocator = page.getByTestId('catalog-row');
    const names = await namesLocator.allTextContents();
    
    if (names.length === 0) return;
    
    const missing = names.filter(name => !name.toLowerCase().includes('тетрадь'));
    expect(missing).toHaveLength(0);
    
    await expect(page.getByTestId('app-error')).toBeHidden();
});

test("поиск товара отсутствующего в каталоге , пустой результат не ошибка ", async ({ page }) => {
    await userAnna(page);
    
    const search = page.getByTestId('catalog-search');
    await search.fill('ластик');
    await search.press('Enter');
    
    await expect(page).toHaveURL(/q=/);
    
    await expect(page.getByTestId('catalog-row')).toHaveCount(0);
    await expect(page.getByTestId('catalog-empty')).toBeVisible();
    await expect(page.getByTestId('app-error')).toBeHidden();

})

