# Test Cases: Swag Labs (saucedemo.com)

**Priority:** High = blocks a core user journey · Medium = important but has a workaround · Low = cosmetic or rare.
**Automated in:** the spec file that runs the case (search the spec for the ID, e.g. `TC-012`).

Unless stated otherwise, the password is the public demo password (`secret_sauce`) and the starting point is https://www.saucedemo.com.

## Login

| ID | Title | Preconditions | Steps | Expected result | Priority | Automated in |
|---|---|---|---|---|---|---|
| TC-001 | Valid login (standard_user) | On login page | 1. Enter `standard_user` and the valid password 2. Click **Login** | Goes to `/inventory.html`; title "Products"; 6 products shown | High | `login.spec.ts` |
| TC-002 | Locked-out user is blocked | On login page | 1. Enter `locked_out_user` and the valid password 2. Click **Login** | Stays on login page; error "Epic sadface: Sorry, this user has been locked out." | High | `login.spec.ts` |
| TC-003 | Wrong password | On login page | 1. Enter `standard_user` and `wrong_password` 2. Click **Login** | Error "Epic sadface: Username and password do not match any user in this service" | High | `login.spec.ts` |
| TC-004 | Unknown username | On login page | 1. Enter `not_a_real_user` and the valid password 2. Click **Login** | Same mismatch error as TC-003 (doesn't reveal which field is wrong) | Medium | `login.spec.ts` |
| TC-005 | Empty username | On login page | 1. Leave username empty, enter password 2. Click **Login** | Error "Epic sadface: Username is required" | Medium | `login.spec.ts` |
| TC-006 | Empty password | On login page | 1. Enter `standard_user`, leave password empty 2. Click **Login** | Error "Epic sadface: Password is required" | Medium | `login.spec.ts` |
| TC-007 | problem_user can log in | On login page | 1. Enter `problem_user` and the valid password 2. Click **Login** | Goes to `/inventory.html`; 6 products shown | Medium | `login.spec.ts` |
| TC-008 | Product images are correct (problem_user) | Logged in as `problem_user` | 1. Look at the product images on the inventory page | Each product shows its own image | Medium | `login.spec.ts` (known bug [BUG-001](bug-reports.md#bug-001)) |
| TC-009 | Logout ends the session | Logged in as `standard_user` | 1. Open the menu 2. Click **Logout** 3. Go directly to `/inventory.html` | Back on login page; step 3 shows "You can only access '/inventory.html' when you are logged in." | High | `login.spec.ts` |

## Cart

| ID | Title | Preconditions | Steps | Expected result | Priority | Automated in |
|---|---|---|---|---|---|---|
| TC-010 | Empty cart has no badge | Logged in, cart empty | 1. Look at the cart icon | No number badge shown | Low | `cart.spec.ts` |
| TC-011 | Add one item | Logged in, cart empty | 1. Click **Add to cart** on Sauce Labs Backpack | Badge shows "1"; button changes to **Remove** | High | `cart.spec.ts` |
| TC-012 | Add several items | Logged in, cart empty | 1. Add Backpack, Bike Light, Onesie 2. Open cart | Badge "3"; cart lists the 3 items in the order they were added | High | `cart.spec.ts` |
| TC-013 | Remove from inventory page | 2 items in cart | 1. Click **Remove** on one item 2. Click **Remove** on the other | Badge goes 2 → 1 → hidden | High | `cart.spec.ts` |
| TC-014 | Remove from cart page | 2 items in cart, on cart page | 1. Click **Remove** on Backpack | Backpack removed from list; badge "1" | High | `cart.spec.ts` |
| TC-015 | Cart kept after navigating and reloading | 1 item in cart | 1. Open cart 2. Click **Continue Shopping** 3. Reload the page | Back on inventory; badge still "1"; item still shows **Remove** | Medium | `cart.spec.ts` |
| TC-016 | Add every product (problem_user) | Logged in as `problem_user` | 1. Click **Add to cart** on all 6 products | Badge shows "6" | High | `cart.spec.ts` (known bug [BUG-003](bug-reports.md#bug-003)) |
| TC-017 | Remove from inventory page (problem_user) | `problem_user`, Backpack in cart | 1. Click **Remove** on Backpack | Badge hidden; button back to **Add to cart** | High | `cart.spec.ts` (known bug [BUG-004](bug-reports.md#bug-004)) |

## Checkout

| ID | Title | Preconditions | Steps | Expected result | Priority | Automated in |
|---|---|---|---|---|---|---|
| TC-018 | Complete an order (happy path) | `standard_user`, Backpack + Bike Light in cart, on checkout step one | 1. Enter first name, last name, postal code 2. Click **Continue** 3. Check the overview 4. Click **Finish** | Overview lists both items; item total = $39.98; total = item total + tax; "Thank you for your order!" shown; cart badge cleared | High | `checkout.spec.ts` |
| TC-019 | Missing first name | On checkout step one | 1. Leave first name empty, fill the other fields 2. Click **Continue** | Error "Error: First Name is required"; stays on step one | High | `checkout.spec.ts` |
| TC-020 | Missing last name | On checkout step one | 1. Leave last name empty, fill the other fields 2. Click **Continue** | Error "Error: Last Name is required"; stays on step one | High | `checkout.spec.ts` |
| TC-021 | Missing postal code | On checkout step one | 1. Leave postal code empty, fill the other fields 2. Click **Continue** | Error "Error: Postal Code is required"; stays on step one | High | `checkout.spec.ts` |
| TC-022 | Cancel checkout | 2 items in cart, on checkout step one | 1. Click **Cancel** | Back on cart page; both items still there | Medium | `checkout.spec.ts` |
| TC-023 | Enter last name (problem_user) | `problem_user`, 1 item in cart, on checkout step one | 1. Type first name "Adam" 2. Type last name "Duffy" 3. Type postal code | First name field = "Adam", last name field = "Duffy" | High | `checkout.spec.ts` (known bug [BUG-005](bug-reports.md#bug-005)) |

## Sorting

| ID | Title | Preconditions | Steps | Expected result | Priority | Automated in |
|---|---|---|---|---|---|---|
| TC-024 | Default sort is Name (A to Z) | Logged in as `standard_user` | 1. Open inventory page | Dropdown shows "Name (A to Z)"; products in alphabetical order | Medium | `sorting.spec.ts` |
| TC-025 | Sort by Name (Z to A) | Logged in as `standard_user` | 1. Choose "Name (Z to A)" | Products in reverse alphabetical order | Medium | `sorting.spec.ts` |
| TC-026 | Sort by Price (low to high) | Logged in as `standard_user` | 1. Choose "Price (low to high)" | Prices go up: $7.99 … $49.99 | High | `sorting.spec.ts` |
| TC-027 | Sort by Price (high to low) | Logged in as `standard_user` | 1. Choose "Price (high to low)" | Prices go down: $49.99 … $7.99 | High | `sorting.spec.ts` |
| TC-028 | Sort by price (problem_user) | Logged in as `problem_user` | 1. Choose "Price (low to high)" | Prices go up | Medium | `sorting.spec.ts` (known bug [BUG-002](bug-reports.md#bug-002)) |

## Manual-only cases

| ID | Title | Preconditions | Steps | Expected result | Priority | Automated in |
|---|---|---|---|---|---|---|
| TC-029 | Reset App State clears the cart | `standard_user`, 2 items in cart | 1. Open the menu 2. Click **Reset App State** | Cart badge cleared | Low | Manual |
| TC-030 | Product detail page | Logged in as `standard_user` | 1. Click a product name 2. Check name, description, price 3. Click **Back to products** | Detail page matches the inventory card; returns to inventory | Medium | Manual |
