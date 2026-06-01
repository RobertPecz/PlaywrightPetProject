---
name: Test Generation Orchestrator
description: Main orchestrator for the complete test generation workflow
tools:
  [
    vscode/installExtension,
    vscode/memory,
    vscode/newWorkspace,
    vscode/resolveMemoryFileUri,
    vscode/runCommand,
    vscode/vscodeAPI,
    vscode/extensions,
    vscode/askQuestions,
    execute/runNotebookCell,
    execute/getTerminalOutput,
    execute/killTerminal,
    execute/sendToTerminal,
    execute/runTask,
    execute/createAndRunTask,
    execute/runInTerminal,
    execute/runTests,
    execute/testFailure,
    read/getNotebookSummary,
    read/problems,
    read/readFile,
    read/viewImage,
    read/readNotebookCellOutput,
    read/terminalSelection,
    read/terminalLastCommand,
    read/getTaskOutput,
    agent/runSubagent,
    edit/createDirectory,
    edit/createFile,
    edit/createJupyterNotebook,
    edit/editFiles,
    edit/editNotebook,
    edit/rename,
    search/codebase,
    search/fileSearch,
    search/listDirectory,
    search/textSearch,
    search/usages,
    web/fetch,
    web/githubRepo,
    web/githubTextSearch,
    browser/openBrowserPage,
    browser/readPage,
    browser/screenshotPage,
    browser/navigatePage,
    browser/clickElement,
    browser/dragElement,
    browser/hoverElement,
    browser/typeInPage,
    browser/runPlaywrightCode,
    browser/handleDialog,
    github/add_comment_to_pending_review,
    github/add_issue_comment,
    github/add_reply_to_pull_request_comment,
    github/create_branch,
    github/create_or_update_file,
    github/create_pull_request,
    github/create_repository,
    github/delete_file,
    github/fork_repository,
    github/get_commit,
    github/get_file_contents,
    github/get_label,
    github/get_latest_release,
    github/get_me,
    github/get_release_by_tag,
    github/get_tag,
    github/get_team_members,
    github/get_teams,
    github/issue_read,
    github/issue_write,
    github/list_branches,
    github/list_commits,
    github/list_issue_types,
    github/list_issues,
    github/list_pull_requests,
    github/list_releases,
    github/list_repository_collaborators,
    github/list_tags,
    github/merge_pull_request,
    github/pull_request_read,
    github/pull_request_review_write,
    github/push_files,
    github/request_copilot_review,
    github/run_secret_scanning,
    github/search_code,
    github/search_commits,
    github/search_issues,
    github/search_pull_requests,
    github/search_repositories,
    github/search_users,
    github/sub_issue_write,
    github/update_pull_request,
    github/update_pull_request_branch,
    todo,
  ]
applyTo: ['orchestration', 'test-workflow', 'test-generation']
---

# Test Generation Orchestrator Agent

## Overview

This is the main orchestrator agent that coordinates the entire workflow for:

1. Fetching GitHub tickets (labeled: enhancement, bug)
2. Processing test cases from Excel
3. Creating page object models
4. Generating .spec.ts test files
5. Validating tests
6. Creating merge requests

> NOTE: This agent does not perform the work itself. It only orchestrates and delegates tasks to the hidden worker agents in `.github/agents/internal/`.
>
> The actual code implementation and file modifications must be done by the internal agents, not by this orchestrator directly.

## Workflow Steps

Follow these steps in sequence. Each step can be run individually via the corresponding agent, but this orchestrator ensures proper sequencing.

### **Phase 1: Discovery & Planning**

#### Step 1️⃣ — Fetch GitHub Issues

**Agent**: GitHub Ticket Fetcher
**Goal**: Collect all open issues labeled 'enhancement' or 'bug'

```bash
# Instructions:
# 1. Agent fetches issues from GitHub API
# 2. Authenticates using pat.txt (GitHub PAT)
# 3. Filters by labels: enhancement, bug
# 4. Returns formatted issue list
# 5. User selects which issues to work on
```

**Output**: Prioritized list of GitHub issues

**Key Questions**:

- Which issues should we focus on? (select 1-3)
- Are there specific requirements in the issue description?
- What's the priority order?

