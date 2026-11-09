import { expect, test } from "@playwright/test";

async function userAnna(page) {
    await page.goto('/login');
    
    await page.getByTestId('login-input').fill('anna');
    await page.getByTestId('password-input').fill('anna-pass');
    await page.getByTestId('login-submit').click();
    
    await expect(page).toHaveURL(/\/catalog/);
};


test('Успешный вход Анны', async ({ page }) => {
    await userAnna(page);

    await expect(page.getByTestId('role-badge')).toHaveText('user');
    await expect(page.getByTestId('nav-admin-products')).toHaveCount(0);
});

test('Поиск по подстроке', async ({ page }) => {
    await userAnna(page);
    
    const search = page.getByTestId('catalog-search');
    await search.fill('тетра');
    await search.press('Enter');
    
    await expect(page).toHaveURL(/q=/);
        
    const namesLocator = page.getByTestId('catalog-row');
    const names = await namesLocator.allTextContents();
        
    if (names.length === 0) return;
        
    const missing = names.filter(name => !name.toLowerCase().includes('тетра'));
    expect(missing).toHaveLength(0);
        
});

test('Профиль Анны не пустой', async ({ page }) => {
    await userAnna(page);

    await page.getByTestId('nav-profile').click();

    await expect(page).toHaveURL(/\/profile/);

    await expect(page.getByTestId('profile-form')).toBeVisible();

    await expect(page.getByTestId('profile-first-name')).not.toHaveValue('');
    await expect(page.getByTestId('profile-last-name')).not.toHaveValue('');
    await expect(page.getByTestId('profile-email')).not.toHaveValue('');
});