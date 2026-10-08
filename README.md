# Swag Labs QA Portfolio: Playwright + TypeScript

[![Playwright Tests](https://github.com/duffy0509/saucedemo-playwright-qa/actions/workflows/ci.yml/badge.svg)](https://github.com/duffy0509/saucedemo-playwright-qa/actions/workflows/ci.yml)

A complete QA project for the [Swag Labs](https://www.saucedemo.com) demo store, from test planning to automated tests that run on every push.

## What this project shows

| Skill | Where to look |
|---|---|
| **Test planning**: scope, approach, entry/exit criteria, risks | [`docs/test-plan.md`](docs/test-plan.md) |
| **Manual test design**: 30 test cases with preconditions, steps, expected results and priority | [`docs/test-cases.md`](docs/test-cases.md) |
| **Bug reporting**: 5 real defects with reproduction steps, severity/priority and screenshots | [`docs/bug-reports.md`](docs/bug-reports.md) |
| **Test automation**: Playwright + TypeScript using the Page Object Model and `data-test` selectors | [`pages/`](pages), [`tests/`](tests) |
| **Continuous integration**: GitHub Actions runs the suite on every push/PR and publishes the HTML report | [`.github/workflows/ci.yml`](.github/workflows/ci.yml) |

## Test coverage

| Spec | What it checks |
|---|---|
| `tests/login.spec.ts` | `standard_user`, `locked_out_user`, invalid and empty credentials, `problem_user`, logout and protected pages |
| `tests/cart.spec.ts` | Add/remove from inventory and cart pages, badge count, cart kept after navigating |
| `tests/checkout.spec.ts` | End-to-end order with total = subtotal + tax, required-field validation, cancel |
| `tests/sorting.spec.ts` | Name A→Z / Z→A and price low→high / high→low order |

Each test name starts with its test case ID (e.g. `TC-018`), so every automated test links back to [`docs/test-cases.md`](docs/test-cases.md).

### How known bugs are handled

The `problem_user` account has deliberate defects. Each one is logged in [`docs/bug-reports.md`](docs/bug-reports.md) and has a regression test marked with Playwright's [`test.fail()`](https://playwright.dev/docs/api/class-test#test-fail):

- While the bug exists, the test fails as expected and **the suite stays green**. In the terminal these tests show a red ✘ but are counted as passed.
- If the bug is fixed, Playwright reports *"expected to fail, but passed"*. That means the bug report can be closed and the test changed into a normal test.

## Project structure

```
├── .github/workflows/ci.yml   # CI: run tests and upload the HTML report
├── docs/
│   ├── test-plan.md
│   ├── test-cases.md
│   ├── bug-reports.md
│   └── images/                # bug report screenshots
├── pages/                     # Page Object Model
│   ├── LoginPage.ts
│   ├── InventoryPage.ts
│   ├── CartPage.ts
│   └── CheckoutPage.ts
├── tests/                     # test specs
├── utils/
│   ├── fixtures.ts            # gives each test ready-made page objects
│   └── test-data.ts           # users, products, expected error messages
└── playwright.config.ts
```

## How to run it

You need [Node.js](https://nodejs.org/) 20 or newer and [Git](https://git-scm.com/). These commands work the same in PowerShell, macOS Terminal or Linux.

```
git clone https://github.com/duffy0509/saucedemo-playwright-qa.git
cd saucedemo-playwright-qa
npm install
npx playwright install chromium
npx playwright test
```

After the run, open the HTML report:

```
npx playwright show-report
```

Other useful commands:

| Command | What it does |
|---|---|
| `npm run test:headed` | Run the tests in a visible browser window |
| `npm run test:ui` | Open Playwright's interactive UI mode |
| `npx playwright test tests/checkout.spec.ts` | Run one spec file |
| `npx playwright test -g "TC-018"` | Run one test case by ID |
| `npm run typecheck` | Check the TypeScript for errors |

## CI

[`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs on every push to `main` and on every pull request:

1. Installs dependencies with `npm ci` and installs Chromium
2. Type-checks the project
3. Runs `npx playwright test` (2 retries on CI; a trace is saved when a test is retried)
4. Uploads the HTML report as the `playwright-report` artifact. Open the workflow run in the **Actions** tab and download it from the **Artifacts** section.

## Tech stack

Playwright · TypeScript · Node.js · GitHub Actions
