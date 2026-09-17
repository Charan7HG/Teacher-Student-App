const { expect } = require('@playwright/test');

async function loginAsTeacher(page) {
  await page.goto('/login');
  await page.getByLabel('Email').fill('teacher@test.com');
  await page.getByLabel('Password').fill('Teacher@123');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page).toHaveURL(/dashboard/);
  await expect(page.getByRole('heading', { name: 'Teacher Dashboard' })).toBeVisible();
}

async function registerStudent(page, student) {
  await page.goto('/register-student');
  await expect(page.getByRole('heading', { name: 'Register Student' })).toBeVisible();

  await page.getByLabel('Student Name').fill(student.name);
  await page.getByLabel('Email').fill(student.email);
  await page.getByLabel('Phone Number').fill(student.phone);
  await page.getByRole('radio', { name: 'Male', exact: true }).check();
  await page.getByLabel('Course').selectOption(student.course || 'cse');

  await page.getByRole('button', { name: 'Select section' }).click();
  await page.getByRole('option', { name: `Section ${student.section || 'A'}` }).click();

  await page.getByRole('checkbox', { name: 'Java' }).check();
  await page.getByLabel('Date of Birth').fill(student.dob || '2000-01-15');
  await page.getByPlaceholder('Type to search city').fill(student.city || 'Bang');
  await page.getByRole('option', { name: student.city || 'Bangalore' }).click();
  await page.getByLabel('Address').fill(student.address || '123 Playwright Avenue');

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
}

function createStudentData(prefix) {
  const uniqueId = `${prefix}.${Date.now()}`;

  return {
    name: `Playwright ${uniqueId} Student`,
    email: `${uniqueId}@test.com`,
    phone: '9876543210',
    course: 'cse',
    section: 'A',
    city: 'Bangalore',
    address: `123 ${prefix} Avenue`
  };
}

async function openStudentRow(page, student) {
  await page.getByPlaceholder('Search by name or email').fill(student.email);
  const row = page.locator('tbody tr').filter({ hasText: student.email });
  await expect(row).toContainText(student.name);
  return row;
}

async function bypassStudentListCache(page) {
  await page.route('**/api/students', async (route) => {
    if (route.request().method() === 'GET') {
      const url = new URL(route.request().url());
      url.searchParams.set('refresh', Date.now().toString());
      await route.continue({ url: url.toString() });
      return;
    }

    await route.continue();
  });
}

module.exports = {
  bypassStudentListCache,
  createStudentData,
  loginAsTeacher,
  openStudentRow,
  registerStudent
};