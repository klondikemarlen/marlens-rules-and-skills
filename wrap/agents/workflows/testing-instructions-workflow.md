---
description: Generate comprehensive testing instructions for pull requests
---

# Testing Instructions Workflow

This workflow guides you through creating comprehensive, accurate testing instructions for a pull request.

## Intent

**WHY this workflow exists:** Pull requests need clear, actionable testing instructions that developers can follow to validate changes. Without proper testing instructions, PR validation becomes inconsistent and error-prone.

**WHAT this workflow produces:**

- Comprehensive testing instructions with exact UI element names
- Sequential test cases covering happy paths, edge cases, and error conditions
- Proper formatting following WRAP project standards
- Navigation paths and verification steps for each test scenario

**Decision Rules:**

- **Always verify UI element names**: Never guess button names, tab names, or labels - search the Vue code
- **Use exact formatting**: Follow the established bold formatting and sequential numbering patterns
- **Cover all scenarios**: Include happy paths, edge cases, error conditions, and cleanup flows
- **Be specific**: Include exact navigation paths, field labels, and expected outcomes
- **Complete workflow sequence:** This is step 4 of 4 in the complete PR creation process. Always use after jira-issue-management, code-review, and pull-request-management workflows to provide comprehensive test coverage for the created PR.

---

## Process

### Step 1: Understand the PR changes

Read the PR description to understand:

- What feature or bug is being addressed
- What specific functionality changed
- What edge cases need testing
- Any concerns/questions raised

Identify the main test scenarios that need coverage.

### Step 2: Find actual UI element names from Vue code

**CRITICAL**: Always verify exact button names, tab names, and UI element labels from the actual Vue components. Never guess or assume names.

#### Finding button text and labels:

```bash
# Find button text in Vue components
grep -r "v-btn" web/src --include="*.vue" | grep -i "keyword"

# Find specific button labels
grep -r ">Create" web/src --include="*.vue"
grep -r ">Add" web/src --include="*.vue"
grep -r ">Save" web/src --include="*.vue"

# Find tab names
grep -r "v-tab" web/src --include="*.vue"

# Find form field labels
grep -r "label=" web/src --include="*.vue" | grep -i "keyword"
```

#### Finding navigation structure:

```bash
# Find router paths and page names
grep -r "router-link" web/src --include="*.vue" | grep -i "keyword"
grep -r "to=" web/src --include="*.vue" | grep -i "keyword"

# Find menu items
grep -r "v-list-item" web/src --include="*.vue"
grep -r "v-navigation" web/src --include="*.vue"
```

#### Example searches for common UI patterns:

```bash
# Workflow-related buttons
grep -r "Create Workflow" web/src --include="*.vue"
grep -r "Add Step" web/src --include="*.vue"

# Tab components
grep -r 'v-tab.*Shared With' web/src --include="*.vue"
grep -r 'v-tab.*Steps' web/src --include="*.vue"

# Form buttons
grep -r "Submit" web/src --include="*.vue"
grep -r "Cancel" web/src --include="*.vue"
```

### Step 3: Verify navigation paths

Check the actual navigation structure:

```bash
# Find page components and their routes
cat web/src/router/index.ts

# Find sidebar navigation items
find web/src/components -name "*Nav*" -o -name "*Sidebar*" -o -name "*Menu*"
```

Read relevant navigation components to understand:

- Exact menu item text
- Navigation hierarchy
- Page locations

### Step 4: Structure test cases

Break testing into logical test cases:

- **Test Case 1**: Main happy path scenario
- **Test Case 2**: Edge cases and variations
- **Test Case 3**: Error conditions or negative tests
- **Test Case 4**: Additional scenarios specific to the feature

Each test case should:

- Have a clear descriptive heading
- Test one specific aspect of the functionality
- Include verification steps with expected outcomes

### Step 5: Write testing instructions following the standard format

Use this exact structure:

