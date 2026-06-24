---
description: Build concise WRAP release notes from PRs, commits, deployed versions, and status pages
auto_execution_mode: 1
---

# Release Notes Workflow

## Intent

**WHY this workflow exists:** WRAP release notes are assembled from PRs, commit ranges, tags,
deployment status pages, and deploy/release PRs. A repeatable workflow keeps notes factual,
user-focused, and ready for the in-app release notes data model without pretending that release-note
drafting is fully automated.

**WHAT this workflow produces:** Human-reviewed, seed-ready release note data with:

- `version`: release tag, e.g. `v2026.06.09.01`.
- `title`: concise release theme shown in the app.
- `sha`: full 40-character upstream commit SHA for the release tag.
- `order`: newest-first display order.
- `entries`: categorized bullets, each with `category`, `body`, and per-release `order`.
- A release PR reminder/checklist item that makes release-note generation explicit before deploy.
- Clear distinction between user-facing changes and internal-only changes.

**Decision Rules:**

- **Prefer deployed versions:** Check `_status` for UAT and production when release IDs are needed.
- **Use local git first:** If release tags exist locally, compare those commits before relying on
  GitHub.
- **Verify upstream SHAs:** Resolve release tags against the upstream `ytgov/wrap` history when
  linking release notes to GitHub commits.
- **Use PR metadata for scope:** When a PR URL is provided, read the PR title, body, commits, and
  changed files to identify the release theme.
- **State access limits:** If a status page is blocked by Cloudflare or unavailable, mention that
  validation could not be completed instead of guessing.
- **User impact first:** Lead with what users, admins, or support contacts will notice; move
  implementation details into bullets only when they explain the impact.
- **Internal-only releases:** Explicitly say "End users will see no functional changes" when the diff is
  tooling, tests, documentation, or infrastructure only.
- **Seed-ready output:** Write entries for `api/src/db/seeds/data/release-notes.yaml`, using Keep a
  Changelog categories for `category` values: `Added`, `Changed`, `Deprecated`, `Removed`, `Fixed`,
  or `Security`.
- **AI draft safety:** If release notes are AI-generated from commits, PRs, Jira tickets, or diffs,
  treat them as drafts that require human review before publishing or emailing.
- **No overclaiming:** Do not say a release is deployed to Production unless `_status`, a tag, or user
  context confirms it.
- **Make space in release PRs:** Release PRs should include an unchecked release-notes task so the
  deploy flow deliberately asks a human or CLI AI agent to draft, review, and seed release notes.
- **Human approval required:** AI agents may draft and update seed data, but a person remains
  responsible for deciding that notes are accurate enough to publish.

## Sources

Use the most specific sources available:

1. User-provided PR URL, commit, tag, or version comparison
2. Local git history and tags
3. Upstream GitHub tag/commit metadata from `ytgov/wrap`
4. GitHub PR metadata
5. UAT status: `https://yg-wrap-uat.azurewebsites.net/_status`
6. Production status: `https://wrap.service.yukon.ca/_status`

Related product ticket: https://yg-hpw.atlassian.net/browse/WRAPX-381

WRAPX-381 is the source of truth for the desired release note feature and style:

- Release notes should be visible inside WRAP so administrators and support contacts can reference
  changes without searching email threads.
- Release notes live in app data with structured `version`, `sha`, `order`, and entry rows.
- Release notes should eventually support admin draft/edit/publish controls, subscription emails, and
  AI-assisted drafting.
- Generated notes should separate user-facing changes from internal-only changes and should never be
  published or emailed without human approval.
- A useful external reference is the GitHub releases pattern:
  https://github.com/openai/codex/releases

Useful commands from the repo root:

```bash
rtk gh pr view 384 --repo ytgov/wrap --json number,title,body,mergeCommit,baseRefName,headRefName,commits,files,url
rtk git log --oneline <previous-commit>..<release-commit>
rtk git diff --stat <previous-commit>..<release-commit>
rtk git tag --points-at <release-commit>
rtk git for-each-ref --format='%(refname:short) %(objectname)' refs/tags/<release-tag>
rtk curl -s https://yg-wrap-uat.azurewebsites.net/_status
rtk curl -s https://wrap.service.yukon.ca/_status
rtk ./bin/dev release uat
rtk ./bin/dev release prod
```

