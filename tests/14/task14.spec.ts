import { expect, test } from "@playwright/test";

async function userAnna(page) {
    await page.goto('/login');

    await page.getByTestId('login-input').fill('anna');
    await page.getByTestId('password-input').fill('anna-pass');
    await page.getByTestId('login-submit').click();

    await expect(page).toHaveURL(/\/catalog/);
};


test('открытый профиль показывает данные пользователя', async ({ page }) => {
    await userAnna(page);

    await page.getByTestId('nav-profile').click();

    await expect(page).toHaveURL(/\/profile/);

    await expect(page.getByTestId('profile-form')).toBeVisible();

    await expect(page.getByTestId('profile-first-name')).not.toHaveValue('');
    await expect(page.getByTestId('profile-last-name')).not.toHaveValue('');
    await expect(page.getByTestId('profile-email')).not.toHaveValue('');
});

//для inputa правильно спрашивать 'какое значение лежит в поле' а не какой текст