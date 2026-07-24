# 🎯 Playwright testautomation project on [Tricentis Tosca webshop](https://demowebshop.tricentis.com/)

## A R C H I V E

This project archived and wont accept any new pull request. Archive date: 24.07.2026.

## ⚙️ Getting started

Install nodejs >=18.0.0 and npm. Install the packages with npm -i. You can execute the test with `npm -i` in the project root folder.

> **Note:** The original instructions above mention `npm -i`, which may be a typo. The recommended commands are:
>
> - Install dependencies: `npm install` (or `npm i`)
> - Run Playwright tests: `npx playwright test`
>
> Example useful commands:
>
> - `npx playwright test` — run all tests
> - `npx playwright test tests/login.spec.ts` — run a single test file
> - `npx playwright test --headed` — run tests in headed mode (visible browser)
> - `npx playwright test --debug` — run in Playwright debug mode
> - `npx playwright show-report` — open the HTML report (reports are saved in `playwright-report/`)

If you prefer npm scripts, you can add the following to `package.json` under `scripts`:

```json
"scripts": {
  "test": "npx playwright test",
  "test:headed": "npx playwright test --headed",
  "show-report": "npx playwright show-report"
}
```

## ❓ Why is this repository exist?

There are two key reasons for my interest. First, with several years of experience working with Selenium and .NET, I have observed a growing industry shift toward Playwright for UI testing—especially in applications built with modern JavaScript frameworks such as Angular and React. To remain aligned with these evolving standards, I am keen to broaden my expertise in Playwright and TypeScript, enabling me to better support both current and future projects.

Second, developing proficiency in these technologies enhances my competitiveness in the job market by allowing me to confidently showcase relevant and up-to-date technical skills during interviews.

This repository contains example test suites, a small page object structure, fixture data, and helpers to demonstrate practical Playwright patterns. Key folders include `tests/` (test files), `pages/` (page objects), `fixtures/` (test data), and `support/` (helpers and utilities).

## 🧾 Why Tricentis Tosca webshop?

I have an [another project in Cypress](https://github.com/RobertPecz/CypressPetProject) which using [automationpractice webshop](http://www.automationpractice.pl/index.php) but it turned out that some functionalities of the page not developed correctly and it's very hard to handle by any test automation framework.

The Tricentis demo webshop provides a more stable set of e-commerce flows (login, register, search, cart, checkout) that are useful for exercising UI automations across typical scenarios.

## 🤝 Can I contribute?

No, if it's not a must, I like to keep this repository to myself. If you like to help me, please raise a ticket on the issues tab.

If you do create an issue, please include:

- Node and Playwright versions
- Steps to reproduce
- Test name and any error output or a screenshot

---

## 🗂️ Project structure

A quick overview of important files and folders:

- `tests/` — example test suites (`login.spec.ts`, `register.spec.ts`, `openGithubIssue.spec.ts`)
- `pages/` — page objects for UI abstraction (`mainpage.ts`, `registerpage.ts`)
- `fixtures/` — JSON and test data used by tests (e.g., `registerData.json`)
- `support/` — helpers and utilities (API handlers, file readers, string ops)
- `playwright.config.ts` — Playwright configuration (projects, timeouts, reporters)
- `playwright-report/` — generated HTML reports after test runs
- `package.json` — project deps (note: this repo currently has no test scripts by default)
- `repository.md` — project layout and style guide for agent-generated code

```text
project-root/
├─ package.json
├─ playwright.config.ts
├─ playwright-report/
│  └─ index.html
├─ tests/
│  ├─ login.spec.ts
│  ├─ register.spec.ts
│  └─ openGithubIssue.spec.ts
├─ pages/
│  ├─ mainpage.ts
│  └─ registerpage.ts
├─ fixtures/
│  ├─ registerData.json
│  ├─ mainpageData.json
│  └─ githubAPIData.json
├─ support/
│  ├─ apiHandler.ts
│  ├─ filereader.ts
│  └─ stringOperations.ts
└─ README.md
```

> Note: The tree is representative — files and nested items may vary.

## 🧪 Running tests (examples)

- Install dependencies: `npm install`
- Run full test suite: `npx playwright test`
- Run a single spec: `npx playwright test tests/login.spec.ts`
- Open last test report: `npx playwright show-report`
- Run with a specific project (if configured): `npx playwright test --project=chromium`

## 📋 Test reporting & debugging

Playwright produces rich HTML reports and can capture traces, screenshots and videos. Configure reporting options in `playwright.config.ts` and use `npx playwright show-report` to view results.

For deeper debugging:

- Use `--debug` or `--headed` flags
- Enable `trace` in the config for a Playwright trace you can open with the trace viewer

## ⚖️ License & contacts

This project uses the `ISC` license (see `package.json`). If you want to report an issue, please include reproduction steps and environment details to help triage.

## 🤖 Agent workers

This project implementation handled by agents since [7bb7d60](https://github.com/RobertPecz/PlaywrightPetProject/commit/7bb7d6099185e9d138c580d28431bdf6efadb326) commit.

---
