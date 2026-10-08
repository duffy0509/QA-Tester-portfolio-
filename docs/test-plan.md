# Test Plan: Swag Labs (saucedemo.com)

| | |
|---|---|
| **Application under test** | Swag Labs demo store: https://www.saucedemo.com |
| **Document owner** | Adam Duffy |
| **Test types** | Functional, negative, regression (manual + automated) |
| **Automation stack** | Playwright, TypeScript, GitHub Actions |

## 1. Objective

Check that the main shopping flow (log in, browse and sort products, manage the cart, check out) works for valid users, rejects invalid input with clear messages, and find and record defects that affect real users.

## 2. Scope

### In scope
| Area | What is covered |
|---|---|
| Authentication | Valid login, locked-out user, invalid or empty credentials, logout, access to protected pages |
| Inventory | Product list, product images, sorting by name and by price |
| Cart | Add and remove items from the inventory and cart pages, badge count, cart kept after navigating and reloading |
| Checkout | Information form validation, order overview totals (subtotal + tax = total), order completion, cancel |
| Known defects | Regression checks for every logged `problem_user` bug |

### Out of scope
- Payment processing (the site uses a fake card that can't be changed)
- Performance, load and security testing
- `performance_glitch_user`, `error_user` and `visual_user` accounts (candidates for a later round)
- Browsers other than Chromium, and mobile viewports (see Risks)

## 3. Test accounts

All accounts use the public demo password listed on the login page.

| Account | Purpose |
|---|---|
| `standard_user` | Baseline happy-path user |
| `locked_out_user` | Negative login: account is locked |
| `problem_user` | Account with built-in defects, used for exploratory testing and bug reports |

## 4. Approach

1. **Exploratory session.** Click through every page with `standard_user` and then `problem_user`, noting what each one does differently.
2. **Test case design.** Write test cases using equivalence partitioning (valid, locked, invalid and empty credentials) and boundary checks (empty cart, single item, multiple items). See [test-cases.md](test-cases.md).
3. **Bug reporting.** Log each defect found with reproduction steps, expected and actual results, severity and evidence. See [bug-reports.md](bug-reports.md).
4. **Automation.** Automate the high- and medium-priority cases with Playwright using the Page Object Model and `data-test` selectors, which are stable and don't change with styling.
5. **Known-bug regression tests.** Each logged bug has a test marked `test.fail()`. The suite stays green while the bug exists. If the bug gets fixed, Playwright reports "expected to fail but passed", which tells the team to close the ticket and turn it into a normal test.
6. **Continuous integration.** Every push and pull request runs the suite in GitHub Actions and publishes the HTML report as a build artifact.

## 5. Entry and exit criteria

**Entry:** the site is reachable, test accounts work, and test cases have been reviewed.

**Exit:**
- 100% of high-priority test cases run
- No open Critical or High defects on `standard_user` flows
- Every defect found is logged with reproduction steps
- The CI pipeline is green on `main`

## 6. Environment

| Item | Value |
|---|---|
| Browser | Chromium (Playwright's bundled "Desktop Chrome" profile) |
| OS | Ubuntu (CI); Windows/macOS/Linux locally |
| Node.js | 20 LTS |
| CI | GitHub Actions (`ubuntu-latest`), 2 retries, trace saved on retry |

## 7. Risks and mitigations

| Risk | Mitigation |
|---|---|
| Public demo site can change or go down without notice | Selectors use `data-test` attributes; CI retries cover brief network failures; a failure report includes trace, screenshot and video |
| Only Chromium is tested | Adding Firefox/WebKit only needs a new project entry in `playwright.config.ts` |
| Bugs in `problem_user` are deliberate and could be changed by Sauce Labs | Known-bug tests use `test.fail()`, so any change in behaviour is reported instead of ignored |

## 8. Deliverables

- Test plan (this document)
- [Test cases](test-cases.md)
- [Bug reports](bug-reports.md)
- Automated suite (`tests/`, `pages/`) and CI workflow (`.github/workflows/ci.yml`)
- Playwright HTML report (CI artifact `playwright-report`)