**Next**: Test Case Processor

---

#### Step 2️⃣ — Process Test Cases from Excel

**Agent**: Test Case Processor
**Goal**: Extract and filter test cases from testcases/automation_practice_testcases.xlsx

```bash
# Instructions:
# 1. Agent reads Excel file
# 2. Lists available sheets
# 3. Shows status and category options
# 4. Applies filters (status, category)
# 5. Maps to required page objects
# 6. Groups by feature/page
```

**Filters Available**:

- **Status**: Active, Draft, Deprecated, Completed
- **Category**: Authentication, Dashboard, Forms, API, etc.
- **GitHub Issue**: Link to specific issues if applicable

**Output**: Structured test case data with page object mapping

**Key Questions**:

- Which status(es) should we include? (default: Active)
- Which categories? (default: all)
- How many test cases? (total X)

**Next**: Page Object Generator

---

### **Phase 2: Code Generation**

#### Step 3️⃣ — Generate Page Objects

**Agent**: Page Object Generator
**Goal**: Create new page object models in pages/ directory

```bash
# Instructions:
# 1. Agent analyzes test case requirements
# 2. Checks existing page objects in pages/
# 3. Plans new page objects needed
# 4. Generates TypeScript page classes
# 5. Creates files following project conventions
```

**Deliverables**:

- New .ts files in `pages/` directory
- All page selectors and methods
- Proper TypeScript types
- Following project code style

**Example**: If test cases need login/dashboard functionality:

- `pages/loginpage.ts`
- `pages/dashboardpage.ts`

**Next**: Spec Generator

---

#### Step 4️⃣ — Generate Test Specifications

**Agent**: Spec Generator
**Goal**: Create .spec.ts files in tests/ directory

```bash
# Instructions:
# 1. Agent maps test cases to Playwright tests
# 2. Imports required page objects
# 3. Creates test suites with describe()
# 4. Implements individual tests
# 5. Uses AAA pattern (Arrange, Act, Assert)
# 6. Adds meaningful assertions
```

**Deliverables**:

- New .spec.ts files in `tests/` directory
- X total tests for Y features
- Proper imports and structure
- Clear test descriptions

**Example**: If test cases for authentication:

- `tests/login.spec.ts` - 5 tests
- `tests/logout.spec.ts` - 2 tests

**Next**: Test Validator

---

### **Phase 3: Validation & Deployment**

#### Step 5️⃣ — Validate Tests

**Agent**: Test Validator
**Goal**: Run tests and ensure all pass

```bash
# Instructions:
# 1. Agent runs: npm test
# 2. Monitors test execution
# 3. Analyzes results
# 4. Reports failures with details
# 5. Suggests fixes
# 6. Confirms all tests pass
```

**Expected Results**:

```
Total Tests: X
Passed: X ✓
Failed: 0
Duration: ~Xs

Status: ✓ READY FOR MR
```

**If Failures Occur**:

- Agent provides failure analysis
- Suggests root cause
- Recommends fixes (selector, timing, logic)
- Retry until all pass

**Next**: Merge Request Creator (if all pass)

---

#### Step 6️⃣ — Create Merge Request

**Agent**: Merge Request Creator
**Goal**: Create GitHub PR targeting master branch

```bash
# Instructions:
# 1. Agent creates feature branch: add_tests_<ticket_id>
# 2. Commits changes with descriptive message
# 3. Pushes branch to GitHub
# 4. Creates merge request with detailed description
# 5. References related GitHub issues
# 6. Links test results and coverage info
```

**MR Details**:

