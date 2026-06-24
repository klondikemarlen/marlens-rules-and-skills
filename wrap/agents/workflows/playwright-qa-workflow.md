---
description: Run browser QA for pull requests with Playwright using WRAP testing-instruction standards
---

# Playwright QA Workflow

This workflow guides AI agents through browser-driven QA for WRAP pull requests using Playwright while preserving the testing-instruction standards in [`testing-instructions-workflow.md`](./testing-instructions-workflow.md).

## Intent

**WHY this workflow exists:** PR testing instructions are only useful when they match the real UI. Playwright QA validates the current branch in a browser so the PR can say what was actually exercised, not what is assumed from code.

**WHAT this workflow produces:**

- A Playwright-driven browser QA run against the current branch
- Verified UI element names, routes, and expected states for PR testing instructions
- A concise QA evidence summary listing exact scenarios exercised and any blockers
- Updated PR testing instructions when the current instructions are missing or inaccurate

**Decision Rules:**

- **Use Playwright for user-visible flows:** Click, type, navigate, wait, and assert through the UI. Do not use API calls, direct database writes, logs, or scripts to create state unless the user explicitly approves that shortcut.
- **Use the testing-instructions workflow as the formatting source:** Before writing or editing PR testing instructions, read [`testing-instructions-workflow.md`](./testing-instructions-workflow.md) and follow its exact structure, numbering, UI-name, and formatting rules.
- **Verify exact UI names in the browser and Vue code:** If the browser and code disagree, report the mismatch and prefer the visible browser label in testing instructions.
- **Keep authentication safe:** Use configured browser-QA accounts or an existing visible session. Never print credentials in notes, PR comments, screenshots, or summaries.
- **Prefer visible, reviewer-relevant evidence:** Screenshots are useful for UI PRs, but keep temporary image files outside the repo unless the user explicitly asks to version them.

---

## Process

### Step 1: Understand the PR and expected test scenarios

1. Read the PR body or current branch diff to identify:
   - user-facing behavior changed
   - API or seed data needed by the UI flow
   - edge cases and failure states the PR claims to handle
   - existing testing instructions that need verification or replacement
2. Read [`testing-instructions-workflow.md`](./testing-instructions-workflow.md) before drafting or editing instructions.
3. Read [`../references/browser-qa-techniques-reference.md`](../references/browser-qa-techniques-reference.md) when the flow involves auth, Vuetify controls, SharePoint, uploads, screenshots, or visible-browser handoff.

### Step 2: Prepare the app the same way a tester would

1. Run the focused automated checks that support the browser scenario, for example:

   ```bash
   ./bin/dev test api -- --run api/tests/controllers/<relevant-test>.test.ts
   ./bin/dev web npm run check-types
   ```

2. Boot the local stack with the project wrapper:

   ```bash
   ./bin/dev up
   ```

3. Open the app at `http://localhost:8080` in Playwright.
4. Log in through the UI. If credentials are unavailable or SSO blocks the run, stop and report the exact blocker instead of bypassing the UI with backend state changes.

### Step 3: Drive the browser like a tester

For each scenario:

1. Start from the same route or navigation path a tester will use.
2. Use user-equivalent actions only:
   - click visible buttons or links
   - type into fields
   - select visible options
   - scroll when needed
   - refresh the page when persistence matters
3. Wait for visible loading states, route changes, and async lists to settle before asserting.
4. Assert reviewer-relevant outcomes:
   - page heading or card title appears
   - table/list rows contain expected values
   - empty state is shown when no data exists
   - links navigate to the expected route or external URL
   - pagination, filters, or dialogs update visible content
5. Capture screenshots only for stable reviewer-facing states and save them outside the repo, such as `/tmp/opencode/pr-<number>-screenshots/`.

### Step 4: Record automated review evidence

Automated review comments should be reviewer-facing, not a transcript. Keep them short enough to scan in a PR timeline and separate durable signal from local investigation noise.

Use this format for PR comments:

```markdown
## Automated Review: Browser QA

**Result:** Passed, with notes.

**Checks**
- `dev web npm run check-types` — passed.
- `dev test api -- --run path/to/test.ts` — passed.

**Browser coverage**
- `/route` — verified `<visible outcome>`.
- **UI action** — verified `<visible outcome>`.

**Notes**
- `<Only include reviewer-relevant caveats, such as local setup repair or intentionally untested scope.>`

**Screenshots**
- Added to PR description, or `N/A — <reason>.`

**Blockers**
- None.
```

Rules:

- Start with **Result** so reviewers know whether action is needed.
- Use **Checks** for final observed command results only; move initial failed attempts or local setup repair into **Notes**.
- Use **Browser coverage** for user-visible scenarios, one bullet per route or interaction.
- Do not include local-only screenshot paths unless the user must upload them manually. Prefer "Added to PR description" after GitHub attachment upload, and ensure the PR screenshot section uses screenshot title + URL + image blocks.
- Do not claim broad coverage. Say exactly what Playwright exercised.

### Step 5: Update PR testing instructions

When browser QA changes or confirms the testing instructions:

1. Follow the structure from [`testing-instructions-workflow.md`](./testing-instructions-workflow.md):
   - numbered setup steps
   - `## Test Case N: Description` headings
   - continuous numbering across test cases
   - bold UI element names
   - inline code for literal values, URLs, and errors
2. Include the focused automated command(s) actually relevant to the branch.
3. Include the exact browser navigation path validated by Playwright.
4. Include both success and edge/error states that the PR changes.
5. If a scenario could not be tested, write the blocker explicitly instead of replacing it with an unverified instruction.

### Step 6: Final review before handoff

Before reporting QA complete:

- [ ] Playwright drove the same UI path described in the testing instructions
- [ ] UI element names were verified in the browser or Vue source
- [ ] Automated checks are listed with exact command and observed result
- [ ] Browser assertions are listed with exact visible outcomes
- [ ] Screenshots, if used, are outside the repo or uploaded through the PR screenshot workflow
- [ ] Any blocker is concrete and reproducible

## Output Format

For PR comments, use the **Automated Review: Browser QA** format from Step 4.

For the final chat response, summarize only:

```markdown
Browser QA complete.

- PR comment: <link>
- PR testing instructions: updated/no change needed
- Screenshots: added to PR description / prepared for manual upload / N/A
- Blockers: none / <specific blocker>
```

## Related Workflows

- [`./testing-instructions-workflow.md`](./testing-instructions-workflow.md) — source of truth for PR testing-instruction format
- [`./pull-request-management-workflow.md`](./pull-request-management-workflow.md) — create or update pull requests
- [`./upload-pr-screenshots-workflow.md`](./upload-pr-screenshots-workflow.md) — attach reviewer screenshots without committing temporary files
