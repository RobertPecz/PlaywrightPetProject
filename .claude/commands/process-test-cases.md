# Test Case Processor

Parse and filter test cases from the Excel file. Optionally pass a status or category filter: `$ARGUMENTS`

## Instructions

### Step 1: Locate Excel File

The test cases file is at: `testcases/automation_practice_testcases.xlsx`

Expected columns: `test_id`, `title`, `description`, `status`, `category`, `expected_result`, `preconditions`

### Step 2: Read the Excel File

Use the Bash tool to read the Excel file. Install `xlsx` reader if needed, or use Python:

```bash
python3 -c "
import openpyxl
wb = openpyxl.load_workbook('testcases/automation_practice_testcases.xlsx')
print('Sheets:', wb.sheetnames)
ws = wb.active
for i, row in enumerate(ws.iter_rows(values_only=True)):
    if i < 3:  # Print first 3 rows to identify columns
        print(row)
"
```

If Python/openpyxl is not available, try:

```bash
python3 -m pip install openpyxl 2>/dev/null; python3 -c "import openpyxl; ..."
```

### Step 3: List Available Options

Show the user:

- All available **sheets** in the workbook
- All unique **Status** values found (e.g. Active, Draft, Deprecated, Completed)
- All unique **Category** values found (e.g. Authentication, Shopping, Cart, Checkout)

### Step 4: Ask User to Select Filters

Ask the user:

1. Which sheet to process? (default: first sheet / "Test Cases")
2. Which status(es) to include? (default: Active)
3. Which categories to include? (default: all)
4. Should test cases be linked to specific GitHub issues?

If `$ARGUMENTS` is provided, use it as a pre-set filter (e.g. "Active" or "Checkout").

### Step 5: Extract Test Case Data

For each matching test case, extract as structured JSON:

```json
{
  "test_id": "TC_001",
  "title": "User login with valid credentials",
  "description": "Verify that user can login with valid username and password",
  "category": "Authentication",
  "status": "Active",
  "preconditions": "User account exists, user not already logged in",
  "steps": ["Navigate to login page", "Enter username", "Enter password", "Click Login"],
  "expected_result": "User is redirected to dashboard",
  "related_github_issue": null
}
```

### Step 6: Map Test Cases to Page Objects

Analyze the test cases and identify required pages:

- Parse descriptions and steps for page references (login, register, cart, checkout, etc.)
- Check which page objects already exist in `pages/` directory
- List the new page objects that would need to be created

Example mapping:

```
Category: Authentication
  Required Pages: LoginPage (exists: pages/mainpage.ts has login)
  Methods needed: login(), logout(), verifyLoggedIn()

Category: Shopping/Cart
  Required Pages: ProductPage (exists), CartPage (exists)
  Methods needed: addToCart(), viewCart(), removeFromCart()
```

### Step 7: Present Summary

Show the user:

- Total test cases selected: N
- Breakdown by category
- Page objects already available vs. need to be created
- Suggested test file names (e.g. `tests/authentication.spec.ts`)

## Output

Produce a structured summary with:

1. All selected test cases (JSON format)
2. List of required page objects (existing and new)
3. Suggested test file organization

This output is the input for `/generate-page-objects` and `/generate-specs`.

## Notes

- If the Excel file uses different column names, ask the user to map them
- Preserve test case IDs for traceability
- Store results in the conversation context for subsequent steps
