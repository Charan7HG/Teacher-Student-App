const { test, expect } = require('@playwright/test');

const teacherEmail =
  process.env.PLAYWRIGHT_TEACHER_EMAIL || 'teacher@test.com';

const teacherPassword =
  process.env.PLAYWRIGHT_TEACHER_PASSWORD || 'Teacher@123';

test('Teacher can login successfully', async ({ page }) => {
  await page.goto('/login');

  await page.getByLabel('Email').fill(teacherEmail);
  await page.getByLabel('Password').fill(teacherPassword);
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page).toHaveURL(/dashboard/);
  await expect(
    page.getByRole('heading', { name: 'Teacher Dashboard' })
  ).toBeVisible();
});

test('Teacher cannot login with invalid password', async ({ page }) => {
  await page.goto('/login');

  await page.getByLabel('Email').fill(teacherEmail);
  await page.getByLabel('Password').fill('WrongPassword@123');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page).not.toHaveURL(/\/dashboard/);
  await expect(
    page.getByText('Invalid email or password')
  ).toBeVisible();
});