---
name: testing-instructions
description: Use when writing or updating WRAP pull request testing instructions from the repo workflow.
---

# Testing Instructions

Use this skill when a task asks you to write, repair, or update WRAP pull request testing instructions.

## Required workflow

1. Read `agents/workflows/testing-instructions-workflow.md` in the target repository.
2. Follow that workflow as the source of truth for structure, UI-name verification, sequential numbering, and formatting.
3. Verify UI element names from Vue source or browser state before writing them. Do not guess labels.
4. If the task is PR-related, update the PR body or comment only after the instructions match the workflow.

This skill is only an alias. The repository workflow controls the detailed behavior.
