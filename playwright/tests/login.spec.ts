// 1. External packages
import { test } from '@playwright/test';

// 2. Page objects
import { LoginPage } from '@pages/LoginPage';
import { InventoryPage } from '@pages/InventoryPage';

// 3. Helpers
import { stepWithEvidence } from '@helpers/testStep';
import { expectVisible, expectContainsText, expectURLMatches } from '@helpers/assert';
import { attachConsoleErrorListener, assertNoConsoleErrors, ConsoleError } from '@helpers/assert';

// 4. Fixtures & data
import users from '@fixtures/users.json';
import { testData } from '@fixtures/testData';

test.describe('Login Functionality', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let consoleErrors: ConsoleError[];

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    
    consoleErrors = [];
    attachConsoleErrorListener(page, consoleErrors);
    
    await loginPage.goto();
  });

  test.afterEach(() => {
    assertNoConsoleErrors(consoleErrors);
  });

  test('User dapat login dengan kredensial valid @smoke', async ({ page }) => {
    await stepWithEvidence('Fill login credentials', page, async () => {
      await loginPage.login(
        users.validUsers.standard.username,
        users.validUsers.standard.password
      );
    });

    await stepWithEvidence('Verify dashboard is visible', page, async () => {
      await expectVisible(inventoryPage.pageTitle);
      await expectURLMatches(page, /inventory\.html/);
    });
  });

  test('User tidak dapat login dengan password yang salah @smoke', async ({ page }) => {
    await stepWithEvidence('Fill invalid credentials', page, async () => {
      await loginPage.login(
        users.invalidUsers.invalidPassword.username,
        users.invalidUsers.invalidPassword.password
      );
    });

    await stepWithEvidence('Verify error message is displayed', page, async () => {
      await expectVisible(loginPage.errorMessage);
      await expectContainsText(loginPage.errorMessage, testData.errorMessages.invalidCredentials);
    });
  });

  test('User tidak dapat login dengan username yang salah @smoke', async ({ page }) => {
    await stepWithEvidence('Fill invalid username', page, async () => {
      await loginPage.login(
        users.invalidUsers.invalidUsername.username,
        users.invalidUsers.invalidUsername.password
      );
    });

    await stepWithEvidence('Verify error message is displayed', page, async () => {
      await expectVisible(loginPage.errorMessage);
      await expectContainsText(loginPage.errorMessage, testData.errorMessages.invalidCredentials);
    });
  });

  test('User tidak dapat login dengan username kosong @smoke', async ({ page }) => {
    await stepWithEvidence('Submit with empty username', page, async () => {
      await loginPage.fillPassword(users.invalidUsers.emptyUsername.password);
      await loginPage.clickLogin();
    });

    await stepWithEvidence('Verify required field error', page, async () => {
      await expectVisible(loginPage.errorMessage);
      await expectContainsText(loginPage.errorMessage, testData.errorMessages.missingUsername);
    });
  });

  test('User tidak dapat login dengan password kosong @smoke', async ({ page }) => {
    await stepWithEvidence('Submit with empty password', page, async () => {
      await loginPage.fillUsername(users.invalidUsers.emptyPassword.username);
      await loginPage.clickLogin();
    });

    await stepWithEvidence('Verify required field error', page, async () => {
      await expectVisible(loginPage.errorMessage);
      await expectContainsText(loginPage.errorMessage, testData.errorMessages.missingPassword);
    });
  });

  test('User tidak dapat login dengan locked user @smoke', async ({ page }) => {
    await stepWithEvidence('Try login with locked user', page, async () => {
      await loginPage.login(
        users.invalidUsers.locked.username,
        users.invalidUsers.locked.password
      );
    });

    await stepWithEvidence('Verify locked user error message', page, async () => {
      await expectVisible(loginPage.errorMessage);
      await expectContainsText(loginPage.errorMessage, testData.errorMessages.lockedUser);
    });
  });

  test('User dapat logout setelah login @smoke', async ({ page }) => {
    await stepWithEvidence('Login with valid credentials', page, async () => {
      await loginPage.login(
        users.validUsers.standard.username,
        users.validUsers.standard.password
      );
      await expectVisible(inventoryPage.pageTitle);
    });

    await stepWithEvidence('Logout', page, async () => {
      await inventoryPage.logout();
    });

    await stepWithEvidence('Verify redirected to login page', page, async () => {
      await expectVisible(loginPage.loginButton);
      await expectURLMatches(page, /\/$/);
    });
  });

  test('Error message dapat ditutup @regression', async ({ page }) => {
    await stepWithEvidence('Trigger error message', page, async () => {
      await loginPage.clickLogin();
      await expectVisible(loginPage.errorMessage);
    });

    await stepWithEvidence('Close error message', page, async () => {
      await loginPage.closeError();
    });

    await stepWithEvidence('Verify error is hidden', page, async () => {
      await expectVisible(loginPage.usernameInput); // Page still on login
    });
  });
});