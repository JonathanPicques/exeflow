import {expect, test} from '@playwright/test';

test('welcome page to contain logo', async ({page}) => {
    await page.goto('/');
    await expect(page.getByRole('link', {name: 'Exeflow logo'})).toBeVisible();
});

test('welcome page to contain github logo', async ({page}) => {
    await page.goto('/');
    await expect(page.getByRole('link', {name: 'Exeflow Github repo'})).toBeVisible();
});

test('welcome page to contain getting started CTA', async ({page}) => {
    await page.goto('/');
    await expect(page.getByRole('button', {name: 'Get started now!'})).toBeVisible();
});
