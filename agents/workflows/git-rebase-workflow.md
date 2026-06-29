# Git Rebase Workflow

Use when the user asks to fix up, amend, reword, squash, or reorder commits that are not `HEAD`.

## Intent

**WHY this workflow exists:** Rewriting older commits is easy to get wrong non-interactively. The safe path is to create an explicit fixup commit, autosquash it, and preserve unrelated work.

**WHAT this workflow produces:** A rewritten local branch history with the requested change folded into the target commit, or a clear blocker when the worktree is unsafe.

**Decision Rules:**

- Never rewrite public/shared branch history unless the user explicitly asks for that exact branch rewrite.
- Preserve unrelated staged, unstaged, and untracked files. Stop if the target change is mixed with unrelated work.
- Prefer `git commit --fixup <commit>` plus `git rebase -i --autosquash <commit>^` for content changes to older commits.
- Prefer `git commit --fixup=reword:<commit>` plus autosquash for message-only rewords when the installed Git supports it.
- Avoid opening an editor. Use `GIT_SEQUENCE_EDITOR=true` for autosquash rebases when the generated todo is sufficient.
- After rewriting commits that were already pushed, use `git push --force-with-lease`, never plain force.

## Process

1. Inspect branch and worktree state:

   ```bash
   git status --short
   git branch --show-current
   git log --oneline --decorate -n 20
   ```

2. Identify the target commit hash and the branch range to rewrite. If the target is unclear, ask.

3. For content changes to an older commit:

   ```bash
   git add <only-files-for-this-fixup>
   git commit --fixup <target-commit>
   GIT_SEQUENCE_EDITOR=true git rebase -i --autosquash <target-commit>^
   ```

   If the target commit is the root commit, use `git rebase -i --autosquash --root`.

4. For message-only changes to an older commit, first try:

   ```bash
   git commit --allow-empty --fixup=reword:<target-commit>
   GIT_SEQUENCE_EDITOR=true git rebase -i --autosquash <target-commit>^
   ```

   If the installed Git does not support `--fixup=reword:`, use a manual rebase todo with the target commit marked `reword`, and set `GIT_EDITOR` to a non-interactive script or amend directly at the stopped commit.

5. If conflicts occur:

   - Resolve only the conflict caused by the requested rewrite.
   - Run the smallest relevant check for the changed files.
   - Continue with `git rebase --continue`.
   - Abort with `git rebase --abort` if the conflict is outside the requested scope or would risk unrelated work.

6. Verify the result:

   ```bash
   git log --oneline --decorate -n 20
   git status --short
   ```

7. If the branch was already pushed and the user asked to update the remote:

   ```bash
   git push --force-with-lease
   ```

## Output Contract

Report the target commit, rewritten commit range, final HEAD, whether conflicts occurred, and whether the branch was pushed. Mention any remaining uncommitted files.
