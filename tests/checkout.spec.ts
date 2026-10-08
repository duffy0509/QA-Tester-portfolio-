import { test, expect } from '../utils/fixtures';
import { ERRORS, PRODUCTS, USERS } from '../utils/test-data';

const { backpack, bikeLight } = PRODUCTS;

test.describe('Checkout', () => {
  test.beforeEach(async ({ loginPage, inventoryPage, cartPage }) => {
    await loginPage.goto();
    await loginPage.login(USERS.standard);
    await inventoryPage.addToCart(backpack.name);
    await inventoryPage.addToCart(bikeLight.name);
    await inventoryPage.openCart();
    await cartPage.checkout();
  });

  test('TC-018 happy path: user completes an order with correct totals', async ({ page, checkoutPage, inventoryPage }) => {
    await expect(checkoutPage.title).toHaveText('Checkout: Your Information');

    await checkoutPage.fillInformation('Adam', 'Duffy', '10001');
    await checkoutPage.continue();

    await expect(page).toHaveURL(/checkout-step-two\.html$/);
    await expect(checkoutPage.title).toHaveText('Checkout: Overview');
    await expect(checkoutPage.itemNames).toHaveText([backpack.name, bikeLight.name]);

    const { subtotal, tax, total } = await checkoutPage.getSummary();
    expect(subtotal).toBeCloseTo(backpack.price + bikeLight.price, 2);
    expect(tax).toBeGreaterThan(0);
    expect(total).toBeCloseTo(subtotal + tax, 2);

    await checkoutPage.finish();

    await expect(page).toHaveURL(/checkout-complete\.html$/);
    await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
    await expect(inventoryPage.cartBadge).toBeHidden();
  });

  const missingFieldCases = [
    { id: 'TC-019', field: 'first name', first: '', last: 'Duffy', zip: '10001', error: ERRORS.firstNameRequired },
    { id: 'TC-020', field: 'last name', first: 'Adam', last: '', zip: '10001', error: ERRORS.lastNameRequired },
    { id: 'TC-021', field: 'postal code', first: 'Adam', last: 'Duffy', zip: '', error: ERRORS.postalCodeRequired },
  ];

  for (const { id, field, first, last, zip, error } of missingFieldCases) {
    test(`${id} missing ${field} blocks checkout with a validation error`, async ({ page, checkoutPage }) => {
      await checkoutPage.fillInformation(first, last, zip);
      await checkoutPage.continue();

      await expect(checkoutPage.errorMessage).toHaveText(error);
      await expect(page).toHaveURL(/checkout-step-one\.html$/);
    });
  }

  test('TC-022 cancel on the information step returns to the cart with items intact', async ({ page, checkoutPage, cartPage }) => {
    await checkoutPage.cancelButton.click();

    await expect(page).toHaveURL(/cart\.html$/);
    await expect(cartPage.cartItems).toHaveCount(2);
  });
});

test.describe('Checkout - problem_user known bugs', () => {
  test('TC-023 problem_user can enter a last name and continue [BUG-005]', async ({ loginPage, inventoryPage, cartPage, checkoutPage }) => {
    test.fail(true, 'Known bug BUG-005: typing in Last Name overwrites First Name, so checkout cannot continue');

    await loginPage.goto();
    await loginPage.login(USERS.problem);
    await inventoryPage.addToCart(backpack.name);
    await inventoryPage.openCart();
    await cartPage.checkout();

    await checkoutPage.fillInformation('Adam', 'Duffy', '10001');

    await expect(checkoutPage.firstNameInput).toHaveValue('Adam', { timeout: 2_000 });
    await expect(checkoutPage.lastNameInput).toHaveValue('Duffy', { timeout: 2_000 });
  });
});
