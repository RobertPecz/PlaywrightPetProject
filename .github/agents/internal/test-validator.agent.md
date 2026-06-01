---
name: Test Validator
description: Run and validate generated tests
hidden: true
tools: ['run_in_terminal', 'read_file']
applyTo: ['test-validation', 'quality-assurance']
---

# Test Validator Agent

## Purpose

Execute the test suite to validate that generated tests pass and meet quality standards.

> NOTE: This agent is intended to be invoked only by `.github/agents/orchestrator.agent.md`. It does not make workflow decisions or call other agents.

## Instructions

### Step 1: Pre-Validation Checks

Before running tests:

- [ ] Check `package.json` for test script
- [ ] Verify all imports in spec files are correct
- [ ] Ensure page objects are properly exported
- [ ] Check for any TypeScript compilation errors
- [ ] Verify test dependencies are installed

### Step 2: Install Dependencies (if needed)

```bash
npm install
```

### Step 3: Run Tests

Execute the test suite:

```bash
npm test
```

Or run specific test files:

```bash
npm test -- tests/newfeature.spec.ts
```

Or run with options:

```bash
npm test -- --headed  # Run in headed mode (see browser)
npm test -- --debug   # Debug mode
npm test -- --ui      # UI mode for interactive testing
```

### Step 4: Monitor Execution

While tests run:

- Track test execution progress
- Note any failures immediately
- Capture error messages
- Record timing/performance

### Step 5: Analyze Results

After test completion, analyze:

- **Total tests**: How many tests ran
- **Passed**: Number of passing tests
- **Failed**: Number of failing tests
- **Skipped**: Number of skipped tests
- **Duration**: Total execution time

### Step 6: Handle Failures

For each failed test:

1. **Identify failure**: Get error message and stack trace
2. **Root cause**:
   - Selector not found → Review page object selectors
   - Timing issue → Add waits
   - Wrong assertion → Review test logic
   - Page object method bug → Fix page object
3. **Remediate**:
   - Update page object or test spec
   - Re-run tests
   - Iterate until passing

### Step 7: Generate Report

Create summary:

```
Test Execution Report
====================
Date: 2026-05-31
Total Tests: 15
Passed: 15 ✓
Failed: 0
Skipped: 0
Duration: 45s

Status: ALL TESTS PASSED ✓
```

### Step 8: Performance Check

Review test execution:

- [ ] No timeouts (increase if needed)
- [ ] Reasonable performance (< 60s for most suites)
- [ ] No flaky tests (consistent pass/fail)
- [ ] Resource usage acceptable

## Common Failure Scenarios & Solutions

### Selector Not Found

**Error**: `Timeout waiting for locator`
**Solution**:

1. Verify selector in page object matches actual element
2. Check if element is visible/rendered
3. Use alternative selectors (data-testid, ARIA labels)
4. Add wait conditions before interaction

### Timing Issues

**Error**: `Page content not loaded`, `Element not found`
**Solution**:

1. Add explicit waits: `await page.waitForSelector()`
2. Increase timeout: `await page.locator('...').click({timeout: 10000})`
3. Wait for navigation: `await page.waitForNavigation()`

### Navigation Failures

**Error**: `Page not found`, `Navigation timeout`
**Solution**:

1. Verify URL in test
2. Check if page requires authentication
3. Ensure base URL is correct
4. Add proper navigation waits

### Assertion Failures

**Error**: `Expected X to be Y`
**Solution**:

1. Review expected vs actual values
2. Debug with `console.log()` or screenshots
3. Check page state at assertion time
4. Verify test data is correct

## Validation Criteria

Tests should meet:

- ✓ 100% of generated tests pass
- ✓ No timeout errors
- ✓ No selector/element not found errors
- ✓ Meaningful error messages on failure
- ✓ Consistent execution time (no flakiness)
- ✓ Clear test descriptions

## Output

- Detailed test execution report
- List of passing tests
- List of any failures (with remediation info)
- Test coverage summary (if available)
- Ready for: Merge Request Creator (if all pass)

## Implementation

This worker agent must execute the generated tests using the repository’s Playwright setup. It should install browsers if needed, run `npm test` or `npx playwright test`, analyze failures, and provide actionable remediation details.

## Notes

- Run tests in consistent environment (same browser/OS)
- Consider running tests multiple times to catch flakiness
- Use headless mode for CI/CD, headed for debugging
- Archive test results and artifacts
- Review test logs for warnings
