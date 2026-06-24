# Browser QA Techniques Reference

Use this reference when validating user-facing pull request instructions in a browser. Keep setup and validation user-visible unless the user explicitly approves backend shortcuts.

## Visible browser sessions

- Prefer a visible Chromium session when the user needs to participate in auth, SharePoint, uploads, or external-service steps.
- If using automation, keep actions equivalent to user clicks, typing, scrolling, screenshots, and visible navigation.
- Do not use API calls, service scripts, direct database updates, or log-driven state changes to move the UI into the desired state during browser QA unless the user explicitly approves that shortcut.

## Authentication

- For local WRAP browser QA, `.envrc` may provide `BROWSER_QA_USER_EMAIL`,
  `BROWSER_QA_USER_PASSWORD`, `BROWSER_QA_ADMIN_EMAIL`, and `BROWSER_QA_ADMIN_PASSWORD` for
  Auth0 browser-QA test accounts.
- Do not print credentials in QA notes, PR comments, screenshots, or terminal summaries.
- If staff SSO redirects to Microsoft and no reusable session exists, use the Auth0 database login with the configured admin test account.

## Vuetify interaction notes

- Vuetify button text in the accessibility tree can be uppercased while DOM text is title case. Verify actual visible text before deciding a control is missing.
- Some Vuetify controls are rendered as anchors with button styling. Inspect visible links/buttons in the browser before assuming a click failed.
- When an accessibility click stalls, retry with another user-equivalent browser action such as clicking the visible DOM button/link. Do not switch to backend shortcuts.
- After clicking controls that show snackbars or loading states, wait for the visible state to settle before retrying the same action.
- For async searchable comboboxes such as workflow step **Who** and **What**, type a specific search term, wait for the result list, select the list item, then commit/escape the input with keyboard navigation such as `ArrowDown` + `Enter` or `Tab` before saving. Do not assume typed text alone has selected the entity.

## SharePoint attachment QA

- For template/workflow attachment QA, open the SharePoint folder from WRAP and let the user upload files in SharePoint when automation cannot safely authenticate or upload there.
- After user upload, return to WRAP and use the visible **Refresh** control before validating the attachment list.
- For root-only attachment features, verify that root files appear and nested folders/files do not appear in WRAP.

## Screenshot capture

- Follow [`../workflows/upload-pr-screenshots-workflow.md`](../workflows/upload-pr-screenshots-workflow.md).
- Save temporary screenshots outside the repo, for example `/tmp/opencode/pr-<number>-screenshots/`.
- Capture only stable reviewer-facing states; avoid transient snackbars, loading states, or incomplete investigation states.
- Keep screenshots out of the feature branch unless the user explicitly wants them versioned.
