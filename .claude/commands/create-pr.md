# Create Pull Request

Create a feature branch, commit the generated test files, push to GitHub, and open a Pull Request targeting `master`. Optionally pass a ticket ID or feature name: `$ARGUMENTS`

## Instructions

### Step 1: Verify Readiness

Before creating the PR:

1. Confirm all tests pass (run `/validate-tests` if not yet done)
2. Check git status:
   ```bash
   git status
   ```
3. Confirm we have changes to commit (new/modified files in `tests/` and `pages/`)

### Step 2: Determine Branch Name

Use the convention already established in this repo: `<issue-number>-<kebab-case-title>`

- Issue #42 "Add search tests" → `42-add-search-tests`
- If no issue number, use `feature-<kebab-description>`

Check if a branch for this work already exists:

```bash
git branch -a
```

### Step 3: Create Feature Branch

```bash
git checkout -b <issue-number>-<kebab-case-title>
```

If the branch already exists and we're already on it, skip this step.

### Step 4: Stage Changes

Stage only the relevant test and page files (never stage `pat.txt`, `.env`, or unrelated files):

```bash
git add tests/
git add pages/
git status
```

Review what's staged before committing.

### Step 5: Commit

Create a descriptive commit message:

```bash
git commit -m "$(cat <<'EOF'
feat: Add tests for [feature name] (fixes #<issue_id>)

- Added page objects: [list page files]
- Added test specs: [list spec files]
- X tests covering [coverage areas]
- All tests passing

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

### Step 6: Push Branch

**Important**: The `pat.txt` token has read-only scope and cannot push. Ask the user to push manually:

> "Please run: `git push -u origin <branch-name>`  
> (or type `! git push -u origin <branch-name>` in this prompt)"

Wait for confirmation before proceeding to Step 7.

### Step 7: Create Pull Request

Preferred: use the `mcp__github__create_pull_request` tool if available.

Fallback — if MCP tools are unavailable or return 403, provide the user with the direct URL:
`https://github.com/RobertPecz/PlaywrightPetProject/compare/master...<branch-name>`

And paste this as the PR body:

```bash
gh pr create \
  --title "feat: Add tests for [feature] (#<issue_id>)" \
  --base master \
  --body "$(cat <<'EOF'
## Summary

- Added page objects: [list]
- Added test specs: [list]
- X total tests — all passing

## Test Results

✓ All X tests passing

## Related Issues

Fixes #<issue_id>

## Testing Instructions

\`\`\`bash
npm test -- tests/<feature>.spec.ts  # run specific spec
npm test                              # run full suite
\`\`\`

## Checklist

- [x] All tests passing
- [x] Page objects follow project conventions
- [x] Test specs follow project patterns (AAA, test.step)
- [x] TypeScript compiles without errors
- [x] No breaking changes to existing tests
- [x] Related GitHub issue(s) referenced

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

### Step 8: Verify PR

After creation:

```bash
gh pr view --web
```

Confirm:

- Base branch is `master`
- All committed files are visible in the diff
- Related issue is linked
- Title and description are correct

## Output

Return the GitHub PR URL and a summary:

```
✅ Pull Request created!
URL: https://github.com/RobertPecz/PlaywrightPetProject/pull/<number>
Branch: add_tests_<ticket_id> → master
Tests: X passing
```

## Notes

- Never commit `pat.txt`, `.env`, or credential files
- Keep the PR focused on test files (`tests/`, `pages/`) only
- The `pat.txt` token is read-only: `git push` via HTTPS and `mcp__github__create_pull_request` both return 403
- `gh` CLI is not installed; the user must push manually and can create the PR at:
  `https://github.com/RobertPecz/PlaywrightPetProject/compare/master...<branch>`
