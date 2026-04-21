import { spawn as spawnProcess } from "node:child_process";
import process from "node:process";

import { binaryAvailable, runCommand } from "./process.mjs";

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

function buildCopilotArgs(options = {}) {
  const args = ["-s"];

  if (options.model) {
    args.push("--model", options.model);
  }
  if (options.effort) {
    args.push("--effort", options.effort);
  }
  if (options.outputFormat) {
    args.push("--output-format", options.outputFormat);
  }
  if (options.resumeSessionId) {
    args.push(`--resume=${options.resumeSessionId}`);
  }
  if (options.continueSession) {
    args.push("--continue");
  }
  if (options.autopilot) {
    args.push("--autopilot");
  }
  if (options.allowAllTools) {
    args.push("--allow-all-tools");
  }
  if (options.allowAllPaths) {
    args.push("--allow-all-paths");
  }
  if (options.allowAll) {
    args.push("--allow-all");
  }
  if (Array.isArray(options.allowTools)) {
    for (const tool of options.allowTools) {
      args.push(`--allow-tool=${tool}`);
    }
  }

  if (options.prompt) {
    args.push("-p", options.prompt);
  }

  return args;
}

function tryExtractSessionId(jsonlOutput) {
  if (!jsonlOutput) {
    return null;
  }
  const lines = jsonlOutput.split(/\r?\n/).filter(Boolean);
  for (let i = lines.length - 1; i >= 0; i--) {
    try {
      const obj = JSON.parse(lines[i]);
      if (obj.session_id) {
        return obj.session_id;
      }
      if (obj.sessionId) {
        return obj.sessionId;
      }
      if (obj.id && obj.type === "session") {
        return obj.id;
      }
    } catch {
      continue;
    }
  }
  return null;
}

function extractAssistantMessage(jsonlOutput) {
  if (!jsonlOutput) {
    return "";
  }
  const lines = jsonlOutput.split(/\r?\n/).filter(Boolean);
  const messages = [];
  for (const line of lines) {
    try {
      const obj = JSON.parse(line);
      if (obj.type === "assistant" || obj.role === "assistant") {
        const text = obj.content ?? obj.text ?? obj.message ?? "";
        if (text) {
          messages.push(text);
        }
      }
    } catch {
      continue;
    }
  }
  return messages.length > 0 ? messages[messages.length - 1] : jsonlOutput;
}

export function runCopilotSync(cwd, options = {}) {
  const args = buildCopilotArgs(options);
  const result = runCommand("copilot", args, {
    cwd,
    maxBuffer: options.maxBuffer ?? 10 * 1024 * 1024
  });

  const stdout = result.stdout ?? "";
  const stderr = result.stderr ?? "";
  const sessionId = options.outputFormat === "json" ? tryExtractSessionId(stdout) : null;
  const finalMessage = options.outputFormat === "json" ? extractAssistantMessage(stdout) : stdout;

  return {
    status: result.status ?? 0,
    stdout,
    stderr,
    finalMessage,
    sessionId,
    error: result.error
  };
}

export async function runCopilotAsync(cwd, options = {}) {
  const args = buildCopilotArgs(options);

  return new Promise((resolve, reject) => {
    let stdout = "";
    let stderr = "";

    const child = spawnProcess("copilot", args, {
      cwd,
      env: options.env ?? process.env,
      stdio: ["ignore", "pipe", "pipe"],
      windowsHide: true
    });

    child.stdout.on("data", (chunk) => {
      stdout += chunk;
      if (options.onProgress) {
        const lines = chunk.toString().split(/\r?\n/).filter(Boolean);
        for (const line of lines) {
          options.onProgress({ message: line, phase: "running" });
        }
      }
    });

    child.stderr.on("data", (chunk) => {
      stderr += chunk;
    });

    child.on("error", reject);
    child.on("close", (code) => {
      const sessionId = options.outputFormat === "json" ? tryExtractSessionId(stdout) : null;
      const finalMessage = options.outputFormat === "json" ? extractAssistantMessage(stdout) : stdout;
      resolve({
        status: code ?? 0,
        stdout,
        stderr,
        finalMessage,
        sessionId,
        error: null,
        pid: child.pid
      });
    });
  });
}

export async function runCopilotReview(cwd, options = {}) {
  const availability = getCopilotAvailability(cwd);
  if (!availability.available) {
    throw new Error("Copilot CLI is not installed. Install it from https://github.com/features/copilot/cli, then rerun `/copilot:setup`.");
  }

  return runCopilotAsync(cwd, {
    prompt: options.prompt,
    model: "gpt-5.4",
    effort: "xhigh",
    allowTools: ["shell(git:*)"],
    allowAllPaths: true,
    outputFormat: options.structured ? "json" : undefined,
    onProgress: options.onProgress
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
    outputFormat: options.outputFormat,
    onProgress: options.onProgress
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

  return runCopilotAsync(cwd, copilotOptions);
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
    return {
      parsed: null,
      parseError: error.message,
      rawOutput,
      ...fallback
    };
  }
}
