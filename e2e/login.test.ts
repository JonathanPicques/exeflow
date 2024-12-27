import {expect, test} from '@playwright/test';

test('login page to contain logo', async ({page}) => {
    await page.goto('/auth/login');
    expect(page).toHaveURL('/auth/login');
    await expect(page.getByRole('link', {name: 'Exeflow logo'})).toBeVisible();
});

test('login page fill form with incorrect credentials', async ({page}) => {
    await page.goto('/auth/login');
    expect(page).toHaveURL('/auth/login');
    await page.getByRole('textbox', {name: 'Email'}).fill('unknown@gmail.com');
    await page.getByRole('textbox', {name: 'Password'}).fill('incorrect_assword');
    await page.getByRole('button', {name: 'Login'}).click();
    await page.waitForURL('/auth/login', {waitUntil: 'load'});
    // expect(page.getByText('Invalid login credentials')).toBeVisible();
});
