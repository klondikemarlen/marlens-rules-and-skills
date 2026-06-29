# Commit Workflow

Use when the user explicitly asks to commit, amend, or commit a staged/relevant set of files.

## Intent

**WHY this workflow exists:** Commits are durable history; the agent should create the smallest honest commit without sweeping in unrelated work.

**WHAT this workflow produces:** One logical commit with a repo-conformant message, or a clear blocker when the requested commit is unsafe.

**Decision Rules:**

- Never commit without an explicit current-turn request containing `commit` or `stage`.
- Treat `commit staged` as index-only. If nothing is staged, ask the user to stage the files.
- Stage files only when the user explicitly asks to stage files or asks to commit a named/relevant set.
- Never include unrelated user changes to make the tree clean.
- Prefer one logical change per commit.

## Process

1. Read repo-local commit guidance first, especially `COMMITTING.md` when present.
2. Check `git status --short` and preserve unrelated local work.
3. Inspect staged files with `git diff --cached --name-status` and `git diff --cached --stat`.
4. If the user asked for `commit staged`, commit only the index.
5. If the user asked to commit a named/relevant set, stage only files that clearly belong to that requested change. Avoid `git add .`.
6. Review enough staged diff to understand the purpose with `git diff --cached -- <paths>`.
7. If the purpose or file ownership is unclear, ask instead of guessing.
8. Commit with the repo's message style.
9. If output is terse, verify the result with `git log -1 --oneline`.

## Output Contract

Report the commit hash and subject, then mention any remaining unstaged or untracked files. Do not claim tests or checks passed unless they ran in this turn.
