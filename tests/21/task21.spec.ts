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


function fixedLengthName(prefix, length) {  //вспом-я ф-я генерация строки нужной длины
    const base = `${prefix}-${Date.now()}`;

    if (base.length >= length) {
        return base.slice(0, length);
    }
    return base.padEnd(length, 'x');
}

test('наименование товара-пустая строка, отказ', async ({ page }) => {
    await adminKira(page);

    await fillProductForm(page, { name: '' });

    await expect(page.getByTestId('app-error')).toBeVisible();
    await expect(page.getByTestId('app-error-code')).toHaveText('VALIDATION');
});

test('название - короткое валидное значение, сохраняется', async ({ page }) => {
    await adminKira(page);
    await fillProductForm(page, { name: 'тетрадь1' });//здесь создается объект и связывается с fields

    await expect(page.getByTestId('admin-product-row').filter({ hasText: 'тетрадь1' })).toBeVisible();//правильный синтаксис: передаём объект, где ключ — тип проверки, значение — текст.
});

test('название содержит 80 символов-макс.допустимое значение', async ({ page }) => {
    await adminKira(page);

    const name = fixedLengthName('name80', 80);
    await fillProductForm(page, { name });

    await expect(page.getByTestId('admin-product-row').filter({ hasText: name })).toBeVisible();
});

test('название содержит 81 символ - больше допустимого максимума', async ({ page }) => {
    await adminKira(page);

    const name = fixedLengthName('name81', 81);
    await fillProductForm(page, { name });

    await expect(page.getByTestId('app-error-code')).toHaveText('VALIDATION');
});