```markdown
# Testing Instructions

1. Run the relevant test suite via `./bin/dev test api -- --run` or a narrower `./bin/dev test api -- --run <path>` command
2. Boot the app via `./bin/dev up`
3. Log in to the app at http://localhost:8080

## Test Case 1: [Descriptive scenario name]

4. From the main app Dashboard, [first action]
5. Click **[Exact Button Name]** button
6. Fill in [form/dialog details]:
   - **[Field Label]**: [Instructions or example value]
   - **[Another Field]**: [Instructions]
7. Click **[Submit Button Name]** to submit
8. Verify [expected outcome]
9. Navigate to **[Page/Tab Name]** via [navigation path]
10. Verify [specific validation]

## Test Case 2: [Another scenario]

11. [Continue numbered sequence]
    ...
```

### Step 6: Follow formatting guidelines

**Required formatting rules:**

1. **Bold all UI elements**: `**Create Workflow**`, `**Shared With** tab`, `**Add User** button`
2. **Use exact button text**: Search the code to find the actual button text, don't guess
3. **Sequential numbering**: Number steps continuously across all test cases (don't restart at 1)
4. **Navigation arrows**: Use `→` for navigation paths: `**Administration** → **Users** → **Positions** tab`
5. **Specific locations**: "From the main app Dashboard", "in the right hand side panel", "via the left sidebar nav"
6. **Clear verification steps**: "Verify the table displays **Column Name** column", "Verify success message: 'exact text'"
7. **Test case headings**: Use `## Test Case N: Description` format
8. **Inline code for values**: Use backticks for URLs, exact error messages, field values

### Step 7: Include all test scenarios

Ensure coverage of:

- ✅ Main happy path functionality
- ✅ Edge cases (e.g., user on multiple steps, empty states)
- ✅ Error conditions (e.g., validation errors, permission errors)
- ✅ Data persistence (verify data survives page refresh if relevant)
- ✅ Cleanup/deletion flows
- ✅ Any concerns mentioned in the PR description

### Step 8: Review and validate

Before finalizing:

- [ ] All UI element names match actual code
- [ ] Navigation paths are accurate
- [ ] All test cases have clear expected outcomes
- [ ] Sequential numbering is correct
- [ ] Bold formatting is applied to all UI elements
- [ ] Each test case tests a distinct scenario
- [ ] Edge cases from PR description are covered

## Example Output

```markdown
# Testing Instructions

1. Run the relevant test suite via `./bin/dev test api -- --run` or a narrower `./bin/dev test api -- --run <path>` command
2. Boot the app via `./bin/dev up`
3. Log in to the app at http://localhost:8080

## Test Case 1: User can create a workflow and add players via steps

4. From the main app Dashboard, click **Create Workflow** button
5. Fill in the workflow details:
   - **Title**: Enter "Test Workflow"
   - **Description**: Enter any description
6. Click **Create Draft** button to submit
7. Click **Add Step** button in the right hand side panel
8. Fill in the step details:
   - **Name**: Enter "Review Step"
   - **Players**: Select at least one user
9. Click **Add Step** to submit
10. Click the **Shared With** tab
11. Verify the user you added as a step player appears in the **Shared With** list
12. Verify the user has the correct access level displayed

## Test Case 2: Removing a player from a step removes workflow access

13. From the previous workflow, click the **Steps** tab
14. Click on the step you created in Test Case 1
15. Click the remove icon next to the player's name
16. Click **Confirm** in the confirmation dialog
17. Navigate to the **Shared With** tab
18. Verify the user no longer appears in the **Shared With** list
```

## Browser QA Reference

For browser-driven validation, visible-browser auth handoffs, Vuetify interaction tactics,
SharePoint upload QA, and screenshot capture notes, read
[`../references/browser-qa-techniques-reference.md`](../references/browser-qa-techniques-reference.md).

## Related Workflows

- [`./jira-issue-management-workflow.md`](./jira-issue-management-workflow.md) - Creating, enhancing, and managing Jira issues
- [`./pull-request-management-workflow.md`](./pull-request-management-workflow.md) - Create and update pull requests with comprehensive testing instructions
- [`./code-review-workflow.md`](./code-review-workflow.md) - Code review quality control

## Tips

- When in doubt about UI element names, always check the code first
- Use code search (Fast Context) to quickly find relevant Vue components
- Pay attention to Vuetify component patterns (v-btn, v-tab, v-dialog, etc.)
- Check both the component files and any related store/service files
- Test instructions should be detailed enough that someone unfamiliar with the feature can follow them
- Include both success paths and failure paths when relevant
