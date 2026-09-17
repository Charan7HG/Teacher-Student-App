const { test, expect } = require('@playwright/test');
const {
  createStudentData,
  loginAsTeacher,
  openStudentRow,
  registerStudent
} = require('./support/student-workflows');

test('Teacher can search for a student in the student list', async ({ page }) => {
  const student = createStudentData('Search');

  await loginAsTeacher(page);
  await registerStudent(page, student);
  await page.goto('/students');

  await expect(page.getByRole('heading', { name: 'Students' })).toBeVisible();
  await expect(page.locator('table')).toBeVisible();

  const searchInput = page.getByPlaceholder('Search by name or email');
  await searchInput.fill(student.name);

  const matchingRow = await openStudentRow(page, student);
  await expect(matchingRow).toContainText(student.email);
  await expect(page.locator('tbody tr')).toHaveCount(1);
});

test('Student search shows a no-results message for an unknown student', async ({ page }) => {
  const student = createStudentData('NegativeSearch');

  await loginAsTeacher(page);
  await registerStudent(page, student);
  await page.goto('/students');

  await page.getByPlaceholder('Search by name or email').fill('does-not-exist@example.com');

  await expect(page.getByText(/No students found matching/)).toBeVisible();
  await expect(page.locator('tbody tr')).toHaveCount(0);
});