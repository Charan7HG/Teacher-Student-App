const { test, expect } = require('@playwright/test');
const {
  loginAsTeacher,
  registerStudent
} = require('./support/student-workflows');

function createSortingStudent(label, runId) {
  return {
    name: `Playwright Sort ${runId} ${label} Student`,
    email: `sort.${label.toLowerCase()}.${runId}@test.com`,
    phone: '9876543210',
    course: 'cse',
    section: 'A',
    city: 'Bangalore',
    address: `123 Sort ${label} Avenue`
  };
}

test('Teacher can sort students by name in ascending and descending order', async ({ page }) => {
  const runId = Date.now();
  const alphabeticallyFirst = createSortingStudent('Alpha', runId);
  const alphabeticallyLast = createSortingStudent('Zulu', runId);

  await loginAsTeacher(page);
  await registerStudent(page, alphabeticallyLast);
  await registerStudent(page, alphabeticallyFirst);
  await page.goto('/students');

  const searchInput = page.getByPlaceholder('Search by name or email');
  await searchInput.fill(`Playwright Sort ${runId}`);

  const rows = page.locator('tbody tr');
  await expect(rows).toHaveCount(2);
  await expect(rows.nth(0)).toContainText(alphabeticallyFirst.name);
  await expect(rows.nth(1)).toContainText(alphabeticallyLast.name);
  await expect(page.getByRole('button', {
    name: 'Sort by student name descending'
  })).toContainText('↑');

  await page.getByRole('button', {
    name: 'Sort by student name descending'
  }).click();

  await expect(rows.nth(0)).toContainText(alphabeticallyLast.name);
  await expect(rows.nth(1)).toContainText(alphabeticallyFirst.name);
  await expect(page.getByRole('button', {
    name: 'Sort by student name ascending'
  })).toContainText('↓');
});
