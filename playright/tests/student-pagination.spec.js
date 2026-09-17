const { test, expect } = require('@playwright/test');
const {
  loginAsTeacher,
  registerStudent
} = require('./support/student-workflows');

function createPaginationStudent(index, runId) {
  return {
    name: `Playwright Pagination ${runId} ${index} Student`,
    email: `pagination.${runId}.${index}@test.com`,
    phone: `9876543${String(100 + index)}`,
    course: 'cse',
    section: 'A',
    city: 'Bangalore',
    address: `123 Pagination ${index} Avenue`
  };
}

test('Teacher can paginate student list results', async ({ page }) => {
  const runId = Date.now();
  const students = Array.from({ length: 6 }, (_, index) =>
    createPaginationStudent(index + 1, runId)
  );

  await loginAsTeacher(page);
  for (const student of students) {
    await registerStudent(page, student);
  }
  await page.goto('/students');

  await page.getByPlaceholder('Search by name or email').fill(`Playwright Pagination ${runId}`);

  const rows = page.locator('tbody tr');
  await expect(rows).toHaveCount(5);
  await expect(page.getByText('Page 1 of 2')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Previous page' })).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Next page' })).toBeEnabled();

  await page.getByRole('button', { name: 'Next page' }).click();

  await expect(rows).toHaveCount(1);
  await expect(page.getByText('Page 2 of 2')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Previous page' })).toBeEnabled();
  await expect(page.getByRole('button', { name: 'Next page' })).toBeDisabled();
});

test('Student search resets pagination to the first page', async ({ page }) => {
  const runId = Date.now();
  const students = Array.from({ length: 6 }, (_, index) =>
    createPaginationStudent(index + 1, runId)
  );

  await loginAsTeacher(page);
  for (const student of students) {
    await registerStudent(page, student);
  }
  await page.goto('/students');

  const searchInput = page.getByPlaceholder('Search by name or email');
  await searchInput.fill(`Playwright Pagination ${runId}`);
  await page.getByRole('button', { name: 'Next page' }).click();
  await expect(page.getByText('Page 2 of 2')).toBeVisible();

  await searchInput.fill(students[0].email);

  await expect(page.getByText('Page 1 of 1')).toBeVisible();
  await expect(page.locator('tbody tr')).toHaveCount(1);
  await expect(page.locator('tbody tr').filter({ hasText: students[0].email }))
    .toContainText(students[0].name);
  await expect(page.getByRole('button', { name: 'Previous page' })).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Next page' })).toBeDisabled();
});
