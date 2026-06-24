---
name: playwright-qa
description: Use when running WRAP browser QA with Playwright and updating PR testing instructions from observed UI behavior.
---

# Playwright QA

Use this skill when a WRAP task asks for browser QA, Playwright QA, or validation of PR testing instructions against the live UI.

## Required workflow

1. Read `agents/workflows/playwright-qa-workflow.md` in the target repository.
2. Read `agents/workflows/testing-instructions-workflow.md` before writing or changing PR testing instructions.
3. Use Playwright/browser automation for user-visible flows: click, type, navigate, wait, and assert through the UI.
4. Do not use backend shortcuts, direct database writes, logs, or API calls to move UI state unless the user explicitly approves that shortcut.
5. Report exact automated checks, exact Playwright scenarios, visible outcomes, screenshots if any, and concrete blockers.

This skill is an alias to the repo workflow. The repository workflow is authoritative.
