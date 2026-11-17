import { expect, test } from "@playwright/test";

async function adminKira(page) {
    await page.goto('/login');

    await page.getByTestId('login-input').fill('kira');
    await page.getByTestId('password-input').fill('kira-admin');
    await page.getByTestId('login-submit').click();

    await expect(page).toHaveURL(/\/catalog/);

    await page.getByTestId('nav-admin-products').click();
    await expect(page.getByTestId('admin-product-form')).toBeVisible();
};

async function fillProductForm(page, fields) {//ф-я только объявляется, объ-т создается при вызове
    await page.getByTestId('admin-product-name').fill(fields.name ?? '');
    await page.getByTestId('admin-product-price').fill(String(fields.price ?? 10000));
    await page.getByTestId('admin-product-stock').fill(String(fields.stock ?? 10));
    await page.getByTestId('admin-product-category').selectOption(fields.category ?? 'other');
    await page.getByTestId('admin-product-description').fill(fields.description ?? 'тестовое описание');

    await page.getByTestId('admin-product-save').click();
}


test('цена минимальная', async ({ page }) => {
    await adminKira(page);

    const name = `price-min:${'0'}`;
    await fillProductForm(page, { name, price: 0 });

    await expect(page.getByTestId('admin-product-row').filter({ hasText: name })).toBeVisible();
});

test('цена ниже минимальной', async ({ page }) => {
    await adminKira(page);

    const name = `price-less-min:${'-1'}`;
    await fillProductForm(page, { name, price: -1 });
    const priceInput = page.getByTestId('admin-product-price');
    await expect(priceInput).toHaveJSProperty('validity.rangeUnderflow', true);//значение меньше атрибута min=0

    await expect(priceInput).not.toHaveJSProperty('validationMessage', '');//тултип сгенерирован,сообщение есть

    await expect(page.getByTestId('admin-product-row').filter({ hasText: name })
    ).not.toBeVisible();//форма не отправилась,товар не появился в списке
});

test('цена максимальная', async ({ page }) => {
    await adminKira(page);

    const name = `price-max:${'1000000'}`;
    await fillProductForm(page, { name, price:1000000 });

    await expect(page.getByTestId('admin-product-row').filter({ hasText: name })).toBeVisible();
});


test('цена выше максимума', async ({ page }) => {
    await adminKira(page);

    const name = `price-more-max:${Date.now()}`;
    await fillProductForm(page, { name, price: 1100000 });
    const priceInput = page.getByTestId('admin-product-price');
    
    await expect(priceInput).toHaveJSProperty('validity.rangeOverflow', true);

    await expect(priceInput).not.toHaveJSProperty('validationMessage', '');

    await expect(page.getByTestId('admin-product-row').filter({ hasText: name })
    ).not.toBeVisible();
});
