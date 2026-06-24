# Workflows

Reusable AI-agent procedures live here.

## Intent

Workflows should define a repeatable task with clear inputs, steps, decision rules, and outputs. They are stronger than advice: agents should follow the workflow literally unless the user overrides it.

## Naming

Use `verb-noun-workflow.md` or `task-domain-workflow.md`.

Examples:

- `pull-request-management-workflow.md`
- `testing-instructions-workflow.md`
- `release-notes-workflow.md`

## Authoring Rules

- Start with a short purpose statement.
- State when to use the workflow.
- List required source material to inspect before acting.
- Include decision rules for common forks.
- Include an output contract.
- Keep project-specific details out of generic workflows. If a workflow is project-specific, put it under a project-named subtree or name that scope explicitly.
