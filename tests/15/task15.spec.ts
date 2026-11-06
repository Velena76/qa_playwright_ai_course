import { expect, test } from "@playwright/test";

async function userAnna(page) {
    await page.goto('/login');

    await page.getByTestId('login-input').fill('anna');
    await page.getByTestId('password-input').fill('anna-pass');
    await page.getByTestId('login-submit').click();

    await expect(page).toHaveURL(/\/catalog/);
};


test('после выхода прямой переход в каталог через goto невозможен,ведет на страницу входа', async ({ page }) => {
    await userAnna(page);

    await page.getByTestId('nav-logout').click();
    await expect(page).toHaveURL(/\/login/);

    await page.goto('/catalog');

    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByTestId('login-form')).toBeVisible();
});

test('после выхода из каталога нажатие "назад" не показывает каталог', async ({ page }) => {
    await userAnna(page);

    await page.getByTestId('nav-logout').click();
    await expect(page).toHaveURL(/\/login/);
    //Сессия уничтожена на сервере.
    //Токен / куки удалены на клиенте.
    //Браузер перешёл на страницу входа.
    //Важно: в истории браузера / catalog всё ещё есть — он был посещён до выхода.

    await page.goBack();//симулирует нажатие кнопки «← Назад» в браузере.

    await expect(page.getByTestId('login-form')).toBeVisible({ timeout: 10000 });
    //Увеличенный таймаут нужен, т.к. браузеру нужно:
    //1.Восстановить страницу из истории.
    //2.Выполнить JavaScript, который проверит авторизацию.
    //3.Сделать редирект на / login.
    //4.Отрисовать форму.
    //приложение должно понять, что токена больше нет, и принудительно вернуть пользователя на /login, даже если он пытается вернуться назад.

    await expect(page.getByTestId('nav-logout')).toHaveCount(0);
});