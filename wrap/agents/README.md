# AI Agents & Workflows

This directory contains AI workflows, templates, references, and plans for the WRAP system.

## Important

Directory READMEs under `agents/` are primarily discovery documents.

Agents should use these READMEs to find relevant workflows, templates, or plans, then read the
underlying files directly. The individual workflow/template/plan files are the source of truth
for task-specific instructions.

## Directory Structure

```
agents/
├── README.md              (this file)
├── templates/             (reusable code templates)
│   ├── README.md
│   └── *-template.md
├── references/            (durable cross-workflow guidance)
│   ├── README.md
│   └── *-reference.md
├── workflows/             (reusable workflow documents)
│   └── *-workflow.md
└── plans/                 (implementation plans)
    └── *.md
```

## Templates

Templates provide copy-paste-ready code patterns that streamline development tasks. See [templates/README.md](templates/README.md) for available templates and usage guidelines.

## Workflows

Workflows are AI-readable documents that guide coding assistants through complex, multi-step tasks. They include step-by-step instructions, code templates, implementation checklists, common pitfalls to avoid, and testing strategies.

Use [workflows/README.md](workflows/README.md) to discover the right workflow, then read the
actual workflow file before acting.

When a task spans multiple concerns, agents should combine the relevant workflows rather than
treating the first matching workflow as the only source of guidance. For example, pull request work
often needs one workflow for PR structure, another for testing instructions, and sometimes another
for issue or ticket framing.

**Using a workflow:**

```
Hey Claude, follow the workflow in agents/workflows/example-workflow.md
to accomplish the task.
```

**Creating a workflow:**

1. Create in `agents/workflows/` with frontmatter:

   ```yaml
   ---
   description: Brief description of workflow purpose and scope
   auto_execution_mode: 1
   ---
   # Workflow Title

   [Content here...]
   ```

2. Update `agents/workflows/README.md`

## References

References capture durable project techniques and conventions that multiple workflows can point to.
They are background guidance, not step-by-step task procedures. See
[references/README.md](references/README.md) for available reference material.

## Plans

Plans are implementation documents that outline the steps to implement a feature or fix. They include problem statements, implementation steps, database schema changes, testing plans, and changelog entries.

## Best Practices

1. **Single Source of Truth** - Always edit workflows in `agents/workflows/`
2. **Descriptive Names** - Use `verb-noun-workflow.md` for workflows and `noun-pattern-template.md` for templates
3. **Include Frontmatter** - Add `description` and `auto_execution_mode: 1`
4. **Reference Implementations** - Include commit hashes where helpful
5. **Keep Workflows Focused** - One workflow = one major task
6. **Update READMEs** - Document new workflows and templates
7. **Prefer discovery over inventories** - In README files, point agents toward searching the
   relevant directory instead of maintaining long hardcoded workflow or template lists

---

## Agent-Specific Workflow Directories

Some AI tools automatically discover workflows placed in specific directories. However, this approach is **not recommended** because:

- It's not cross-agent compatible
- Requires duplicating or hardlinking files
- Each developer needs to set up hardlinks locally

The preferred approach is to reference workflows directly from `agents/workflows/` as shown above.

If you still want to use agent-specific directories, here are the locations each tool looks for workflows:

| Agent       | Directory              |
| ----------- | ---------------------- |
| Claude Code | `.claude/workflows/`   |
| Windsurf    | `.windsurf/workflows/` |
| Cursor      | `.cursor/workflows/`   |

You can hardlink workflows to these directories to maintain a single source of truth:

```bash
mkdir -p .claude/workflows
ln agents/workflows/example-workflow.md .claude/workflows/example-workflow.md
```

If using hardlinks, add these to `.gitignore`:

```gitignore
.claude/workflows/
.windsurf/workflows/
.cursor/workflows/
```

This tracks the source in `agents/workflows/` while ignoring the duplicates, and each developer runs the hardlink commands locally.

---

**Last Updated:** 2026-02-1709
