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

The `pat.txt` token has `repo` scope — full write access. Push by embedding the PAT in the HTTPS URL. No user action needed:

```bash
PAT=$(cat pat.txt)
BRANCH=$(git rev-parse --abbrev-ref HEAD)
git push "https://${PAT}@github.com/RobertPecz/PlaywrightPetProject.git" "${BRANCH}"
```

### Step 7: Create Pull Request

`gh` CLI is not installed. Use the GitHub REST API with `curl`. No user action needed:

```bash
PAT=$(cat pat.txt)
BRANCH=$(git rev-parse --abbrev-ref HEAD)

PR_URL=$(curl -s -X POST \
  -H "Authorization: token ${PAT}" \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"feat: Add tests for [feature] (#<issue_id>)\",
    \"head\": \"${BRANCH}\",
    \"base\": \"master\",
    \"body\": \"## Summary\n\n- Added page objects: [list]\n- Added test specs: [list]\n- X total tests — all passing\n\n## Test Results\n\n✓ All X tests passing\n\n## Related Issues\n\nFixes #<issue_id>\n\n## Checklist\n\n- [x] All tests passing\n- [x] Page objects follow project conventions\n- [x] Test specs follow project patterns (AAA, test.step)\n- [x] TypeScript compiles without errors\n- [x] No breaking changes to existing tests\n- [x] Related GitHub issue(s) referenced\n\n🤖 Generated with [Claude Code](https://claude.com/claude-code)\"
  }" \
  "https://api.github.com/repos/RobertPecz/PlaywrightPetProject/pulls" \
  | python3 -c "import sys,json; r=json.load(sys.stdin); print(r.get('html_url', r.get('message','error')))")

echo "PR created: ${PR_URL}"
```

### Step 8: Verify PR

```bash
PAT=$(cat pat.txt)
BRANCH=$(git rev-parse --abbrev-ref HEAD)
curl -s -H "Authorization: token ${PAT}" \
  "https://api.github.com/repos/RobertPecz/PlaywrightPetProject/pulls?head=RobertPecz:${BRANCH}" \
  | python3 -c "import sys,json; prs=json.load(sys.stdin); [print(p['html_url'], '—', p['state']) for p in prs]"
```

Confirm: base branch is `master`, related issue is linked, diff shows only test/page files.

## Output

Return the GitHub PR URL and a summary:

```
✅ Pull Request created!
URL: https://github.com/RobertPecz/PlaywrightPetProject/pull/<number>
Branch: <branch> → master
Tests: X passing
```

## Notes

- Never commit `pat.txt`, `.env`, or credential files
- Keep the PR focused on test files (`tests/`, `pages/`) only
- PAT has `repo` scope — push and PR creation are fully automated via HTTPS + REST API
