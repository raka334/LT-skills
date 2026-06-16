# Kane CLI QA Converter Reference

## Harness Engineering Principles

- Use progressive disclosure: `SKILL.md` is the map, this file is the detail.
- Keep repository knowledge as the system of record; do not rely on chat-only assumptions.
- Prefer tools that produce compact evidence over loading many files into context.
- Enforce invariants through repeatable checks where possible.
- Treat failures as missing harness capability: improve detection, validation, docs, or scripts instead of guessing.
- Optimize for agent legibility: clear structure, explicit evidence, small diffs, and reproducible commands.

## Evidence Sources

- Package manifests: `package.json`, `pom.xml`, `build.gradle`, `requirements.txt`, `pyproject.toml`, `.csproj`, `Gemfile`.
- Repo instructions: `AGENTS.md`, `CONTEXT.md`, `README*`, `TESTING*`, `CONTRIBUTING*`, `docs/**`, `.testmuai/**`.
- Framework configs: `playwright.config.*`, `cypress.config.*`, `wdio.conf.*`, `nightwatch.conf.*`, `pytest.ini`, `robot.yaml`, `testng.xml`, `junit-platform.properties`, `karma.conf.*`.
- Test names: `*.spec.ts`, `*.test.js`, `*_test.py`, `Test*.java`, `*.feature`, `*.robot`.
- CI and cloud configs: `.github/workflows/*`, `Jenkinsfile`, `.gitlab-ci.yml`, HyperExecute, BrowserStack, Sauce Labs, LambdaTest configs.
- Imports/APIs: `test`, `expect`, `describe`, `it`, `cy`, `browser`, `page`, `driver`, `By`, `pytest`, `Given`, `When`, `Then`.

## Framework Hints

- Playwright: `@playwright/test`, `playwright.config.*`, `test`, `expect`, `page`, `locator`.
- Cypress: `cypress.config.*`, `cy.*`, `Cypress.Commands`, `cypress/e2e`.
- WebdriverIO: `wdio.conf.*`, `browser`, `$`, `$$`, `expect-webdriverio`.
- Selenium: `selenium-webdriver`, `WebDriver`, `By`, `driver.findElement`, Java/Python/C# bindings.
- Appium: `appium`, mobile capabilities, accessibility IDs, mobile device configs.
- TestCafe: `testcafe`, `Selector`, `fixture`, `test`.
- Puppeteer: `puppeteer`, `browser.newPage`, `page.goto` without Playwright config.
- Robot Framework: `.robot`, `*** Test Cases ***`, keyword tables.
- Cucumber/BDD: `.feature`, step definitions, `Given`, `When`, `Then`.
- Pytest: `pytest`, `conftest.py`, fixtures, `test_*.py`.
- Java TestNG/JUnit: `testng.xml`, `@Test`, Maven/Gradle test plugins.

## Custom Flow Checklist

- Repository-specific instructions for adding tests, naming tests, preserving generated test details, and choosing validation commands.
- Entry points and test naming conventions.
- Page objects, screen objects, component objects, API clients, step files, stage files, tasks, flows, fixtures, hooks, commands, or custom keywords.
- Shared utilities for waits, frames, retries, screenshots, logs, data loading, environment config, authentication, navigation, cleanup, and reporting.
- Test data source conventions: CSV, JSON, env vars, fixtures, factories, database setup, external services.
- Locator conventions: role, test ID, CSS, XPath, accessibility IDs, mobile selectors.
- Assertion conventions: hard assertions, soft assertions, custom helpers, snapshot assertions, visual assertions.
- Error handling and wait strategy: explicit waits, auto-waits, polling helpers, retry wrappers, custom timeout helpers.
- Execution environment: local, CI, grid, cloud browser, mobile device, emulator, API-only.

## Questions To Ask Only When Inspection Cannot Answer

- Which file should be converted if the user did not provide one?
- Which existing flow should this scenario attach to if multiple flows match?
- Which repo instruction should win if docs and existing tests conflict?
- What is the expected assertion if the source script only performs actions?
- Should new test data be added or existing test data reused?
- Should the conversion target local execution or the configured cloud/device provider?

## Anti-Patterns

- Creating a standalone script beside an established framework.
- Adding tests to a generic folder when repo instructions point elsewhere.
- Converting between frameworks unless explicitly requested.
- Bypassing custom fixtures, hooks, page objects, stages, commands, or keywords.
- Hardcoding credentials, tokens, URLs, or environment-specific values.
- Replacing stable custom waits with arbitrary sleeps.
- Reporting success without validation or a clear blocked reason.