- **Base Branch**: master
- **Feature Branch**: add*tests*<ticket_id>
- **Title**: feat: Add tests for [feature] (#issue_id)
- **Description**: Includes test count, page objects, coverage areas
- **Status**: Links to all related GitHub issues

**Output**: GitHub Merge Request URL

**Next**: Code Review & Merge

---

## Quick Start Guide

### To Run the Complete Workflow:

```bash
# 1. Start with Step 1
# Ask: "Run GitHub Ticket Fetcher"
# Select issues to work on

# 2. Continue with Step 2
# Ask: "Run Test Case Processor"
# Filter test cases

# 3. Generate code (Steps 3-4)
# Ask: "Run Page Object Generator"
# Ask: "Run Spec Generator"

# 4. Validate (Step 5)
# Ask: "Run Test Validator"
# Confirm all tests pass

# 5. Deploy (Step 6)
# Ask: "Run Merge Request Creator"
# Get GitHub PR URL
```

### To Run Individual Steps:

Each agent can be invoked independently. Reference the individual agent files:

- **GitHub Ticket Fetcher**: `.github/agents/github-ticket-fetcher.agent.md`
- **Test Case Processor**: `.github/agents/test-case-processor.agent.md`
- **Page Object Generator**: `.github/agents/page-object-generator.agent.md`
- **Spec Generator**: `.github/agents/spec-generator.agent.md`
- **Test Validator**: `.github/agents/test-validator.agent.md`
- **Merge Request Creator**: `.github/agents/merge-request-creator.agent.md`

---

## Configuration Reference

### GitHub Integration

- **Repository**: RobertPecz/PlaywrightPetProject
- **Authentication**: GitHub PAT in `pat.txt`
- **Issue Filters**: Labels: enhancement, bug | State: open
- **MR Target**: master branch

### Test Sources

- **GitHub Issues**: API endpoint: `api.github.com/repos/.../issues`
- **Excel Test Cases**: `testcases/automation_practice_testcases.xlsx`
- **Default Filters**:
  - Status: Active
  - Category: All
  - Labels to process: enhancement, bug

### Project Structure

```
pages/               # Page object models
  loginpage.ts       # Existing example
  registerpage.ts    # Existing example
  [new pages].ts     # Generated pages

tests/               # Test specifications
  login.spec.ts      # Existing example
  register.spec.ts   # Existing example
  [new specs].ts     # Generated test specs

.github/
  AGENTS.md          # This file
  agents/            # Individual agent definitions
```

### Code Conventions

- **Page Objects**: PascalCase class names, lowercase filenames
- **Test Specs**: camelCase test names, kebab-case file names
- **Methods**: camelCase for methods and properties
- **Selectors**: Use meaningful names with comments
- **Assertions**: Clear, specific expectations

---

## Troubleshooting

### Issue: GitHub API Rate Limited

**Solution**:

- Use authentication (GitHub PAT)
- Cache results for 1 hour
- Reduced endpoints: 5000 req/hr with auth

### Issue: Excel File Not Found

**Solution**:

- Verify file path: `testcases/automation_practice_testcases.xlsx`
- Check file is readable
- Confirm Excel format (.xlsx)

### Issue: Test Failures

**Solution**:

1. Agent provides failure details
2. Review error message (selector, assertion, timeout)
3. Update page object or test spec
4. Re-run validation

### Issue: Merge Conflict on Master

**Solution**:

- Pull latest master: `git pull origin master`
- Rebase feature branch: `git rebase origin/master`
- Resolve conflicts manually if needed
- Force push: `git push -f origin add_tests_<ticket_id>`

---

## Environment Setup

Before running orchestrator:

```bash
# Install dependencies
npm install

# Verify GitHub PAT is available
cat pat.txt  # Should show valid token

# Verify test structure
ls tests/
ls pages/

# Test npm commands work
npm test --help
npm run build --help
```

---

## Success Criteria

Workflow is successful when:

- ✓ All GitHub issues processed and selected
- ✓ All test cases extracted and organized
- ✓ All page objects created
- ✓ All test specs generated
- ✓ 100% of tests passing
- ✓ Merge request created on master branch
- ✓ MR includes test results and issue references

---

## Next Steps After MR

1. **Code Review**: Team reviews PR changes
2. **CI/CD**: Automated tests run (if configured)
3. **Approval**: Reviewer approves changes
4. **Merge**: PR merged to master branch
5. **Deploy**: Changes deployed to main branch
6. **Monitor**: Verify tests run in CI/CD

---

## Support & Resources

- **Playwright Docs**: https://playwright.dev
- **GitHub API**: https://docs.github.com/en/rest
- **Project README**: README.md
- **Refactoring Notes**: REFACTORING_NOTES.md
