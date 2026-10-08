import { test, expect } from '../utils/fixtures';
import { PRODUCTS, USERS } from '../utils/test-data';

const { backpack, bikeLight, boltTShirt, onesie } = PRODUCTS;

test.describe('Cart', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(USERS.standard);
  });

  test('TC-010 cart badge is hidden when the cart is empty', async ({ inventoryPage }) => {
    await expect(inventoryPage.cartBadge).toBeHidden();
  });

  test('TC-011 adding an item shows badge "1" and switches the button to Remove', async ({ inventoryPage }) => {
    await inventoryPage.addToCart(backpack.name);

    await expect(inventoryPage.cartBadge).toHaveText('1');
    await expect(inventoryPage.removeButton(backpack.name)).toBeVisible();
    await expect(inventoryPage.addToCartButton(backpack.name)).toBeHidden();
  });

  test('TC-012 badge counts multiple items and the cart lists them', async ({ inventoryPage, cartPage }) => {
    for (const product of [backpack, bikeLight, onesie]) {
      await inventoryPage.addToCart(product.name);
    }
    await expect(inventoryPage.cartBadge).toHaveText('3');

    await inventoryPage.openCart();
    await expect(cartPage.cartItems).toHaveCount(3);
    expect(await cartPage.getItemNames()).toEqual([backpack.name, bikeLight.name, onesie.name]);
  });

  test('TC-013 removing an item from the inventory page updates the badge', async ({ inventoryPage }) => {
    await inventoryPage.addToCart(backpack.name);
    await inventoryPage.addToCart(bikeLight.name);
    await expect(inventoryPage.cartBadge).toHaveText('2');

    await inventoryPage.removeFromCart(backpack.name);
    await expect(inventoryPage.cartBadge).toHaveText('1');

    await inventoryPage.removeFromCart(bikeLight.name);
    await expect(inventoryPage.cartBadge).toBeHidden();
  });

  test('TC-014 removing an item on the cart page updates the list and badge', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addToCart(backpack.name);
    await inventoryPage.addToCart(boltTShirt.name);
    await inventoryPage.openCart();

    await cartPage.removeItem(backpack.name);

    await expect(cartPage.cartItems).toHaveCount(1);
    await expect(cartPage.itemNames).toHaveText([boltTShirt.name]);
    await expect(inventoryPage.cartBadge).toHaveText('1');
  });

  test('TC-015 cart contents persist after "Continue Shopping" and a page reload', async ({ page, inventoryPage, cartPage }) => {
    await inventoryPage.addToCart(onesie.name);
    await inventoryPage.openCart();
    await cartPage.continueShoppingButton.click();

    await expect(page).toHaveURL(/\/inventory\.html$/);
    await page.reload();
    await expect(inventoryPage.cartBadge).toHaveText('1');
    await expect(inventoryPage.removeButton(onesie.name)).toBeVisible();
  });
});

test.describe('Cart - problem_user known bugs', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(USERS.problem);
  });

  test('TC-016 problem_user can add every product to the cart [BUG-003]', async ({ inventoryPage }) => {
    test.fail(true, 'Known bug BUG-003: "Add to cart" does nothing for 3 of the 6 products');

    for (const product of Object.values(PRODUCTS)) {
      await inventoryPage.addToCart(product.name);
    }
    await expect(inventoryPage.cartBadge).toHaveText('6', { timeout: 2_000 });
  });

  test('TC-017 problem_user can remove an item from the inventory page [BUG-004]', async ({ inventoryPage }) => {
    test.fail(true, 'Known bug BUG-004: "Remove" on the inventory page does nothing');

    await inventoryPage.addToCart(backpack.name);
    await expect(inventoryPage.cartBadge).toHaveText('1');

    await inventoryPage.removeFromCart(backpack.name);
    await expect(inventoryPage.cartBadge).toBeHidden({ timeout: 2_000 });
  });
});
