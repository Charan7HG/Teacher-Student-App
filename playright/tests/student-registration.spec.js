const { test, expect } = require('@playwright/test');

test('Teacher can register a student successfully', async ({ page }) => {
  const studentEmail = `playwright.student.${Date.now()}@test.com`;

  await page.goto('/login');
  await page.getByLabel('Email').fill('teacher@test.com');
  await page.getByLabel('Password').fill('Teacher@123');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page).toHaveURL(/dashboard/);
  await expect(page.getByRole('heading', { name: 'Teacher Dashboard' })).toBeVisible();

  await page.goto('/register-student');
  await expect(page.getByRole('heading', { name: 'Register Student' })).toBeVisible();

  await page.getByLabel('Student Name').fill('Playwright Test Student');
  await page.getByLabel('Email').fill(studentEmail);
  await page.getByLabel('Phone Number').fill('9876543210');
  await page.getByRole('radio', { name: 'Male', exact: true }).check();
  await page.getByLabel('Course').selectOption('cse');

  await page.getByRole('button', { name: 'Select section' }).click();
  await page.getByRole('option', { name: 'Section A' }).click();

  await page.getByRole('checkbox', { name: 'Java' }).check();
  await page.getByLabel('Date of Birth').fill('2000-01-15');

  await page.getByPlaceholder('Type to search city').fill('Bang');
  await page.getByRole('option', { name: 'Bangalore' }).click();

  await page.getByLabel('Address').fill('123 Playwright Avenue');

  const dialogPromise = new Promise((resolve, reject) => {
    page.once('dialog', async (dialog) => {
      try {
        expect(dialog.message()).toBe('Student registration successful!');
        await dialog.accept();
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  });

  await page.getByRole('button', { name: 'Register Student' }).click();
  await dialogPromise;

  await page.goto('/students');
  await expect(page.getByRole('heading', { name: 'Students' })).toBeVisible();

  await page.getByPlaceholder('Search by name or email').fill(studentEmail);
  const studentRow = page.locator('tbody tr').filter({ hasText: studentEmail });
  await expect(studentRow).toContainText('Playwright Test Student');
  await expect(studentRow).toContainText(studentEmail);
});

test('Student registration shows validation messages for empty required fields', async ({ page }) => {
  await page.goto('/register-student');
  await expect(page.getByRole('heading', { name: 'Register Student' })).toBeVisible();

  await page.getByRole('button', { name: 'Register Student' }).click();

  await expect(page.getByText('Student name is required', { exact: true })).toBeVisible();
  await expect(page.getByText('Email is required', { exact: true })).toBeVisible();
  await expect(page.getByText('Phone number is required', { exact: true })).toBeVisible();
  await expect(page.getByText('Please select gender', { exact: true })).toBeVisible();
  await expect(page.getByText('Please select a course', { exact: true })).toBeVisible();
  await expect(page.getByText('Please select a section', { exact: true })).toBeVisible();
  await expect(page.getByText('Select at least one skill', { exact: true })).toBeVisible();
  await expect(page.getByText('Date of birth is required', { exact: true })).toBeVisible();
  await expect(page.getByText('City is required', { exact: true })).toBeVisible();
  await expect(page.getByText('Address is required', { exact: true })).toBeVisible();
});

test('Student registration shows validation for invalid email', async ({ page }) => {
  await page.goto('/register-student');

  await page.getByLabel('Student Name').fill('Playwright Test Student');
  await page.getByLabel('Email').fill('invalid-email');
  await page.getByLabel('Phone Number').fill('9876543210');
  await page.getByRole('radio', { name: 'Male', exact: true }).check();
  await page.getByLabel('Course').selectOption('cse');

  await page.getByRole('button', { name: 'Select section' }).click();
  await page.getByRole('option', { name: 'Section A' }).click();

  await page.getByRole('checkbox', { name: 'Java' }).check();
  await page.getByLabel('Date of Birth').fill('2000-01-15');

  await page.getByPlaceholder('Type to search city').fill('Bang');
  await page.getByRole('option', { name: 'Bangalore' }).click();

  await page.getByLabel('Address').fill('123 Playwright Avenue');

  let successDialogShown = false;
  page.on('dialog', async (dialog) => {
    if (dialog.message() === 'Student registration successful!') {
      successDialogShown = true;
    }
    await dialog.dismiss();
  });

  await page.getByRole('button', { name: 'Register Student' }).click();

  await expect(page.getByText('Enter a valid email address', { exact: true })).toBeVisible();
  expect(successDialogShown).toBe(false);
});

test('Student registration shows validation for invalid phone number', async ({ page }) => {
  const studentEmail = `playwright.phone.${Date.now()}@test.com`;

  await page.goto('/register-student');

  await page.getByLabel('Student Name').fill('Playwright Test Student');
  await page.getByLabel('Email').fill(studentEmail);
  await page.getByLabel('Phone Number').fill('12345');
  await page.getByRole('radio', { name: 'Male', exact: true }).check();
  await page.getByLabel('Course').selectOption('cse');

  await page.getByRole('button', { name: 'Select section' }).click();
  await page.getByRole('option', { name: 'Section A' }).click();

  await page.getByRole('checkbox', { name: 'Java' }).check();
  await page.getByLabel('Date of Birth').fill('2000-01-15');

  await page.getByPlaceholder('Type to search city').fill('Bang');
  await page.getByRole('option', { name: 'Bangalore' }).click();

  await page.getByLabel('Address').fill('123 Playwright Avenue');
  await page.getByRole('button', { name: 'Register Student' }).click();

  await expect(page.getByText('Phone number must be 10 digits', { exact: true })).toBeVisible();
});

test('Student registration shows validation when email already exists', async ({ page }) => {
  const studentEmail = `playwright.duplicate.${Date.now()}@test.com`;

  await page.goto('/register-student');

  await page.getByLabel('Student Name').fill('First Playwright Student');
  await page.getByLabel('Email').fill(studentEmail);
  await page.getByLabel('Phone Number').fill('9876543210');
  await page.getByRole('radio', { name: 'Male', exact: true }).check();
  await page.getByLabel('Course').selectOption('cse');

  await page.getByRole('button', { name: 'Select section' }).click();
  await page.getByRole('option', { name: 'Section A' }).click();

  await page.getByRole('checkbox', { name: 'Java' }).check();
  await page.getByLabel('Date of Birth').fill('2000-01-15');

  await page.getByPlaceholder('Type to search city').fill('Bang');
  await page.getByRole('option', { name: 'Bangalore' }).click();

  await page.getByLabel('Address').fill('123 First Playwright Avenue');

  const firstSuccessDialog = page.waitForEvent('dialog');
  await page.getByRole('button', { name: 'Register Student' }).click();
  const successDialog = await firstSuccessDialog;
  expect(successDialog.message()).toBe('Student registration successful!');
  await successDialog.accept();

  await page.goto('/register-student');
  await page.getByLabel('Student Name').fill('Second Playwright Student');
  await page.getByLabel('Email').fill(studentEmail);
  await page.getByLabel('Phone Number').fill('9123456780');
  await page.getByRole('radio', { name: 'Female', exact: true }).check();
  await page.getByLabel('Course').selectOption('ise');

  await page.getByRole('button', { name: 'Select section' }).click();
  await page.getByRole('option', { name: 'Section B' }).click();

  await page.getByRole('checkbox', { name: 'SQL' }).check();
  await page.getByLabel('Date of Birth').fill('2001-02-16');

  await page.getByPlaceholder('Type to search city').fill('Mum');
  await page.getByRole('option', { name: 'Mumbai' }).click();

  await page.getByLabel('Address').fill('456 Second Playwright Avenue');

  let successDialogShown = false;
  const duplicateDialog = page.waitForEvent('dialog').then(async (dialog) => {
    successDialogShown = dialog.message() === 'Student registration successful!';
    const message = dialog.message();
    await dialog.dismiss();
    return message;
  });

  await page.getByRole('button', { name: 'Register Student' }).click();
  const duplicateMessage = await duplicateDialog;

  expect(duplicateMessage).toMatch(
    /^Student registration failed: Student email already exists$/
  );
  expect(successDialogShown).toBe(false);
});
