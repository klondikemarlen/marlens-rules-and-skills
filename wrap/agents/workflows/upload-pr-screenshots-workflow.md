---
description: Upload or prepare pull request screenshots without adding image files to the branch
---

# Upload Pull Request Screenshots Workflow

Use this workflow when a pull request needs screenshots in its description or comments.

## Intent

Pull request screenshots should help reviewers understand user-facing changes without making the
feature branch carry temporary image files. Prefer GitHub-hosted user attachments because they
survive branch cleanup and keep screenshots separate from source code.

## Preferred Approach: GitHub User Attachments

GitHub `user-attachments/assets/...` image links are the cleanest option because they do not
require keeping repository branches or files around.

GitHub does not expose a public REST or GraphQL API for creating these attachments. They are created
by the GitHub web UI through a logged-in browser session.

Use this approach when a logged-in browser session is available:

1. Capture screenshots locally in `/tmp/opencode` or another temporary location.
2. Open the target pull request in a logged-in browser session.
3. Edit the pull request description or create a temporary comment.
4. Drop the screenshots onto the GitHub editor, or use the editor attachment control.
5. Wait for GitHub to insert `https://github.com/user-attachments/assets/...` markdown.
6. Copy those generated links into the final pull request description or comment.
7. Save the pull request description or comment.
8. Verify the rendered pull request shows all screenshots.

Do not try to create `user-attachments/assets/...` links with `gh api` alone. Token-only API calls
cannot create those web UI attachments.

## Pull Request Screenshot Format

Use the same screenshot-section style as recent WRAP-adjacent PRs:

- If there are no product UI changes, write one explanatory `N/A` sentence.
- If there are UI changes and screenshots are ready, use screenshot title + URL + GitHub `<img>` tag blocks.
- If screenshots still need manual GitHub upload, leave screenshot title + URL + explicit upload placeholders.

### No product UI changes

```markdown
# Screenshots

N/A — this PR adds end-to-end test infrastructure, Docker/CI wiring, and documentation. It does not change product UI.
```

Use an em dash and explain why screenshots are not useful. Do not write only `N/A`, and do not write
`N/A - backend changes only` unless the reason is exactly backend-only work.

### Screenshots ready

```markdown
# Screenshots

Status page Release Notes card
http://localhost:8080/status
<img width="1845" height="986" alt="Status page Release Notes card" src="https://github.com/user-attachments/assets/..." />
```

Use one block per screenshot:

1. A short human-readable title.
2. The local app URL shown in the screenshot, when applicable.
3. The GitHub-generated `<img>` tag.

### Manual upload still needed

```markdown
# Screenshots

Status page Release Notes card
http://localhost:8080/status
<!-- Drag 01-status-release-notes-card.png into GitHub and paste the generated <img ...> tag here. -->
```

Use placeholders only when screenshots are captured locally but cannot be uploaded through the
current automation session. Do not leave a generic `TODO` list when specific screenshot states and
files are known.

## Screenshot Selection

Set up screenshot state the way a user would. Do not use API calls, service scripts, direct database
inserts, or other backend shortcuts for UI QA or screenshot setup unless the user explicitly approves
that shortcut. If the needed state cannot be reached through user-visible UI actions, stop and ask.

For frontend changes, include screenshots that cover each distinct visible state, not every click in
the testing instructions. Prefer screenshots that answer reviewer questions:

1. What new UI exists?
2. What changed in the happy path?
3. What empty, loading, or error states matter?
4. What does the final user-visible result look like?

For responsive changes, include both desktop and mobile screenshots. For small component changes,
one focused screenshot is often enough.

Only keep screenshots that match a verified, stable UI state. Do not leave screenshots that show
transient loading placeholders, stale test records, or expected outcomes that are not currently
working. If a workflow state is still under investigation, remove that screenshot from the pull
request and add it back after the state can be reproduced and captured accurately.

Pull request screenshot sections should show the final reviewer-facing product state. Keep QA audit
notes, investigation status, and screenshot-capture bookkeeping out of the pull request body.

## Fallback Approach: Manual User Upload

Do not use a dedicated screenshot branch as the fallback. Branch-backed screenshot links are
fragile: they break when the branch is deleted, leave orphaned remote branches behind, and make pull
request descriptions depend on repository storage that is unrelated to code review.

If browser automation cannot access a logged-in GitHub session, prepare everything the user needs to
upload manually:

1. Create a temporary folder with clearly named screenshots, for example
   `/tmp/opencode/pr-390-screenshots/`.
2. Name each image with stable ordering and a descriptive slug, for example
   `01-template-attachments-empty.png`.
3. Draft the exact pull request screenshot text in WRAP style, leaving placeholders where the user
   will paste GitHub-generated image tags.
4. Tell the user to drag the images into the GitHub pull request editor in order.
5. Tell the user to replace each placeholder with the generated `<img ...>` tag.
6. Provide the local screenshot folder path and the complete markdown block to paste into the pull
   request.

Example fallback text:

```markdown
# Screenshots

Template Attachments empty state
http://localhost:8080/administration/templates/123/attachments

<!-- Drag 01-template-attachments-empty.png into GitHub and paste the generated <img ...> tag here. -->

Published workflow Attachments card with copied template document
http://localhost:8080/workflows/2026-001

<!-- Drag 02-workflow-attachments-copied-document.png into GitHub and paste the generated <img ...> tag here. -->
```

## Cleanup

If switching from temporary or draft screenshot links to `user-attachments/assets/...` links:

1. Upload the screenshots through the GitHub web UI first.
2. Update the pull request so no markdown references temporary paths or placeholders.
3. Verify the pull request renders the `user-attachments/assets/...` screenshots.

## Safety Notes

- Use `gh pr view` or `gh api repos/icefoganalytics/wrap/pulls/<number>` to confirm the pull
  request number before editing.
- Prefer `gh api` for pull request body updates when `gh pr edit` hits GitHub Projects Classic
  GraphQL errors.
- Avoid third-party upload tools unless the user explicitly approves them.
- Keep screenshots out of the feature branch unless the user wants them versioned with the code.
