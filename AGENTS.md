# Global Agent Rules

## Git Safety

- Do not stage or commit without explicit user request.
- If the user says "commit staged fix", commit staged files only; if none are staged, ask the user to stage them first.
- Only stage files when the user explicitly says to stage files.
- **Pre-commit gate:** Before running `git commit`, pause and check whether the user's last message contained the word "commit" or "stage". If not, do not commit — stage the changes and ask for confirmation. Do not infer intent from context ("continue", "go ahead", "fix it").
- If uncertain, ask before any git operation.
- Assume multiple agents or the user may be working in the same repo; never overwrite or revert unrelated changes.
- Do not add Co-Authored-By trailers to commits.

## Edits

- Make multi-location edits from local usage outward; update imports, exports, and shared declarations last.
- Find all affected references before deleting or renaming repeated code.
- For line-based patch/delete ranges, work from the bottom of the file upward so pending locations stay stable.
- Prefer sed or regex for bulk replacements, then verify by reading affected code and running relevant checks.
- Prefer self-documenting code; add comments only for non-obvious rationale.

## Style Defaults

- Use descriptive names and avoid abbreviations unless the project already uses them.
- Prefer expanded, readable control flow: guard clauses, blank lines after guards, and named constants for magic values.
- Keep project-specific architecture, schema, auth, and formatting rules in the project's local docs.

## Agent Architecture

- Skills are not used directly. The equivalent is **workflows** (process guidance) + **templates** (code examples/end state).
- Per-agent skills may serve as thin shortcuts to existing workflows, but never as substitutes.
- **Plans** are a separate category for exploratory, multi-phase work — not a skill or workflow.

## Shell

- Use `rtk` as a CLI proxy for supported Bash commands when compact, token-optimized output is useful. It filters command output before it reaches the LLM; do not use it when raw output or normal command behavior is needed.

## Browser Automation

- Do not use Playwright unless the user explicitly asks for Playwright, browser automation, or UI interaction.
