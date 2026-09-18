const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/LoginPage');
const { DashboardPage } = require('./pages/DashboardPage');
const { StudentRegistrationPage } = require('./pages/StudentRegistrationPage');
const { StudentListPage } = require('./pages/StudentListPage');

const teacherEmail = process.env.PLAYWRIGHT_TEACHER_EMAIL || 'teacher@test.com';
const teacherPassword = process.env.PLAYWRIGHT_TEACHER_PASSWORD || 'Teacher@123';

function createStudentData(label, suffix = Date.now()) {
  const emailLabel = label.toLowerCase().replace(/\s+/g, '-');

  return {
    name: `Final ${label} Student ${suffix}`,
    email: `final.${emailLabel}.${suffix}@test.com`,
    phone: '9876543210',
    course: 'cse',
    section: 'A',
    city: 'Bangalore',
    address: `123 Final ${label} Avenue`
  };
}

async function login(page) {
  const loginPage = new LoginPage(page);
  await loginPage.open();
  await loginPage.login(teacherEmail, teacherPassword);

  const dashboardPage = new DashboardPage(page);
  await dashboardPage.expectVisible();
  return dashboardPage;
}

async function register(page, student) {
  const registrationPage = new StudentRegistrationPage(page);
  await page.goto('/register-student');
  await registrationPage.expectVisible();
  await registrationPage.fillStudent(student);
  await registrationPage.registerSuccessfully();
}

