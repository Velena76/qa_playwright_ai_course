import { expect, test } from "@playwright/test";

async function userAnna(page) {
    await page.goto('/login');

    await page.getByTestId('login-input').fill('anna');
    await page.getByTestId('password-input').fill('anna-pass');
    await page.getByTestId('login-submit').click();

    await expect(page).toHaveURL(/\/catalog/);
};


test('SMOKE:возможность пользоваться витриной', async ({ page }) => {

    await test.step('вход на страницу каталога', async () => {
        await userAnna(page);
    });

    await test.step('видна хотя бы одна строка товара', async () => {
        await expect(page.getByTestId('catalog-row').first()).toBeVisible();
    });

    await test.step('выход из каталога', async () => {
        await page.getByTestId('nav-logout').click();
        await expect(page).toHaveURL(/\/login/);
    });
});


`/**   Цель смоук‑теста — быстро ответить на один главный вопрос: «Можно ли вообще пользоваться витриной?»
 То есть проверить, что базовая функциональность работает, а не тестировать всё подряд.

Что он НЕ должен делать: не проверять все правила каталога, не трогать сортировку, пагинацию, профиль и карточки товаров —
 это задачи других тестов (например, функциональных или регрессионных).

Важное правило: смоук должен быть коротким. 
Если он разрастается и становится долгим, его начинают пропускать — и тогда теряется весь смысл: мы перестаём быстро узнавать, «жив» ли релиз.  */`