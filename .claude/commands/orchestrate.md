# Test Generation Orchestrator

Run the complete test generation workflow for this PlaywrightPetProject. Optionally pass a GitHub issue number to focus on a specific issue: `$ARGUMENTS`

## Overview

You are the main orchestrator. Coordinate all phases of the test generation workflow. Do NOT implement any code directly — delegate each phase using the instructions below and guide the user through each decision point.

The workflow is **complete** only when:

1. All generated tests pass ✅
2. A GitHub Pull Request is created ✅

---

## Phase 1: Discovery

### Step 1 — Fetch GitHub Issues

Follow the instructions in `/fetch-tickets` to:

- Read `pat.txt` for the GitHub PAT
- Fetch open issues labeled `enhancement` or `bug` from `RobertPecz/PlaywrightPetProject`
- If `$ARGUMENTS` contains an issue number, focus on that specific issue

Present the fetched issues to the user and ask:

- Which issue(s) should we work on? (if not specified in $ARGUMENTS)
- Are there specific requirements not in the description?

### Step 2 — Process Test Cases from Excel

Follow the instructions in `/process-test-cases` to:

- Read `testcases/automation_practice_testcases.xlsx`
- Show available sheets, statuses, and categories
- Ask user to select filters (default: Active status, all categories)
- Map test cases to required page objects

---

## Phase 2: Code Generation

### Step 3 — Generate Page Objects

Follow the instructions in `/generate-page-objects` to:

- Analyze test case requirements from Phase 1
- Check existing pages in `pages/` directory
- Present the list of new page objects needed
- Ask user to confirm before creating files
- Generate TypeScript page object files in `pages/`

### Step 4 — Generate Test Specifications

Follow the instructions in `/generate-specs` to:

- Use structured test cases and the newly created page objects
- Generate `.spec.ts` files in `tests/`
- Ask user to review the generated test plan before writing files
- Create test files following AAA pattern

---

## Phase 3: Validation & Deployment

### Step 5 — Validate Tests

Follow the instructions in `/validate-tests` to:

- Run `npm test` (or specific spec files)
- Analyze failures and suggest fixes
- Iterate until all tests pass

### Step 6 — Create Pull Request

Follow the instructions in `/create-pr` to:

- Create a feature branch `add_tests_<ticket_id>`
- Commit and push changes
- Create a GitHub PR targeting `master`

---

## Configuration

- **Repository**: RobertPecz/PlaywrightPetProject
- **GitHub PAT**: stored in `pat.txt`
- **Page objects**: `pages/*.ts`
- **Test specs**: `tests/*.spec.ts`
- **Branch naming**: `add_tests_<ticket_id>`
- **Commit format**: `feat: Add tests for [feature] (fixes #<issue_id>)`

## Decision Points

Pause and ask the user at:

1. Which GitHub issues to work on
2. Which test case status/category filters to apply
3. Which page objects to create (confirm list before generating)
4. Review of generated test specs before running
5. Confirmation before creating the PR
