// 1. External packages
import { test, expect } from '@playwright/test';

// 2. Page objects
import { InventoryPage } from '@pages/InventoryPage';
import { CartPage } from '@pages/CartPage';
import { CheckoutPage } from '@pages/CheckoutPage';

// 3. Helpers
import { stepWithEvidence } from '@helpers/testStep';
import { expectVisible, expectContainsText, expectURLMatches } from '@helpers/assert';
import { attachConsoleErrorListener, assertNoConsoleErrors, ConsoleError } from '@helpers/assert';

// 4. Fixtures & data
import { products, validCheckoutInfo, invalidCheckoutInfo, testData } from '@fixtures/testData';

// These tests use authenticated state from auth.setup.ts
test.describe('Checkout Flow', () => {
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;
  let consoleErrors: ConsoleError[];

  test.beforeEach(async ({ page }) => {
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
    
    consoleErrors = [];
    attachConsoleErrorListener(page, consoleErrors);
    
    // Already authenticated, go to inventory
    await inventoryPage.goto();
    await expectVisible(inventoryPage.pageTitle);
  });

  test.afterEach(() => {
    assertNoConsoleErrors(consoleErrors);
  });

  test('User dapat complete checkout dengan valid info @smoke', async ({ page }) => {
    const productName = products.backpack.name;
    const checkoutInfo = validCheckoutInfo[0];

    await stepWithEvidence('Add product to cart', page, async () => {
      await inventoryPage.addToCart(productName);
      await inventoryPage.goToCart();
    });

    await stepWithEvidence('Start checkout', page, async () => {
      await cartPage.clickCheckout();
      await expectURLMatches(page, /checkout-step-one\.html/);
    });

    await stepWithEvidence('Fill checkout information', page, async () => {
      await checkoutPage.fillCheckoutInfo(
        checkoutInfo.firstName,
        checkoutInfo.lastName,
        checkoutInfo.postalCode
      );
      await checkoutPage.continue();
    });

    await stepWithEvidence('Verify checkout overview', page, async () => {
      await expectURLMatches(page, /checkout-step-two\.html/);
      const itemCount = await checkoutPage.getSummaryItemCount();
      expect(itemCount).toBe(1);
    });

    await stepWithEvidence('Complete order', page, async () => {
      await checkoutPage.finish();
    });

    await stepWithEvidence('Verify order complete', page, async () => {
      await expectURLMatches(page, /checkout-complete\.html/);
      await expectVisible(checkoutPage.backHomeButton);
    });
  });

  test('User tidak dapat checkout dengan first name kosong @smoke', async ({ page }) => {
    const productName = products.bikeLight.name;

    await stepWithEvidence('Add product and go to checkout', page, async () => {
      await inventoryPage.addToCart(productName);
      await inventoryPage.goToCart();
      await cartPage.clickCheckout();
    });

    await stepWithEvidence('Submit with empty first name', page, async () => {
      await checkoutPage.fillCheckoutInfo(
        invalidCheckoutInfo.emptyFirstName.firstName,
        invalidCheckoutInfo.emptyFirstName.lastName,
        invalidCheckoutInfo.emptyFirstName.postalCode
      );
      await checkoutPage.continue();
    });

    await stepWithEvidence('Verify error message', page, async () => {
      await expectVisible(checkoutPage.errorMessage);
      await expectContainsText(checkoutPage.errorMessage, testData.errorMessages.missingFirstName);
    });
  });

  test('User tidak dapat checkout dengan last name kosong @smoke', async ({ page }) => {
    const productName = products.boltTShirt.name;

    await stepWithEvidence('Add product and go to checkout', page, async () => {
      await inventoryPage.addToCart(productName);
      await inventoryPage.goToCart();
      await cartPage.clickCheckout();
    });

    await stepWithEvidence('Submit with empty last name', page, async () => {
      await checkoutPage.fillCheckoutInfo(
        invalidCheckoutInfo.emptyLastName.firstName,
        invalidCheckoutInfo.emptyLastName.lastName,
        invalidCheckoutInfo.emptyLastName.postalCode
      );
      await checkoutPage.continue();
    });

    await stepWithEvidence('Verify error message', page, async () => {
      await expectVisible(checkoutPage.errorMessage);
      await expectContainsText(checkoutPage.errorMessage, testData.errorMessages.missingLastName);
    });
  });

  test('User tidak dapat checkout dengan postal code kosong @smoke', async ({ page }) => {
    const productName = products.onesie.name;

    await stepWithEvidence('Add product and go to checkout', page, async () => {
      await inventoryPage.addToCart(productName);
      await inventoryPage.goToCart();
      await cartPage.clickCheckout();
    });

    await stepWithEvidence('Submit with empty postal code', page, async () => {
      await checkoutPage.fillCheckoutInfo(
        invalidCheckoutInfo.emptyPostalCode.firstName,
        invalidCheckoutInfo.emptyPostalCode.lastName,
        invalidCheckoutInfo.emptyPostalCode.postalCode
      );
      await checkoutPage.continue();
    });

    await stepWithEvidence('Verify error message', page, async () => {
      await expectVisible(checkoutPage.errorMessage);
      await expectContainsText(checkoutPage.errorMessage, testData.errorMessages.missingPostalCode);
    });
  });

  test('User dapat checkout multiple products @smoke', async ({ page }) => {
    const product1 = products.backpack.name;
    const product2 = products.fleeceJacket.name;
    const product3 = products.boltTShirt.name;
    const checkoutInfo = validCheckoutInfo[1];

    await stepWithEvidence('Add multiple products', page, async () => {
      await inventoryPage.addToCart(product1);
      await inventoryPage.addToCart(product2);
      await inventoryPage.addToCart(product3);
      await inventoryPage.goToCart();
    });

    await stepWithEvidence('Verify all products in cart', page, async () => {
      const cartItems = await cartPage.getCartItemNames();
      expect(cartItems).toContain(product1);
      expect(cartItems).toContain(product2);
      expect(cartItems).toContain(product3);
    });

    await stepWithEvidence('Complete checkout', page, async () => {
      await cartPage.clickCheckout();
      await checkoutPage.fillCheckoutInfo(
        checkoutInfo.firstName,
        checkoutInfo.lastName,
        checkoutInfo.postalCode
      );
      await checkoutPage.continue();
    });

    await stepWithEvidence('Verify all items in overview', page, async () => {
      const itemCount = await checkoutPage.getSummaryItemCount();
      expect(itemCount).toBe(3);
    });

    await stepWithEvidence('Finish order', page, async () => {
      await checkoutPage.finish();
      await expectURLMatches(page, /checkout-complete\.html/);
    });
  });

  test('User dapat cancel checkout dan kembali ke cart @regression', async ({ page }) => {
    const productName = products.redTShirt.name;

    await stepWithEvidence('Add product and go to checkout', page, async () => {
      await inventoryPage.addToCart(productName);
      await inventoryPage.goToCart();
      await cartPage.clickCheckout();
    });

    await stepWithEvidence('Cancel checkout', page, async () => {
      await checkoutPage.cancelButton.click();
    });

    await stepWithEvidence('Verify back on cart page', page, async () => {
      await expectURLMatches(page, /cart\.html/);
      const cartItems = await cartPage.getCartItemNames();
      expect(cartItems).toContain(productName);
    });
  });

  test('User dapat kembali ke home setelah order complete @smoke', async ({ page }) => {
    const productName = products.bikeLight.name;
    const checkoutInfo = validCheckoutInfo[2];

    await stepWithEvidence('Complete full checkout flow', page, async () => {
      await inventoryPage.addToCart(productName);
      await inventoryPage.goToCart();
      await cartPage.clickCheckout();
      await checkoutPage.fillCheckoutInfo(
        checkoutInfo.firstName,
        checkoutInfo.lastName,
        checkoutInfo.postalCode
      );
      await checkoutPage.continue();
      await checkoutPage.finish();
    });

    await stepWithEvidence('Click back home', page, async () => {
      await checkoutPage.backHome();
    });

    await stepWithEvidence('Verify on inventory page', page, async () => {
      await expectURLMatches(page, /inventory\.html/);
      await expectVisible(inventoryPage.pageTitle);
    });
  });

  test('Cart badge cleared setelah checkout complete @regression', async ({ page }) => {
    const productName = products.backpack.name;
    const checkoutInfo = validCheckoutInfo[0];

    await stepWithEvidence('Complete checkout', page, async () => {
      await inventoryPage.addToCart(productName);
      
      // Verify cart has item
      let cartCount = await inventoryPage.getCartItemCount();
      expect(cartCount).toBe(1);
      
      await inventoryPage.goToCart();
      await cartPage.clickCheckout();
      await checkoutPage.fillCheckoutInfo(
        checkoutInfo.firstName,
        checkoutInfo.lastName,
        checkoutInfo.postalCode
      );
      await checkoutPage.continue();
      await checkoutPage.finish();
    });

    await stepWithEvidence('Go back to inventory and verify cart is empty', page, async () => {
      await checkoutPage.backHome();
      const cartCount = await inventoryPage.getCartItemCount();
      expect(cartCount).toBe(0);
    });
  });
});