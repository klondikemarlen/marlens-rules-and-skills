---
description: Create and edit well-structured pull requests following WRAP project patterns and conventions
auto_execution_mode: 1
---

# Pull Request Management Workflow

## Intent

**WHY this workflow exists:** Pull requests communicate intent to reviewers and future maintainers. A well-structured PR explains the problem, the solution approach, and how to verify correctness. This reduces review friction and creates valuable documentation.

**WHAT this workflow produces:** A draft PR with:

- Clear title following naming conventions
- Context explaining WHY the change is needed
- Implementation summarizing WHAT was changed (purpose, not files)
- Testing instructions that verify correctness

**Decision Rules:**

- **Title format:** Use `TICKET-ID: Description` for Jira tickets, `Fix: Description` for bug fixes, or `Action Verb + Noun` for features. Always use AP style title case.
- **Context section:** Explains WHY, not what was done. Should read like a bug report or motivation statement, not a summary of changes. Answers: What problem existed? Why did it need fixing?
- **Implementation section:** Explains purpose, not files or methods. Answers: What did each change accomplish? A reviewer can see file changes in the diff - don't repeat that. Avoid naming specific methods, patterns, or files unless they're the subject of the change itself.
- **Screenshots:** Check the diff for `web/src/components/` or `web/src/pages/` changes. If present, follow [`upload-pr-screenshots-workflow.md`](./upload-pr-screenshots-workflow.md) and either add GitHub user-attachment screenshots or leave captioned placeholders for the screenshots still needed. If there are no product UI changes, write one explanatory `N/A — <reason>.` sentence.
- **Draft mode:** Always create PRs as drafts first
- **QA Testing:** Write testing instructions for someone with zero project knowledge, focusing on user interactions rather than technical implementation. Follow the `testing-instructions` workflow for comprehensive guidance on creating detailed, accurate testing instructions with exact UI element names and proper test case structure.
- **Do not stop at PR body drafting:** If the user asks for a PR, assume the testing instructions workflow should also be used unless the user explicitly says not to include testing instructions.
- **Use Jira workflow when the PR depends on issue framing:** If the task references a Jira ticket, a bug report, a PR comment that should become an issue, or asks for ticket creation/update as part of the same work, use the `jira-issue-management` workflow too.
- **Complete workflow sequence:** This is step 3 of 4 in the complete PR creation process. Always use after jira-issue-management and code-review workflows, then follow with testing-instructions workflow for comprehensive test coverage.

This workflow covers the process of creating and editing well-structured pull requests that follow the established patterns in the WRAP project.

## Quick Reference

```bash
# Create draft PR via gh api (preferred)
cat <<'EOF' | gh api repos/{owner}/{repo}/pulls -X POST \
  -F title="Title here" \
  -F head="branch-name" \
  -F base="main" \
  -F draft=true \
  -F body=@-
Fixes <url>

Relates to:

- <related-pr-or-issue-url>

# Context

<context>

# Implementation

1. <change>

# Screenshots

<!-- Follow ./upload-pr-screenshots-workflow.md: title + URL + GitHub image block, title + URL + upload placeholder, or explanatory N/A sentence. -->

# Testing Instructions

<!-- Follow ./testing-instructions-workflow.md for guidance -->
EOF

# Update existing PR via gh api
cat <<'EOF' | gh api repos/{owner}/{repo}/pulls/{number} -X PATCH -F body=@-
[Updated PR body preserving Fixes, Context, Implementation, and Screenshots sections]
EOF
```

## Process Steps

### 1. Gather Context

Before creating a PR, gather all the information you need:

```bash
# Check current branch status
git status

# View commits on this branch
git log main..HEAD --oneline

# View full diff from main
git diff main...HEAD

# Check if branch is pushed
git branch -vv
```

### 2. Update Existing PR (Optional)

When updating an existing PR with new testing instructions or changes:

```bash
# Update PR body via gh api
cat <<'EOF' | gh api repos/icefoganalytics/wrap/pulls/{number} -X PATCH -F body=@-
[Updated PR body - preserve Fixes, Context, Implementation, and Screenshots sections]
EOF
```