test.describe('Final Teacher-Student Management simulation', () => {
  test('teacher can log in and log out', async ({ page }) => {
    const dashboardPage = await login(page);
    await dashboardPage.logout();
    await expect(page.getByRole('heading', { name: 'Teacher Login' })).toBeVisible();
  });

  test('teacher cannot log in with an invalid password', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(teacherEmail, 'InvalidPassword@123');

    await expect(page).not.toHaveURL(/dashboard/);
    await loginPage.expectInvalidCredentialsMessage();
  });

  test('student registration validates required and invalid fields', async ({ page }) => {
    const registrationPage = new StudentRegistrationPage(page);
    await page.goto('/register-student');
    await registrationPage.expectVisible();
    await registrationPage.submitInvalidForm();

    for (const message of [
      'Student name is required',
      'Email is required',
      'Phone number is required',
      'Please select gender',
      'Please select a course',
      'Please select a section',
      'Select at least one skill',
      'Date of birth is required',
      'City is required',
      'Address is required'
    ]) {
      await registrationPage.expectValidationMessage(message);
    }

    const invalidEmailStudent = createStudentData('InvalidEmail');
    await registrationPage.fillStudent({ ...invalidEmailStudent, email: 'invalid-email' });
    await registrationPage.submitInvalidForm();
    await registrationPage.expectValidationMessage('Enter a valid email address');

    const invalidPhoneStudent = createStudentData('InvalidPhone');
    await page.goto('/register-student');
    await registrationPage.fillStudent({ ...invalidPhoneStudent, phone: '12345' });
    await registrationPage.submitInvalidForm();
    await registrationPage.expectValidationMessage('Phone number must be 10 digits');
  });

  test('student registration rejects a duplicate email', async ({ page }) => {
    const student = createStudentData('Duplicate');
    await login(page);
    await register(page, student);

    const registrationPage = new StudentRegistrationPage(page);
    await page.goto('/register-student');
    await registrationPage.fillStudent({
      ...student,
      name: `${student.name} Second`,
      phone: '9123456780'
    });
    await registrationPage.registerExpectingFailure(
      'Student registration failed: Student email already exists'
    );
  });

  test('teacher can create and search for a student', async ({ page }) => {
    const student = createStudentData('Search');
    await login(page);
    await register(page, student);

    const studentListPage = new StudentListPage(page);
    await studentListPage.open();
    await studentListPage.expectTableVisible();
    await studentListPage.search(student.email);
    await studentListPage.expectRowVisible(student);

    await studentListPage.search('student-that-does-not-exist@example.com');
    await studentListPage.expectNoResults();
  });

  test('teacher can sort student names in both directions', async ({ page }) => {
    const suffix = Date.now();
    const alphaStudent = {
      ...createStudentData('Alpha', suffix),
      name: `Final Sort ${suffix} Alpha Student`
    };
    const zuluStudent = {
      ...createStudentData('Zulu', suffix),
      name: `Final Sort ${suffix} Zulu Student`
    };
    await login(page);
    await register(page, zuluStudent);
    await register(page, alphaStudent);

    const studentListPage = new StudentListPage(page);
    await studentListPage.open();
    await studentListPage.search(`Final Sort ${suffix}`);

    const rows = page.locator('tbody tr');
    await expect(rows).toHaveCount(2);
    await expect(rows.nth(0)).toContainText(alphaStudent.name);
    await expect(rows.nth(1)).toContainText(zuluStudent.name);
    await expect(studentListPage.nameSortButton('descending')).toContainText('↑');

    await studentListPage.sortDescending();
    await expect(rows.nth(0)).toContainText(zuluStudent.name);
    await expect(rows.nth(1)).toContainText(alphaStudent.name);
    await expect(studentListPage.nameSortButton('ascending')).toContainText('↓');
  });

  test('teacher can paginate and search pagination results', async ({ page }) => {
    const suffix = Date.now();
    const students = Array.from({ length: 6 }, (_, index) =>
      createStudentData(`Pagination ${suffix} Page${index + 1}`, suffix)
    );
    await login(page);
    for (const student of students) {
      await register(page, student);
    }

    const studentListPage = new StudentListPage(page);
    await studentListPage.open();
   await studentListPage.search(`Pagination ${suffix}`);

    await expect(page.locator('tbody tr')).toHaveCount(5);
    await studentListPage.expectPage(1, 2);
    await expect(page.getByRole('button', { name: 'Previous page' })).toBeDisabled();
    await studentListPage.nextPage();
    await expect(page.locator('tbody tr')).toHaveCount(1);
    await studentListPage.expectPage(2, 2);
    await expect(page.getByRole('button', { name: 'Next page' })).toBeDisabled();

    await studentListPage.search(students[0].email);
    await studentListPage.expectPage(1, 1);
    await expect(page.locator('tbody tr')).toHaveCount(1);
  });

  test('teacher can update a student and verify persisted data', async ({ page }) => {
    const student = createStudentData('Update');
    await login(page);
    await register(page, student);

    const studentListPage = new StudentListPage(page);
    await studentListPage.open();
    await studentListPage.search(student.email);
    await studentListPage.editStudent(student);
    await expect(page.getByLabel('Student Name')).toHaveValue(student.name);
    await page.getByLabel('Course').selectOption('ise');

    const updateResponse = page.waitForResponse((response) =>
      response.url().includes('/api/students/') &&
      response.request().method() === 'PUT' &&
      response.ok()
    );
    await page.getByRole('button', { name: 'Update Student' }).click();
    await expect((await updateResponse).json()).resolves.toMatchObject({ course: 'ise' });
    await expect(page.getByText('Student updated successfully!')).toBeVisible();

    await studentListPage.enableFreshListRequests();
    await studentListPage.open();
    await studentListPage.search(student.email);
    await expect(studentListPage.rowFor(student)).toContainText('ise');
  });

  test('teacher can delete a student or cancel deletion', async ({ page }) => {
    const studentToDelete = createStudentData('Delete');
    const studentToKeep = createStudentData('CancelDelete');
    await login(page);
    await register(page, studentToDelete);
    await register(page, studentToKeep);

    const studentListPage = new StudentListPage(page);
    await studentListPage.open();
    await studentListPage.search(studentToDelete.email);
    await studentListPage.deleteStudent(studentToDelete, true);
    await expect(studentListPage.rowFor(studentToDelete)).toHaveCount(0);

    await studentListPage.search(studentToKeep.email);
    await studentListPage.deleteStudent(studentToKeep, false);
    await studentListPage.expectRowVisible(studentToKeep);
  });

  test('teacher can complete the create, search, update, delete, and logout workflow', async ({ page }) => {
    const student = createStudentData('Workflow');
    const dashboardPage = await login(page);
    await dashboardPage.openRegistration();
    await register(page, student);

    const studentListPage = new StudentListPage(page);
    await studentListPage.open();
    await studentListPage.search(student.name);
    await studentListPage.expectRowVisible(student);
    await studentListPage.editStudent(student);

    await page.getByLabel('Course').selectOption('ise');
    await page.getByRole('button', { name: 'Update Student' }).click();
    await expect(page.getByText('Student updated successfully!')).toBeVisible();

    await studentListPage.enableFreshListRequests();
    await studentListPage.open();
    await studentListPage.search(student.email);
    await expect(studentListPage.rowFor(student)).toContainText('ise');
    await studentListPage.deleteStudent(student, true);
    await expect(studentListPage.rowFor(student)).toHaveCount(0);

    await page.goto('/dashboard');
    await dashboardPage.expectVisible();
    await dashboardPage.logout();
  });
});
