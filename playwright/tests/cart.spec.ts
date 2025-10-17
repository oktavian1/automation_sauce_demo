// 1. External packages
import { test, expect } from '@playwright/test';

// 2. Page objects
import { InventoryPage } from '@pages/InventoryPage';
import { CartPage } from '@pages/CartPage';

// 3. Helpers
import { stepWithEvidence } from '@helpers/testStep';
import { expectVisible, expectCount, expectURLMatches } from '@helpers/assert';
import { attachConsoleErrorListener, assertNoConsoleErrors, ConsoleError } from '@helpers/assert';

// 4. Fixtures & data
import { products, testData } from '@fixtures/testData';

// These tests use authenticated state from auth.setup.ts
test.describe('Shopping Cart Functionality', () => {
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let consoleErrors: ConsoleError[];

  test.beforeEach(async ({ page }) => {
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    
    consoleErrors = [];
    attachConsoleErrorListener(page, consoleErrors);
    
    // Already authenticated, go to inventory
    await inventoryPage.goto();
    await expectVisible(inventoryPage.pageTitle);
  });

  test.afterEach(() => {
    assertNoConsoleErrors(consoleErrors);
  });

  test('User dapat menambahkan produk ke cart @smoke', async ({ page }) => {
    const productName = products.backpack.name;

    await stepWithEvidence('Add product to cart', page, async () => {
      await inventoryPage.addToCart(productName);
    });

    await stepWithEvidence('Verify cart badge shows 1 item', page, async () => {
      const cartCount = await inventoryPage.getCartItemCount();
      expect(cartCount).toBe(1);
    });

    await stepWithEvidence('Verify Remove button is shown', page, async () => {
      const hasRemove = await inventoryPage.hasRemoveButton(productName);
      expect(hasRemove).toBe(true);
    });
  });

  test('User dapat menghapus produk dari cart di halaman inventory @smoke', async ({ page }) => {
    const productName = products.bikeLight.name;

    await stepWithEvidence('Add product to cart', page, async () => {
      await inventoryPage.addToCart(productName);
      const cartCount = await inventoryPage.getCartItemCount();
      expect(cartCount).toBe(1);
    });

    await stepWithEvidence('Remove product from cart', page, async () => {
      await inventoryPage.removeFromCart(productName);
    });

    await stepWithEvidence('Verify cart badge is gone', page, async () => {
      const cartCount = await inventoryPage.getCartItemCount();
      expect(cartCount).toBe(0);
    });
  });

  test('User dapat menambahkan multiple products ke cart @smoke', async ({ page }) => {
    const products1 = products.backpack.name;
    const products2 = products.boltTShirt.name;
    const products3 = products.onesie.name;

    await stepWithEvidence('Add 3 products to cart', page, async () => {
      await inventoryPage.addToCart(products1);
      await inventoryPage.addToCart(products2);
      await inventoryPage.addToCart(products3);
    });

    await stepWithEvidence('Verify cart badge shows 3 items', page, async () => {
      const cartCount = await inventoryPage.getCartItemCount();
      expect(cartCount).toBe(3);
    });
  });

  test('User dapat melihat cart contents @smoke', async ({ page }) => {
    const productName = products.fleeceJacket.name;

    await stepWithEvidence('Add product and navigate to cart', page, async () => {
      await inventoryPage.addToCart(productName);
      await inventoryPage.goToCart();
    });

    await stepWithEvidence('Verify cart page and product is listed', page, async () => {
      await expectURLMatches(page, /cart\.html/);
      const cartItems = await cartPage.getCartItemNames();
      expect(cartItems).toContain(productName);
    });
  });

  test('User dapat menghapus produk dari cart page @smoke', async ({ page }) => {
    const productName = products.redTShirt.name;

    await stepWithEvidence('Add product and go to cart', page, async () => {
      await inventoryPage.addToCart(productName);
      await inventoryPage.goToCart();
    });

    await stepWithEvidence('Remove product from cart', page, async () => {
      await cartPage.removeItem(productName);
    });

    await stepWithEvidence('Verify cart is empty', page, async () => {
      const cartItems = await cartPage.getCartItemNames();
      expect(cartItems.length).toBe(0);
    });
  });

  test('User dapat continue shopping dari cart @regression', async ({ page }) => {
    await stepWithEvidence('Navigate to cart', page, async () => {
      await inventoryPage.goToCart();
      await expectVisible(cartPage.pageTitle);
    });

    await stepWithEvidence('Click continue shopping', page, async () => {
      await cartPage.continueShopping();
    });

    await stepWithEvidence('Verify back on inventory page', page, async () => {
      await expectURLMatches(page, /inventory\.html/);
      await expectVisible(inventoryPage.pageTitle);
    });
  });

  test('User dapat sort products @regression', async ({ page }) => {
    await stepWithEvidence('Sort by price low to high', page, async () => {
      await inventoryPage.sortBy('lohi');
    });

    await stepWithEvidence('Verify products are sorted', page, async () => {
      const prices = await inventoryPage.getAllProductPrices();
      
      // Convert prices to numbers for comparison
      const numericPrices = prices.map(p => parseFloat(p.replace('$', '')));
      
      // Check if sorted ascending
      for (let i = 0; i < numericPrices.length - 1; i++) {
        expect(numericPrices[i]).toBeLessThanOrEqual(numericPrices[i + 1]);
      }
    });
  });

  test('Cart persists across pages @regression', async ({ page }) => {
    const productName = products.backpack.name;

    await stepWithEvidence('Add product on inventory page', page, async () => {
      await inventoryPage.addToCart(productName);
      const cartCount = await inventoryPage.getCartItemCount();
      expect(cartCount).toBe(1);
    });

    await stepWithEvidence('Navigate to product details', page, async () => {
      await inventoryPage.clickProductName(productName);
    });

    await stepWithEvidence('Verify cart count persists', page, async () => {
      const cartCount = await inventoryPage.getCartItemCount();
      expect(cartCount).toBe(1);
    });
  });
});