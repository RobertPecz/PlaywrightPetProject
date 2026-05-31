---
name: Merge Request Creator
description: Create merge request on GitHub with test results
tools: ["run_in_terminal"]
applyTo: ["merge-request-creation", "github-integration"]
---

# Merge Request Creator Agent

## Purpose
Create a merge request on GitHub targeting the `master` branch with all test implementation details.

## Instructions

### Step 1: Pre-MR Validation
Confirm readiness:
- [ ] All tests pass (from Test Validator)
- [ ] No uncommitted changes
- [ ] Current branch: `add_tests_<feature>` or similar
- [ ] Feature branch created from latest master

### Step 2: Prepare Git Branch
If not already done:
```bash
# Create feature branch for tests
git checkout -b add_tests_<ticket_id>

# Verify branch is created
git branch -a
```

**Branch Naming Convention**:
- Format: `add_tests_<ticket_id>` or `add_tests_<feature_name>`
- Example: `add_tests_42` for GitHub issue #42
- Example: `add_tests_checkout_flow`

### Step 3: Stage and Commit Changes
```bash
# Stage all new/modified test files
git add tests/
git add pages/

# Create meaningful commit
git commit -m "feat: Add tests for [feature name] (fixes #<issue_id>)

- Added page objects: [list pages]
- Added test specs: [list spec files]
- Test count: X tests covering [coverage areas]
- All tests passing
- Related to GitHub issue #<issue_id>"
```

**Commit Message Format**:
- Type: feat, fix, test, docs, etc.
- Issue reference: Fixes #<issue_id> or Closes #<issue_id>
- Detailed description of changes

### Step 4: Push Branch
```bash
# Push feature branch
git push origin add_tests_<ticket_id>

# Verify push
git branch -vv
```

### Step 5: Generate MR Description
Prepare comprehensive merge request description:

```markdown
## Description
This MR implements tests for [Feature Name] based on GitHub issue #<issue_id>.

## Changes
- **Page Objects Created**: [list new pages with brief description]
  - pages/loginpage.ts - Login form interactions
  - pages/dashboardpage.ts - Dashboard verification methods

- **Test Specs Created**: [list new test files]
  - tests/login.spec.ts - 5 tests for login scenarios
  - tests/dashboard.spec.ts - 3 tests for dashboard features

- **Test Cases Implemented**: X total tests
  - Authentication: Y tests
  - Dashboard: Z tests
  - [Other categories]: N tests

## Test Results
✓ All tests passing (X/X)
- No failures
- No skipped tests
- Average test duration: Xs per test

## Related Issues
Fixes #<issue_id>
Related: [other related issue numbers if any]

## Test Coverage
- Login scenarios: covered
- Error handling: covered
- Edge cases: covered
- [Other relevant areas]

## Checklist
- [x] All tests passing
- [x] Page objects follow project conventions
- [x] Test specs follow project patterns
- [x] Code compiled without errors
- [x] No breaking changes
- [x] Related GitHub issue(s) referenced

## Testing Instructions
```bash
npm test -- tests/login.spec.ts
npm test -- tests/dashboard.spec.ts
npm test  # Run all tests
```

## Additional Notes
- Selectors verified against actual UI elements
- Timeouts adjusted for stable execution
- Page objects follow existing project patterns
- Fixtures compatible with current setup
```

### Step 6: Create Merge Request via GitHub Web
Option A: **Using GitHub CLI** (if installed):
```bash
# Create pull request interactively
gh pr create --title "feat: Add tests for [feature]" \
  --body "Description here..." \
  --base master \
  --head add_tests_<ticket_id>
```

Option B: **Manual via GitHub Web**:
1. Go to: `https://github.com/RobertPecz/PlaywrightPetProject`
2. Click "Pull requests" tab
3. Click "New pull request"
4. Select:
   - Base branch: `master`
   - Compare branch: `add_tests_<ticket_id>`
5. Fill in:
   - Title: "feat: Add tests for [feature] (#<issue_id>)"
   - Description: [Use generated description from Step 5]
6. Click "Create pull request"

### Step 7: Add Labels & Assignment (Optional)
In the GitHub PR interface:
- Add labels: `tests`, `automation`, `[feature-label]`
- Link related issues: Add issue reference
- Request reviewers (if team process)
- Add to project board (if used)

### Step 8: Verification
After MR creation:
- [ ] MR shows up in repository PR list
- [ ] Base branch is `master`
- [ ] All commits visible in MR
- [ ] Related issue(s) linked
- [ ] CI/CD checks running (if configured)
- [ ] "Files changed" shows only test files and page objects
- [ ] Diff looks correct

### Step 9: Monitor MR Status
- Check CI/CD pipeline results
- Address any automated checks/reviews
- Be available for code review feedback
- Make adjustments if reviewers request changes

## MR Checklist

Before finalizing:
- [ ] Branch name follows convention
- [ ] All test files included
- [ ] Page object files included
- [ ] Commit messages are descriptive
- [ ] No unrelated changes included
- [ ] Description is clear and complete
- [ ] Related issues are referenced
- [ ] Tests are confirmed passing
- [ ] No conflicts with master branch

## Example MR Creation Flow

```bash
# 1. Ensure on correct branch and tests pass
git status
npm test

# 2. Create feature branch
git checkout -b add_tests_42

# 3. Stage and commit changes
git add tests/login.spec.ts tests/dashboard.spec.ts
git add pages/loginpage.ts pages/dashboardpage.ts
git commit -m "feat: Add authentication and dashboard tests (fixes #42)

- Added LoginPage and DashboardPage objects
- Added login.spec.ts with 5 authentication tests
- Added dashboard.spec.ts with 3 dashboard tests
- All 8 tests passing"

# 4. Push branch
git push origin add_tests_42

# 5. Create MR
gh pr create --title "feat: Add authentication tests (#42)" \
  --body "[See detailed description]" \
  --base master

# 6. Verify
gh pr view add_tests_42 --web
```

## Output
- GitHub Merge Request created
- MR URL for reference
- Summary of changes and test results
- Ready for: Code review and merge

## Notes
- Ensure no conflicts with master branch
- Keep MR focused on test implementation
- Reference related issues clearly
- Provide clear testing instructions
- Await team review and approval
- Address feedback promptly