**When to update:**

- Adding comprehensive testing instructions
- Updating implementation details
- Adding screenshots after PR creation
- Clarifying context based on reviewer feedback

### 3. Determine PR Title

Use one of these patterns:

| Pattern                  | When to Use              | Example                                                                 |
| ------------------------ | ------------------------ | ----------------------------------------------------------------------- |
| `TICKET-ID: Description` | Linked to Jira ticket    | `WRAPX-304: Include Workflow Step "More Details" Field in Routing Slip` |
| `Fix: Description`       | Bug fixes without ticket | `Fix: Email Logo Not Rendering Correctly in Outlook`                    |
| `Action Verb + Noun`     | Features/improvements    | `Block File Access Request Spam`                                        |

**Title Guidelines:**

- Use **AP style title case** (validate at https://titlecaseconverter.com/?style=AP)
- Be specific but concise
- Start with action verb when no ticket ID

### 4. Write PR Body

Follow this template structure:

```markdown
Fixes <issue-tracker-url>

Relates to:

- <related-pr-or-issue-url>

# Context

<Problem explanation, user reports, motivation>

# Implementation

1. <Implementation detail>
2. <Additional change>

# Screenshots

<Screenshots or "N/A">

# Testing Instructions

<!-- Follow ./testing-instructions-workflow.md for guidance -->
```

**PR Template Usage:**

The GitHub PR template provides the basic structure. Fill in each section following these guidelines:

- **Fixes:** Add issue URL or "N/A" if no specific issue
- **Relates to:** Add related PRs/issues or remove this section entirely
- **Context:** Explain the problem, user reports, or motivation for the change
- **Implementation:** List all changes made in numbered format
- **Screenshots:** Check diff for frontend changes; write "TODO" and let user add screenshots if UI changed, "N/A" only if no frontend files changed
- **Testing Instructions:** Always start with the standard 3 steps, then add specific steps

### 5. Section Guidelines

#### Context Section

- Explain **why** the change is needed (problem-first, not solution-first)
- Should read like a bug report or motivation statement, not a summary of changes
- Include user reports using blockquotes (`>`)
- For bugs, describe root cause if known
- Include "Steps to Reproduce" for bugs

**Good Example (problem-first):**

```markdown
# Context

Email notifications were being sent synchronously during request handling, blocking responses and reducing resilience to mail server outages.

User Report

> We seem to be having an issue with delegation not respecting the timeframes set.

Investigation revealed that our background jobs were failing, and they didn't produce any logs either way.
```

**Bad Example (solution-first - avoid this):**

```markdown
# Context

The mailer system needed to be integrated with the job queue system to enable asynchronous email processing. This was causing issues with mailer tests failing because transporter.sendMail spies weren't being called...
```

#### Implementation Section

- Use numbered list
- Focus on **purpose and intent**, not specific file changes or methods
- Extract meaning from commits - what was the goal of each change?
- A reviewer can see file diffs - tell them WHY, not WHERE
- Avoid naming specific methods, patterns, or files unless they're the subject of the change itself
- Keep it concise: 5-10 items maximum
- Use periods at the end of numbered list items for consistency

**Good Example (purpose-focused):**

```markdown
# Implementation

1. Replace dialog-based editing with dedicated page routes
2. Convert JavaScript API and composables to TypeScript
3. Split monolithic table into modular Card and DataTable components
4. Standardize component naming to match Vuetify patterns
```

**Bad Example (file/method-focused - avoid this):**

```markdown
# Implementation

1. Delete KnowledgeEntryCreateDialog.vue
2. Delete KnowledgeEntryEditDialog.vue
3. Add KnowledgeEntryNewPage.vue
4. Add KnowledgeEntryEditPage.vue
5. Update router.ts
```

**Bad Example (implementation-detail-focused - avoid this):**

```markdown
# Implementation

1. Added queueAs() static method to BaseJob for dynamic queue customization using Proxy pattern
2. Refactored UsersWithAccess service to use User.findAll() instead of reload() to prevent workflow step mutations
```

#### Screenshots Section

**Before writing this section, check the diff:**

```bash
git diff main...HEAD --name-only | grep -E "^web/src/(components|pages)/"
```

- **If files are returned:** UI changes exist - follow [`upload-pr-screenshots-workflow.md`](./upload-pr-screenshots-workflow.md).
- **If no files are returned:** write an explanatory `N/A` sentence, not a bare `N/A`.

**Use the standard screenshot-section styles:**

No product UI changes:

```markdown
# Screenshots

N/A — this PR adds end-to-end test infrastructure, Docker/CI wiring, and documentation. It does not change product UI.
```

Screenshots ready:

```markdown
# Screenshots

Status page Release Notes card
http://localhost:8080/status
<img width="1845" height="986" alt="Status page Release Notes card" src="https://github.com/user-attachments/assets/..." />
```

Manual upload still needed:

```markdown
# Screenshots

Status page Release Notes card
http://localhost:8080/status
<!-- Drag 01-status-release-notes-card.png into GitHub and paste the generated <img ...> tag here. -->
```

Keep QA audit notes, investigation status, local-only paths, and generic TODO lists out of the PR
body. Use a screenshot placeholder only when the exact screenshot title, URL, and file are known.

#### Testing Instructions Section

For comprehensive testing instructions guidance, follow the [`testing-instructions-workflow.md`](./testing-instructions-workflow.md).

**Basic structure:**

```markdown
# Testing Instructions

1. Run the test suite via `dev test` (or `dev test_api`).
2. Boot the app via `dev up`.
3. Log in to the app at http://localhost:8080.
4. <Specific testing steps>
```

### 6. Create the PR

**All PRs should be created in draft mode** to allow for review and iteration before marking ready.

```bash
# Ensure branch is pushed
git push -u origin HEAD

# Create draft PR via gh api
cat <<'EOF' | gh api repos/{owner}/{repo}/pulls -X POST \
  -F title="Title" \
  -F head="$(git branch --show-current)" \
  -F base="main" \
  -F draft=true \
  -F body=@-
[Body content]
EOF
```

To mark a draft PR as ready for review:

```bash
gh api repos/{owner}/{repo}/pulls/NUMBER -X PATCH -F draft=false
```

### 6. Edit Existing Pull Requests

When you need to update an existing PR (add context, fix title, update testing instructions):

```bash
# View current PR details
gh pr view NUMBER

# Edit PR title
gh pr edit NUMBER --title "New Title"

# Edit PR body
gh pr edit NUMBER --body "$(cat <<'EOF'
Updated PR body content
EOF
)"

# Or edit interactively
gh pr edit NUMBER
```

**Common Scenarios for Editing:**

| Scenario                   | What to Update                                                      |
| -------------------------- | ------------------------------------------------------------------- |
| **Missing context**        | Add detailed problem explanation to Context section                 |
| **Unclear implementation** | Expand Implementation section with numbered list                    |
| **Missing screenshots**    | Add Screenshots section with images or "N/A - backend changes only" |
| **Incomplete testing**     | Add specific testing steps after the standard 3 steps               |
| **Wrong title format**     | Update title to follow naming patterns                              |
| **Add related issues**     | Add "Relates to:" section with links                                |

**Editing Workflow:**

1. **Assess what's missing** - Compare current PR against the quality checklist
2. **Gather missing information** - Get screenshots, testing steps, or context
3. **Update systematically** - Edit one section at a time if needed
4. **Verify completeness** - Run through the quality checklist again

### 7. Quality Checklist

Before submitting:

- [ ] PR created as draft
- [ ] Title follows naming pattern
- [ ] Context explains the "why"
- [ ] Implementation lists all changes
- [ ] Screenshots included for UI changes
- [ ] Testing instructions start with standard steps
- [ ] All tests pass locally
- [ ] Type checking passes: `npm run type-check` (from /api)
- [ ] Linting passes: `npm run lint` (from /api)
- [ ] No `@ts-ignore`, `@ts-expect-error`, or `any` types

## WRAP-Specific Patterns

### Testing Commands

Always use these exact commands in testing instructions:

- **Tests:** `dev test` (from project root) or `dev test_api` (from project root)
- **Type checking:** `npm run type-check` (from /api)
- **App startup:** `dev up`
- **Login URL:** http://localhost:8080

### Code Quality Standards

- TypeScript only - no `any`, `@ts-expect-error`, `@ts-ignore`, or `!`
- Use full descriptive names (no abbreviations)
- Follow expanded code style with guard clauses
- Use `@/` import alias for src directory

### Common UI Navigation Patterns

- **Administration** → **Positions** → **Users** tab
- **Workflows** → **Create Workflow**
- **Reports** → **Workflow Reports** → **Generate Report**

## Pattern Examples from Repository

### Bug Fix without Ticket (PR #285)

```markdown
# Block File Access Request Spam

Fixes https://app.hiverhq.com/...

# Context

When a user clicks on a file in the attachments panel, there can be a delay...
Users may repeatedly click the file, causing multiple API requests...

# Implementation

1. Block clicking on file while already loading access.

# Screenshots

<img width="2778" height="1441" alt="Workflow Attachment panel" src="..." />

# Testing Instructions

<!-- Follow ./testing-instructions-workflow.md for guidance -->
```

### Feature with Jira Ticket (PR #281)

```markdown
# WRAPX-304: Include Workflow Step "More Details" Field in Routing Slip

Fixes https://yg-hpw.atlassian.net/browse/WRAPX-304

# Context

User Report

> WRAP routing slips are not capturing the information entered in the "More Details" field.

# Implementation

1. Add "more details" section to printed routing slip.
2. Add print routing slip option to closed workflow actions menu.

# Screenshots

<img width="726" height="604" alt="Updated routing slip" src="..." />

# Testing Instructions

<!-- Follow ./testing-instructions-workflow.md for guidance -->
```

### Backend Refactor (PR #283)

```markdown
# Plug User Position Workflow Access Removal Leak

Fixes https://app.hiverhq.com/...

# Context

When positions or teams are deleted, the destroy services were using bulk
`Model.destroy()` calls which bypass cleanup logic.

**Root cause:** 356 orphaned records in production.

## Leaks Found and Fixed

| Location                       | Issue                         | Fix                                          |
| ------------------------------ | ----------------------------- | -------------------------------------------- |
| `positions/destroy-service.ts` | Bulk destroy bypassed cleanup | Uses `findEach` + `DestroyService.perform()` |

# Implementation

1. **Positions.DestroyService**: Replaced bulk destroys with `findEach` loops.
2. **Teams.DestroyService**: Same pattern applied.
3. Iterate on `toChange` matcher and add `toNotChange` support.

# Screenshots

N/A - backend changes only

# Testing Instructions

<!-- Follow ./testing-instructions-workflow.md for guidance -->
```

## Common Pitfalls

| Pitfall                                       | Solution                                                                    |
| --------------------------------------------- | --------------------------------------------------------------------------- |
| PR not in draft mode                          | Always create PRs as drafts using `draft=true`                              |
| Vague context                                 | Be specific about the problem and user impact                               |
| Missing testing steps                         | Start with standard 3 steps for WRAP                                        |
| No screenshots for UI                         | Always include for visual changes                                           |
| Marking screenshots N/A when UI changed       | Check diff for `web/src/components/` or `web/src/pages/` before writing N/A |
| Unclear scope                                 | Separate core changes from side fixes                                       |
| Missing links                                 | Include Fixes/Relates to URLs                                               |
| Wrong test commands                           | Use `dev test` not generic test commands                                    |
| Type checking ignored                         | Always run `npm run type-check` (from /api)                                 |
| Implementation lists files instead of purpose | Focus on WHY changes were made, not WHAT files were changed                 |

## Related Workflows

- [`./jira-issue-management-workflow.md`](./jira-issue-management-workflow.md) - Creating, enhancing, and managing Jira issues
- [`./testing-instructions-workflow.md`](./testing-instructions-workflow.md) - Writing testing instructions
- [`./code-review-workflow.md`](./code-review-workflow.md) - Code review quality control

---

**Last Updated:** 2026-01-26

_Update this workflow when you discover better patterns or WRAP project conventions evolve._
