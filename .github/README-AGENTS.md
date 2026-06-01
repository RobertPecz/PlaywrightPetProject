# Orchestrator Agents Setup Guide

## 📋 Overview

You now have a complete orchestrator agent system set up for semi-automated test generation for the **Tricentis Demo Web Shop** (https://demowebshop.tricentis.com/).

This system guides you step-by-step through:

1. **Fetching GitHub tickets** (labeled: enhancement, bug)
2. **Processing test cases** from Excel file
3. **Creating page objects** with Demo Web Shop templates
4. **Generating test specs** targeting the e-commerce platform
5. **Validating tests**
6. **Creating merge requests**

## 📁 Agent Files Created

```
.github/
├── AGENTS.md                                  # Agent definitions & overview
├── APPLICATION.md                             # Demo Web Shop reference
├── README-AGENTS.md                           # This file
├── agents/
│   ├── orchestrator.agent.md                  # Main workflow coordinator
│   ├── github-ticket-fetcher.agent.md         # Fetch issues from GitHub
│   ├── test-case-processor.agent.md           # Parse Excel test cases
│   ├── page-object-generator.agent.md         # Generate page objects
│   ├── spec-generator.agent.md                # Generate test specs
│   ├── test-validator.agent.md                # Run & validate tests
│   ├── merge-request-creator.agent.md         # Create GitHub PR
│   └── demo-web-shop-pagobjects.agent.md      # Demo Web Shop page object templates
└── workflows/
```

## 🚀 Quick Start

### To Begin Test Generation:

1. **Start Orchestrator Workflow**
   ```bash
   # Invoke: "Run Test Generation Orchestrator"
   # or "Use the orchestrator agent"
   ```

2. **Follow the Semi-Automated Steps**
   - Agent guides you through each phase
   - You make decisions at key points
   - Each step builds on previous results

3. **Complete Workflow**
   - Tests are generated and validated
   - Merge request is created
   - Ready for code review

### Individual Agent Commands

You can also run individual agents:

```bash
# Step 1: Fetch GitHub Issues
# Agent: GitHub Ticket Fetcher

# Step 2: Process Excel Test Cases
# Agent: Test Case Processor

# Step 3: Generate Page Objects
# Agent: Page Object Generator

# Step 4: Generate Test Specs
# Agent: Spec Generator

# Step 5: Run Tests
# Agent: Test Validator

# Step 6: Create Merge Request
# Agent: Merge Request Creator
```

## 🔧 Configuration

### GitHub Integration
- **Repository**: RobertPecz/PlaywrightPetProject
- **Issue Labels**: enhancement, bug
- **Authentication**: GitHub PAT in `pat.txt`
- **MR Target Branch**: master

### Test Sources
- **GitHub Issues**: Fetched from GitHub API
- **Test Cases**: testcases/automation_practice_testcases.xlsx
- **Filters**:
  - Issue Status: Open
  - Issue Labels: enhancement, bug
  - Test Case Status: Active (configurable)
  - Test Case Categories: All (configurable)

### Project Structure for Demo Web Shop
- **Page Objects**: `pages/pagename.ts` → `PageNamePage` class (use templates from demo-web-shop-pagobjects.agent.md)
- **Test Specs**: `tests/featurename.spec.ts` with describe/test blocks (target https://demowebshop.tricentis.com/)
- **Branch Naming**: `add_tests_<ticket_id>` or `add_tests_<feature_name>`
- **Commit Format**: `feat: Add tests for [feature] (fixes #<issue_id>)`
- **Selectors**: Reference APPLICATION.md for Demo Web Shop page elements

## 📊 Workflow Diagram

```
START
  ↓
[1] Fetch GitHub Issues (enhancement, bug labels)
  ↓
[User selects which issues to process]
  ↓
[2] Process Test Cases from Excel
  ↓
[User filters by status/category]
  ↓
[3] Generate Page Objects
  ↓
[Review and confirm new pages]
  ↓
[4] Generate Test Specifications
  ↓
[Review test specs created]
  ↓
[5] Run & Validate Tests
  ↓
[All tests pass?] → NO → [Fix failures] ↻
  ↓ YES
[6] Create Merge Request
  ↓
COMPLETE ✓
  ↓
[Code review] → [Merge to master]
```

## 📝 Step-by-Step Guide

### Phase 1: Discovery

#### Step 1 — GitHub Ticket Fetcher
- Fetches all open issues with labels: enhancement, bug
- Shows issue title, description, and metadata
- User selects which issues to work on
- **Output**: List of selected issues with details

#### Step 2 — Test Case Processor
- Reads testcases/automation_practice_testcases.xlsx
- Shows available sheets and columns
- User selects status filter (default: Active)
- User selects category filter (default: All)
- Identifies required page objects
- **Output**: Structured test case data

### Phase 2: Generation

#### Step 3 — Page Object Generator
- Analyzes test case requirements
- Checks existing page objects in pages/
- Generates new page object files
- Creates class definitions, selectors, and methods
- **Output**: New .ts files in pages/ directory

#### Step 4 — Spec Generator
- Maps test cases to Playwright tests
- Generates test suites and test cases
- Imports page objects
- Creates test specs following project patterns
- **Output**: New .spec.ts files in tests/ directory

### Phase 3: Validation & Deployment

#### Step 5 — Test Validator
- Runs: `npm test`
- Monitors test execution
- Reports pass/fail status
- Suggests fixes for failures
- Continues until all tests pass
- **Output**: Test execution report

#### Step 6 — Merge Request Creator
- Creates feature branch: add_tests_<ticket_id>
- Stages and commits changes
- Pushes to GitHub
- Creates merge request to master
- Links related issues
- **Output**: GitHub PR URL

## ✅ Decision Points

The workflow pauses for user input at:

1. **Which GitHub issues to work on?**
   - Select from fetched list
   - Can choose 1 or more issues

2. **Filter test cases by status?**
   - Default: Active
   - Options: Active, Draft, Deprecated, Completed

3. **Filter test cases by category?**
   - Default: All
   - Options: Authentication, Shopping, Cart, Checkout, Search, Account, etc. (for Demo Web Shop)

4. **Confirm page objects to create?**
   - Review list of new pages
   - Use Demo Web Shop templates as reference (demo-web-shop-pagobjects.agent.md)
   - Approve or modify list

5. **Review generated test specs?**
   - Check test count and structure
   - Verify page object imports and method usage
   - Approve before running tests

6. **Proceed with merge request?**
   - Review test results
   - Confirm MR details
   - Create PR to master

## 🐛 Troubleshooting

### GitHub API Issues
- **Error**: Authentication failed
- **Solution**: Verify `pat.txt` contains valid GitHub PAT
- **Token Requirements**: repo, read:org scopes

### Excel File Issues
- **Error**: File not found
- **Solution**: Ensure `testcases/automation_practice_testcases.xlsx` exists
- **Format**: Must be Excel (.xlsx) format

### Test Failures
- **Error**: Tests fail during validation
- **Solution**: 
  - Agent provides failure details
  - Common issues: selectors, timing, assertions
  - Fix and re-run validation

### Merge Conflict
- **Error**: Can't merge to master
- **Solution**: 
  - Pull latest master
  - Rebase feature branch
  - Resolve conflicts manually

## 📚 Resources

- **Main Orchestrator**: `.github/agents/orchestrator.agent.md`
- **All Agents**: `.github/agents/*.agent.md`
- **Agent Overview**: `.github/AGENTS.md`
- **Application Reference**: `.github/APPLICATION.md` (Demo Web Shop elements & pages)
- **Page Object Templates**: `.github/agents/demo-web-shop-pagobjects.agent.md`
- **Project README**: `README.md`
- **Application URL**: https://demowebshop.tricentis.com/
- **Playwright Docs**: https://playwright.dev
- **GitHub API Docs**: https://docs.github.com/en/rest

## 🎯 Next Steps

1. **Prepare Environment**
   ```bash
   npm install
   # Verify GitHub PAT in pat.txt
   ```

2. **Start Orchestrator**
   - Request: "Run Test Generation Orchestrator"
   - or "Use orchestrator agent"

3. **Follow Agent Guidance**
   - Each agent provides clear instructions
   - Follow prompts and make selections

4. **Complete Workflow**
   - All tests generated and validated
   - Merge request created
   - Ready for code review

## 💡 Tips

- **Run Individually**: Each agent can run independently
- **Reuse Results**: Test case data can be reused across runs
- **Incremental**: Process multiple issues in separate MRs
- **Customization**: Modify agent files to adjust workflow
- **Debugging**: Agents provide detailed error messages

## 🔄 Workflow Modes

### Full Automation (Recommended for this setup)
- Agent makes all technical decisions
- User approves at key checkpoints
- Fastest way to generate tests
- Type: "Semi-automated"

### Step-by-Step (Current Configuration)
- Agent guides each step
- User involved in every decision
- Maximum control and visibility
- Recommended for first-time use

## 📞 Support

For issues or questions:
1. Check agent-specific documentation
2. Review error messages for hints
3. Check project README
4. Verify configuration (pat.txt, file paths)
5. Consult Playwright documentation

---

**Last Updated**: 2026-05-31
**Setup**: Test Generation Orchestrator v1.0
**Target Branch**: master
**Issue Labels**: enhancement, bug
