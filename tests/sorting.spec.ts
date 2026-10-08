import { test, expect } from '../utils/fixtures';
import { USERS } from '../utils/test-data';

const ascending = (a: number, b: number) => a - b;
const descending = (a: number, b: number) => b - a;

test.describe('Product sorting', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(USERS.standard);
  });

  test('TC-024 products are sorted by name A to Z by default', async ({ inventoryPage }) => {
    await expect(inventoryPage.sortDropdown).toHaveValue('az');
    const names = await inventoryPage.getItemNames();
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
  });

  test('TC-025 sort by name Z to A', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('za');
    const names = await inventoryPage.getItemNames();
    expect(names).toEqual([...names].sort((a, b) => b.localeCompare(a)));
  });

  test('TC-026 sort by price low to high', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('lohi');
    const prices = await inventoryPage.getItemPrices();
    expect(prices).toHaveLength(6);
    expect(prices).toEqual([...prices].sort(ascending));
  });

  test('TC-027 sort by price high to low', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('hilo');
    const prices = await inventoryPage.getItemPrices();
    expect(prices).toHaveLength(6);
    expect(prices).toEqual([...prices].sort(descending));
  });
});

test.describe('Product sorting - problem_user known bugs', () => {
  test('TC-028 problem_user can sort by price low to high [BUG-002]', async ({ loginPage, inventoryPage }) => {
    test.fail(true, 'Known bug BUG-002: choosing a sort option does not reorder products for problem_user');

    await loginPage.goto();
    await loginPage.login(USERS.problem);
    await inventoryPage.sortBy('lohi');

    const prices = await inventoryPage.getItemPrices();
    expect(prices).toEqual([...prices].sort(ascending));
  });
});
