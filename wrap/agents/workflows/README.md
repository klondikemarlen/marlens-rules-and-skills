# Workflows

This directory contains reusable AI workflows for the WRAP system.

## Important

This file is an index, not the source of truth for workflow behavior.

Agents should use this README to discover relevant workflow files, then read the actual
`*-workflow.md` files directly before acting. Do not rely on the summaries in this file alone
for implementation details, constraints, or required steps.

Workflow filenames in this directory should end in `-workflow.md`.

## Intent

These workflows exist to ensure consistent, high-quality output from AI agents. Each workflow:

- Defines a specific transformation or task with clear inputs and outputs
- Provides exact patterns to follow (not guidelines to interpret)
- Includes decision rules for edge cases

**For AI Agents:** Follow steps literally. When unsure, prefer the explicit example over inference.

**Related:** Workflows reference reusable templates in [`agents/templates/`](../templates/).

## Discovery

Use this README to understand what workflows are for, then search `agents/workflows/` and read the
relevant `*-workflow.md` files directly.

Prefer discovering workflows by task or domain rather than relying on a hardcoded inventory here.
Useful search patterns include:

- `rg -n "pull request|testing instructions|jira|admin ui|dashboard filter" agents/workflows`
- `find agents/workflows -maxdepth 1 -name '*-workflow.md' | sort`

### Complete PR Creation Sequence

For a full PR workflow, follow these steps in order:

1. **[jira-issue-management-workflow.md](./jira-issue-management-workflow.md)** — Create/update the Jira issue
2. **[code-review-workflow.md](./code-review-workflow.md)** — Review code quality before PR
3. **[pull-request-management-workflow.md](./pull-request-management-workflow.md)** — Create the draft PR
4. **[testing-instructions-workflow.md](./testing-instructions-workflow.md)** — Add comprehensive testing instructions

When the PR includes visible UI changes, also follow
**[upload-pr-screenshots-workflow.md](./upload-pr-screenshots-workflow.md)** to add or prepare
reviewable screenshots without committing temporary image files.

Use **[playwright-qa-workflow.md](./playwright-qa-workflow.md)** when the current branch needs
browser-driven QA evidence or when PR testing instructions must be validated against the live UI with
Playwright.

### Release Notes

Use **[release-notes-workflow.md](./release-notes-workflow.md)** when drafting WRAP release notes
from PRs, commits, deployed versions, Jira tickets, or status pages.

---

## Query Extraction Pattern

When branch work turns an inline SQL scope into a reusable query builder:

- prefer one query builder per file under `api/src/queries/...`
- export it from the nearest query barrel
- update the model scope to consume the query builder instead of inline SQL
- add a mirrored direct query test under `api/tests/queries/...`
- if the extraction deletes an old path, remove stale top-level barrel imports too

See [api/src/queries/README.md](../../api/src/queries/README.md) for the source-of-truth query guidance.

---

## Branch Continuation Pattern

When resuming ongoing branch work, start from the repository state instead of chat memory alone:

- read `git status --short --untracked-files=all` and recent branch commits
- inspect staged changes separately from unstaged changes
- treat staged files as intentionally selected work unless the user says otherwise
- preserve unrelated unstaged and untracked work, including plan files, unless explicitly asked to
  stage or commit them
- compare any existing plan against the current code and commits before using it as a checklist
- summarize completed, staged, unstaged, and blocked work separately when handing off context

For large feature work, keep implementation and review slices atomic. Prefer committing one domain
or safety improvement at a time over bundling migrations, API wiring, frontend UI, and documentation
changes into one large commit.

---

## Using Workflows

Workflows are designed to be used with AI coding assistants like Claude or Windsurf.

After identifying a relevant workflow here, read that workflow file end-to-end and follow the
workflow file itself as the authoritative instruction set.

**Example:**

```
Follow the workflow in agents/workflows/pull-request-management-workflow.md
to create a PR for my changes.
```

**Another Example:**

```
Follow the workflow in agents/workflows/pull-request-management-workflow.md
to update an existing PR with missing context.
```

**Another Example:**

```
Follow the workflow in agents/workflows/jira-issue-management-workflow.md
to create a Jira ticket for this bug.
```

**Another Example:**

```
Follow the workflow in agents/workflows/testing-instructions-workflow.md
to create testing instructions for this PR.
```

See parent [agents/README.md](../README.md) for setup instructions.

---

**Last Updated:** 2026-06-15
