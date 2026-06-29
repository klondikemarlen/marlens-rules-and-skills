import type { ExtensionAPI } from "@oh-my-pi/pi-coding-agent";

export default function agentGlobalRules(pi: ExtensionAPI) {
  pi.setLabel("Agent Global Rules");

  pi.registerCommand("agent-global-rules", {
    description: "Ask the agent to use the installed global-rules workflows for this task.",
    handler: async (args) => {
      const scope = args.trim();
      const suffix = scope ? ` for: ${scope}` : " for this task";

      pi.sendMessage(
        {
          customType: "agent-global-rules",
          content: `Use the installed agent-global-rules skills and workflows${suffix}. Read only the relevant skill/workflow before acting.`,
          display: true,
          attribution: "user",
        },
        { deliverAs: "followUp", triggerTurn: true },
      );
    },
  });
}
