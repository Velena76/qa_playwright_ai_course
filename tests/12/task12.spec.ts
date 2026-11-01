import { expect, test } from "@playwright/test";

async function userAnna(page) {
    await page.goto('/login');

    await page.getByTestId('login-input').fill('anna');
    await page.getByTestId('password-input').fill('anna-pass');
    await page.getByTestId('login-submit').click();

    await expect(page).toHaveURL(/\/catalog/);
};


test('Сортировка каталога по цене', async ({ page }) => {
    await userAnna(page);

    await page.getByTestId('catalog-sort').selectOption('price:asc');

    const rows = page.getByTestId('catalog-row');
    await expect(rows).toHaveCount(10);//ждем стабильное состояние таблицы

    await expect(page.getByTestId('app-error')).toBeHidden();

    const priceCells = rows.locator('td:nth-child(3)'); //получаем тексты ячеек с ценой(3 столбец)
    const rawPrice =await priceCells.allTextContents();

    if (rawPrice.length === 0) {
        throw new Error("В таблице не найдено ни одной строки с ценами");
    }

    // Функция парсинга: убирает всё кроме цифр и точки, превращает в число
    const parsePrice = (text: string): number => {
        const cleaned = text.replace(/[^\d.]/g, "");
        return cleaned ? parseFloat(cleaned) : 0;
    };

    const prices = rawPrice.map(parsePrice);


    //  Сравнивает их как числа: каждый следующий >= предыдущего (нестрогое возрастание)
    for (let i = 1; i < prices.length; i++) {
        expect(
            prices[i],
            `Цена в строке ${i + 1} (${prices[i]}) меньше, чем в строке ${i} (${prices[i - 1]}). Сортировка нарушена.`
        ).toBeGreaterThanOrEqual(prices[i - 1]);//встроенный метод проверяет что число больше или равно ожидаемому
    }
});