## Steps

1. **Create or update the release PR reminder**
   - `./bin/dev release ...` generated PR bodies should include:
     - an unchecked release-notes checklist item
     - an AI prompt for `omp`, `codex`, `claude`, or another coding agent to draft/review the seed data
   - Use this checklist wording unless the release PR template already has an equivalent:
     `- [ ] Generate and review in-app release notes before deploying this release.`
   - Treat the checkbox as a workflow gate for the human or CLI AI agent doing the deploy work, not as
     proof that the seed data is already correct.

2. **Identify the release version**
   - Use the user-provided version when present.
   - Otherwise check tags on the merge commit with `git tag --points-at`.
   - Check UAT and production `_status` only when deployment state matters.

3. **Identify the comparison base**
   - Use the previous release version or commit from the user.
   - Otherwise compare against the previous release tag in local history.
   - For PR-based releases, compare the previous deployed commit to the PR merge commit.

4. **Resolve the release SHA**
   - Use the full 40-character commit SHA for the release tag.
   - Prefer the upstream `ytgov/wrap` commit when validating GitHub links.
   - Do not use date-like version suffixes such as `2026061001` as SHAs.

5. **Summarize the theme**
   - Read the PR title/body and commit headlines.
   - Group changes into one release theme, not one sentence per commit.
   - Use that theme as the release note `title`.
   - Call out important bug fixes separately from cleanup or test-only work.
   - Identify whether the release is user-facing, administrator-facing, support-facing, operational,
     or internal-only.

6. **Write seed entries on the release PR branch**
   - Add or update entries in `api/src/db/seeds/data/release-notes.yaml`.
   - Commit release-note seed changes to the release PR branch so the release deploy carries the notes
     for the release it is deploying.
   - Keep release notes newest first with sequential `order` values.
   - Keep entry `order` values sequential within each release note.
   - Use only the category values with entries.
   - Prefer one concise `body` sentence per user-observable change.

Example seed shape:

```json
{
  "version": "v2026.06.05.02",
  "title": "Improve support emails and directory sync stability",
  "sha": "2cfaa5cb9d7e769bac58eae688e99cb6cc90d488",
  "order": 4,
  "entries": [
    {
      "category": "Fixed",
      "body": "Fixed organization acronym changes not propagating to sequences and routing slugs.",
      "order": 1
    },
    {
      "category": "Fixed",
      "body": "Organizations controller now uses the centralized UpdateService for consistency.",
      "order": 2
    }
  ]
}
```

7. **Verify before committing or marking the PR checkbox complete**
   - Validate release note orders are unique and sequential.
   - Validate versions are unique.
   - Validate SHAs are 40-character git hashes and match local/upstream tags.
   - Validate entry orders are sequential per release note.
   - Run the focused typecheck or seed command affected by the edit.
   - Only check the release PR item after seed data exists, has been reviewed, and has passed the
     relevant verification.

## Style

- Keep each `body` concise and factual.
- Use Keep a Changelog category names as data values, not Markdown headings.
- Prefer bullets that start with nouns or verbs users understand.
- Avoid file paths unless the release is developer-only.
- Mention "support email", "workflow mention emails", "directory sync", or similar product concepts
  instead of raw service names when possible.
- Keep entries easy to scan from newest to oldest.
- Mention deployment context only when it is user-relevant and known; otherwise omit it from seed data.

## Required Content

Every release note should include:

- **Version:** `vYYYY.MM.DD.NN`.
- **Title:** concise user-facing theme.
- **SHA:** full upstream commit SHA for the tagged release.
- **Release order:** unique, newest-first integer.
- **Categorized entries:** concrete `Added`, `Changed`, `Deprecated`, `Removed`, `Fixed`, or
  `Security` entries.
- **Impact classification:** make internal-only releases explicit in the entry body when end users
  should see no functional changes.

Every release PR should include:

- **Release-note checklist:** `- [ ] Generate and review in-app release notes before deploying this release.`

For future admin-managed release notes, preserve or derive these fields:

- `version`
- `title`
- `sha`
- `order`
- `entries.category`
- `entries.body`
- `entries.order`
- publication/draft metadata when that feature exists
