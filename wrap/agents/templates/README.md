# Templates

Reusable code templates for the WRAP project.

## Important

This file is an index, not the source of truth for template usage.

Agents should use this README to discover relevant template files, then read the actual
`*-template.md` files directly before generating code. Do not rely on the summaries in this file alone
for code shape, integration steps, or verification requirements.

Template filenames in this directory should end in `-template.md`.

## Intent

Templates provide copy-paste-ready code patterns that multiple workflows can reference. They are not standalone workflows but building blocks.

## Structure

```
agents/templates/
  fishery-bot-factory.md              # Create FisheryBotFactory instances
  filter-searchable-autocomplete.md   # Route-query-synced filter wrapper for autocompletes
```

## Usage

Templates are referenced by workflows. Each template file contains:

1. Location path for the new file
2. Complete, copy-paste-ready code
3. Integration instructions (exports, routes, etc.)
4. Checklist for verification

After identifying a relevant template here, read that template file directly and treat the
template file itself as authoritative.

## Query Builder Note

Templates in this directory are mainly frontend or code-pattern scaffolds. When extracting inline SQL into reusable query builders:

- prefer dedicated query files over generic helper templates
- follow `api/src/queries/README.md`
- mirror each new query file with a direct test under `api/tests/queries/...`
- keep the extraction narrow: query file, nearest barrel export, caller update, and test

## Naming Conventions

Replace these placeholders in templates:

| Placeholder      | Example     | Notes               |
| ---------------- | ----------- | ------------------- |
| `ResourceName`   | `Workflow`  | PascalCase singular |
| `resourceName`   | `workflow`  | camelCase singular  |
| `ResourceNames`  | `Workflows` | PascalCase plural   |
| `resourceNames`  | `workflows` | camelCase plural    |
| `resource-name`  | `workflow`  | kebab-case singular |
| `resource-names` | `workflows` | kebab-case plural   |

---

**Reference Implementation:** FisheryBot Factory

**Last Updated:** 2026-02-17
