const { test, expect } = require('@playwright/test');

// Automatically create the teacher account before any login test runs
test.beforeEach(async ({ page }) => {
  // Navigate to your registration page
  await page.goto('/register'); 

  // Fill in the sign-up form fields
  // Note: Adjust placeholder or label selectors if they differ on your register page
  await page.fill('input[type="text"]', 'Test Teacher'); 
  await page.fill('input[type="email"]', 'teacher@test.com');
  await page.fill('input[type="password"]', 'Teacher@123');

  // Submit the registration form
  await page.getByRole('button', { name: /register|sign up/i }).click();

  // Wait 1 second for the backend API to finish saving the user to the database
  await page.waitForTimeout(1000); 
});

test('Teacher can login successfully', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Email').fill('teacher@test.com');
  await page.getByLabel('Password').fill('Teacher@123');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page).toHaveURL(/dashboard/);
  await expect(page.getByRole('heading', { name: 'Teacher Dashboard' })).toBeVisible();
});

test('Teacher cannot login with invalid password', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Email').fill('teacher@test.com');
  await page.getByLabel('Password').fill('WrongPassword@123');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page).not.toHaveURL(/\/dashboard/);
  await expect(page.getByText('Invalid email or password')).toBeVisible();
});
