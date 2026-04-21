import process from "node:process";

import { AcpClient, buildAcpCliArgs, ACP_MODE_AUTOPILOT } from "./acp.mjs";
import { binaryAvailable } from "./process.mjs";

async function runCopilotAcp(cwd, options = {}) {
  const cliArgs = buildAcpCliArgs({
    model: options.model,
    effort: options.effort,
    allowAll: options.allowAll,
    allowAllTools: options.allowAllTools,
    allowAllPaths: options.allowAllPaths,
    allowTools: options.allowTools,
  });

  const client = new AcpClient(cliArgs, { cwd, env: options.env ?? process.env });

  try {
    await client.initialize();

    let sessionId;
    if (options.resumeSessionId) {
      await client.loadSession(options.resumeSessionId, { cwd });
      sessionId = options.resumeSessionId;
    } else if (options.continueSession) {
      const sessions = await client.listSessions();
      const recent = sessions.find((s) => s.cwd === cwd);
      if (recent) {
        await client.loadSession(recent.sessionId, { cwd });
        sessionId = recent.sessionId;
      } else {
        const session = await client.newSession({ cwd });
        sessionId = session.sessionId;
      }
    } else {
      const session = await client.newSession({ cwd });
      sessionId = session.sessionId;
    }

    if (options.autopilot) {
      await client.setMode(sessionId, ACP_MODE_AUTOPILOT);
    }

    const result = await client.prompt(sessionId, options.prompt, {
      onUpdate: (update) => {
        if (!options.onProgress) return;
        const type = update?.sessionUpdate;
        if (type === "agent_message_chunk") {
          options.onProgress({ message: update.content?.text ?? "", phase: "running" });
        } else if (type === "tool_call") {
          options.onProgress({ message: update.title ?? "Tool call", phase: "tool-call" });
        } else if (type === "tool_call_update") {
          options.onProgress({ message: `Tool ${update.status}`, phase: "running" });
        } else if (type === "agent_thought_chunk") {
          options.onProgress({ message: update.content?.text ?? "", phase: "thinking" });
        }
      },
    });

    return {
      status: 0,
      stdout: result.message,
      stderr: "",
      finalMessage: result.message,
      sessionId,
      error: null,
      pid: client.pid,
    };
  } catch (err) {
    return {
      status: 1,
      stdout: "",
      stderr: err.message,
      finalMessage: "",
      sessionId: null,
      error: err,
      pid: client.pid,
    };
  } finally {
    await client.close();
  }
}

export function getCopilotAvailability(cwd) {
  return binaryAvailable("copilot", ["--version"], { cwd });
}

export function getCopilotAuthStatus(cwd) {
  const availability = getCopilotAvailability(cwd);
  if (!availability.available) {
    return {
      available: false,
      loggedIn: false,
      detail: availability.detail,
      source: "availability"
    };
  }

  return {
    available: true,
    loggedIn: null,
    detail: "Copilot CLI is installed. Auth status is verified on first use.",
    source: "binary-check"
  };
}

export async function runCopilotReview(cwd, options = {}) {
  const availability = getCopilotAvailability(cwd);
  if (!availability.available) {
    throw new Error("Copilot CLI is not installed. Install it from https://github.com/features/copilot/cli, then rerun `/copilot:setup`.");
  }

  return runCopilotAcp(cwd, {
    prompt: options.prompt,
    model: options.model ?? "gpt-5.4",
    effort: options.effort ?? "xhigh",
    allowTools: ["shell(git:*)"],
    allowAllPaths: true,
    onProgress: options.onProgress,
  });
}

export async function runCopilotTask(cwd, options = {}) {
  const availability = getCopilotAvailability(cwd);
  if (!availability.available) {
    throw new Error("Copilot CLI is not installed. Install it from https://github.com/features/copilot/cli, then rerun `/copilot:setup`.");
  }

  const copilotOptions = {
    prompt: options.prompt,
    model: options.model,
    effort: options.effort,
    onProgress: options.onProgress,
  };

  if (options.resumeSessionId) {
    copilotOptions.resumeSessionId = options.resumeSessionId;
  } else if (options.continueSession) {
    copilotOptions.continueSession = true;
  }

  if (options.write) {
    copilotOptions.allowAll = true;
    copilotOptions.autopilot = true;
  } else {
    copilotOptions.allowTools = ["shell(git:*)", "read"];
    copilotOptions.allowAllPaths = true;
  }

  return runCopilotAcp(cwd, copilotOptions);
}

export function parseStructuredOutput(rawOutput, fallback = {}) {
  if (!rawOutput) {
    return {
      parsed: null,
      parseError: fallback.failureMessage ?? "Copilot did not return a final structured message.",
      rawOutput: rawOutput ?? "",
      ...fallback
    };
  }

  try {
    return {
      parsed: JSON.parse(rawOutput),
      parseError: null,
      rawOutput,
      ...fallback
    };
  } catch (error) {
    const jsonMatch = rawOutput.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return {
          parsed: JSON.parse(jsonMatch[0]),
          parseError: null,
          rawOutput,
          ...fallback
        };
      } catch {
        // fall through to original error
      }
    }
    return {
      parsed: null,
      parseError: error.message,
      rawOutput,
      ...fallback
    };
  }
}
