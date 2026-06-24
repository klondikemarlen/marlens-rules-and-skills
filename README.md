# Agent Global Rules

Version-controlled global agent instructions for local agent config files.

## Use

Link each tool's global rules file to this repo:

```bash
ln -sf /home/marlen/code/klondikemarlen/agent-global-rules/AGENTS.md /home/marlen/.codex/AGENTS.md
ln -sf /home/marlen/code/klondikemarlen/agent-global-rules/AGENTS.md /home/marlen/.config/opencode/AGENTS.md
ln -sf /home/marlen/code/klondikemarlen/agent-global-rules/AGENTS.md /home/marlen/.omp/agent/AGENTS.md
```

Restart the agent after changing this file. Global instructions load at startup.

## Files

- `AGENTS.md` - global agent instructions loaded by OMP, Codex, and OpenCode
- `skills/` - global skill aliases copied from the local OMP managed-skills directory
- `wrap/agents/` - reusable WRAP agent workflows, references, and templates
- `wrap/COMMITTING.md` - WRAP commit-message guidance
