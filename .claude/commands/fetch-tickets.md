# GitHub Ticket Fetcher

Fetch open GitHub issues labeled `enhancement` or `bug` from RobertPecz/PlaywrightPetProject. Optionally filter by issue number: `$ARGUMENTS`

## Instructions

### Step 1: Read GitHub PAT

Read the file `pat.txt` in the project root. This is the GitHub Personal Access Token needed for authentication. The token requires `repo` and `read:org` scopes.

### Step 2: Fetch Issues from GitHub API

Make an authenticated request to the GitHub API:

```
GET https://api.github.com/repos/RobertPecz/PlaywrightPetProject/issues?labels=enhancement,bug&state=open&per_page=30&sort=updated&direction=desc
Authorization: token <PAT from pat.txt>
```

Use the Bash tool with curl:

```bash
PAT=$(cat pat.txt)
curl -s -H "Authorization: token $PAT" \
  "https://api.github.com/repos/RobertPecz/PlaywrightPetProject/issues?labels=enhancement,bug&state=open&per_page=30&sort=updated&direction=desc"
```

If `$ARGUMENTS` contains a specific issue number, also fetch that issue directly:

```bash
curl -s -H "Authorization: token $PAT" \
  "https://api.github.com/repos/RobertPecz/PlaywrightPetProject/issues/<number>"
```

### Step 3: Parse and Format Issues

For each issue, extract:

- `issue_id`: GitHub issue number
- `title`: Issue title
- `description`: Full issue body
- `labels`: Array of label names
- `created_at`: Creation date
- `updated_at`: Last updated date
- `url`: GitHub issue URL

### Step 4: Display to User

Present issues in a readable format:

```
## Open Issues (enhancement / bug)

#42 - Add E2E tests for checkout flow [enhancement]
  Description: We need comprehensive tests for the checkout process...
  Updated: 2026-05-31
  URL: https://github.com/RobertPecz/PlaywrightPetProject/issues/42

#38 - Fix login test flakiness [bug]
  Description: Login tests fail intermittently...
  ...
```

### Step 5: Ask User to Select Issues

Ask:

1. Which issue(s) should we work on? (select by number)
2. Are there specific requirements not mentioned in the issue description?
3. Should we create test cases based on the acceptance criteria in the description?

## Output

Return a structured summary of the selected issues with full details, ready for use by `/process-test-cases` or `/generate-page-objects`.

## Notes

- Only process `open` issues
- If `pat.txt` is missing or the token is invalid, prompt the user to add a valid PAT
- Rate limit: 5000 requests/hour with authentication
