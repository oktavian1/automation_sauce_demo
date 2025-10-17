import { test as setup } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import users from './fixtures/users.json';
import { logger } from './common/logger';

const authFile = 'playwright/.auth/user.json';

setup('authenticate as standard user', async ({ page }) => {
  const loginPage = new LoginPage(page);
  
  // Navigate to login page
  await loginPage.goto();
  
  // Perform login with standard user
  await loginPage.login(
    users.validUsers.standard.username,
    users.validUsers.standard.password
  );
  
  // Wait for successful login (URL should change to inventory)
  await page.waitForURL('**/inventory.html');
  
  // Save authenticated state to file
  await page.context().storageState({ path: authFile });
  
  logger.info('Authentication setup completed', { user: users.validUsers.standard.username, authFile });
});
