# Agent Global Rules

Generic agent rules plus a thin OMP plugin adapter.

## Generic use

Link each tool's global rules file, plus the home-level fallback, to the generic root files:

```bash
ln -sf /home/marlen/code/klondikemarlen/agent-global-rules/AGENTS.md /home/marlen/.codex/AGENTS.md
ln -sf /home/marlen/code/klondikemarlen/agent-global-rules/AGENTS.md /home/marlen/.config/opencode/AGENTS.md
ln -sf /home/marlen/code/klondikemarlen/agent-global-rules/AGENTS.md /home/marlen/.omp/agent/AGENTS.md
ln -sf /home/marlen/code/klondikemarlen/agent-global-rules/AGENTS.md /home/marlen/AGENTS.md
```

Restart the agent after changing this file. Global instructions load at startup.

## OMP plugin use

This repo also ships an OMP package adapter:

- `package.json` declares `omp.extensions`.
- `omp-plugin/index.ts` is the tiny runtime adapter.
- `.omp-plugin/marketplace.json` exposes the package to the OMP marketplace.
- `/agent-global-rules` is a prompting shortcut that asks the agent to use the installed rules/workflows.

Install from the marketplace after this repo is pushed:

```bash
omp plugin marketplace add klondikemarlen/agent-global-rules
omp plugin install agent-global-rules@agent-global-rules
```

For local development, load the package root so OMP also discovers sibling `skills/`:

```bash
omp --extension /home/marlen/code/klondikemarlen/agent-global-rules
```

## Files

- `AGENTS.md` - global agent instructions loaded by OMP, Codex, and OpenCode
- `AGENT_RULES.md` - agent-agnostic shared decision rules
- `COMMITTING.md` - reusable commit-message guidance
- `agents/` - generic workflow, template, reference, and plan discovery docs
- `skills/` - thin skill aliases that point to authoritative workflows/templates
- `package.json` - OMP package manifest that loads the adapter and exposes sibling skills
- `omp-plugin/` - OMP-specific runtime adapter; no shared workflow content lives here
- `.omp-plugin/` - OMP marketplace catalog
