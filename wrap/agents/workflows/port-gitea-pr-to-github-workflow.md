# Port Gitea PR to GitHub Workflow

This workflow describes how to port a pull request from a local Gitea instance to GitHub when GitHub is back online.

## When to Use

Use this workflow when:

- GitHub is temporarily unavailable
- Work has been done on a local Gitea instance
- GitHub comes back online and the PR needs to be recreated there

## Prerequisites

- Git is configured to push to both GitHub and local Gitea simultaneously
- The branch exists on both platforms with identical commits
- Tea CLI is configured with login to the local Gitea instance
- Local Gitea instance is running (see [docs/Docs, Local Gitea Setup, 2026-04-27.md](../../docs/Docs,%20Local%20Gitea%20Setup,%202026-04-27.md) for setup instructions)

## Steps

1. **Extract PR details from Gitea**

   - Use `tea pr view <pr-number> --login <login-name> --repo <repo-name> --state all --fields index,title,body --output yaml` to get PR details including body
   - The `--state all` flag is required to access merged/closed PRs
   - The `--fields index,title,body` flag requests the body field
   - The `--output yaml` flag ensures full content is returned in parseable format
   - Example: `tea pr view 1 --login local --repo klondikemarlen/wrap --state all --fields index,title,body --output yaml`

2. **Verify GitHub is accessible**

   - Check that GitHub API is responding
   - Verify the branch exists on GitHub

3. **Create the PR on GitHub**

   - Use `gh pr edit <pr-number>` to update an existing PR, or `gh pr create` for a new PR
   - Include the full PR body from the Gitea PR
   - Set the correct base branch if creating a new PR
   - Example for updating: `gh pr edit 345 --body "<description from Gitea>"`

4. **Update now.md**
   - Remove the PR porting section once the PR is created
   - Add a reference to the GitHub PR number for future reference

## Example Commands

```bash
# Extract PR details from Gitea (tea CLI - works for merged/closed PRs)
tea pr view 1 --login local --repo klondikemarlen/wrap --state all --fields index,title,body --output yaml

# Update existing PR on GitHub
gh pr edit 345 --body "<description from Gitea>"

# Create new PR on GitHub
gh pr create --base main --title "<title from Gitea>" --body "<description from Gitea>"
```

## Notes

- PR comments, review history, and discussion cannot be transferred between platforms
- Only the code commits and PR description can be recreated
- The underlying git history will be identical since commits are pushed to both platforms
- Tea CLI requires `--state all` flag to access merged/closed PRs
- Tea CLI requires `--fields index,title,body` to request the body field
- Tea CLI requires `--output yaml` to get full content in parseable format
- Gitea API access may not work reliably; tea CLI is the recommended extraction method
