import { spawn as spawnProcess } from "node:child_process";
import process from "node:process";

const PROTOCOL_VERSION = 1;

export class AcpClient {
  #child = null;
  #nextId = 0;
  #pending = new Map();
  #buffer = "";
  #onNotification = null;
  #exitPromise = null;

  constructor(cliArgs = [], options = {}) {
    this.#onNotification = options.onNotification ?? null;

    this.#child = spawnProcess("copilot", ["--acp", "--stdio", ...cliArgs], {
      cwd: options.cwd ?? process.cwd(),
      env: options.env ?? process.env,
      stdio: ["pipe", "pipe", "pipe"],
      windowsHide: true,
    });

    this.#exitPromise = new Promise((resolve) => {
      this.#child.on("exit", (code, signal) => {
        if (this.#pending.size > 0) {
          const err = new Error(`ACP process exited unexpectedly (code=${code}, signal=${signal})`);
          for (const { reject } of this.#pending.values()) reject(err);
          this.#pending.clear();
        }
        resolve({ code, signal });
      });
    });

    this.#child.stdout.on("data", (chunk) => this.#onData(chunk));
    this.#child.stderr.resume();
    this.#child.stdin.on("error", () => {});

    this.#child.on("error", (err) => {
      for (const { reject } of this.#pending.values()) reject(err);
      this.#pending.clear();
    });
  }

  get pid() {
    return this.#child?.pid ?? null;
  }

  async initialize() {
    return this.#request("initialize", {
      protocolVersion: PROTOCOL_VERSION,
      capabilities: {},
      clientInfo: { name: "copilot-companion", version: "2.0.0" },
    });
  }

  async newSession({ cwd } = {}) {
    return this.#request("session/new", {
      cwd: cwd ?? process.cwd(),
      mcpServers: [],
    });
  }

  async prompt(sessionId, text, options = {}) {
    const chunks = [];
    const prevHandler = this.#onNotification;

    this.#onNotification = (notification) => {
      const update = notification.params?.update;
      if (notification.params?.sessionId !== sessionId) {
        prevHandler?.(notification);
        return;
      }
      if (update?.sessionUpdate === "agent_message_chunk") {
        chunks.push(update.content?.text ?? "");
      }
      options.onUpdate?.(update);
      prevHandler?.(notification);
    };

    try {
      const result = await this.#request("session/prompt", {
        sessionId,
        prompt: [{ type: "text", text }],
      });
      return {
        stopReason: result.stopReason ?? "end_turn",
        message: chunks.join(""),
      };
    } finally {
      this.#onNotification = prevHandler;
    }
  }

  async loadSession(sessionId, { cwd } = {}) {
    return this.#request("session/load", {
      sessionId,
      cwd: cwd ?? process.cwd(),
      mcpServers: [],
    });
  }

  async listSessions() {
    const result = await this.#request("session/list", {});
    return result.sessions ?? [];
  }

  async setMode(sessionId, modeId) {
    return this.#request("session/set_mode", { sessionId, modeId });
  }

  close() {
    if (!this.#child) return Promise.resolve();
    for (const { reject } of this.#pending.values()) {
      reject(new Error("ACP client closed"));
    }
    this.#pending.clear();
    this.#child.kill("SIGTERM");
    this.#child = null;
    return this.#exitPromise;
  }

  #request(method, params) {
    if (!this.#child) return Promise.reject(new Error("ACP client is closed"));
    return new Promise((resolve, reject) => {
      const id = ++this.#nextId;
      this.#pending.set(id, { resolve, reject });
      const msg = JSON.stringify({ jsonrpc: "2.0", id, method, params });
      this.#child.stdin.write(msg + "\n");
    });
  }

  #onData(chunk) {
    this.#buffer += chunk.toString();
    const lines = this.#buffer.split("\n");
    this.#buffer = lines.pop();

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      let obj;
      try {
        obj = JSON.parse(trimmed);
      } catch {
        continue;
      }

      if (obj.id != null && this.#pending.has(obj.id)) {
        const { resolve, reject } = this.#pending.get(obj.id);
        this.#pending.delete(obj.id);
        if (obj.error) {
          const err = new Error(obj.error.message ?? "ACP error");
          err.code = obj.error.code;
          err.data = obj.error.data;
          reject(err);
        } else {
          resolve(obj.result ?? {});
        }
      } else if (obj.method) {
        this.#onNotification?.(obj);
      }
    }
  }
}

export function buildAcpCliArgs(options = {}) {
  const args = [];
  if (options.model) args.push("--model", options.model);
  if (options.effort) args.push("--effort", options.effort);
  if (options.allowAll) args.push("--allow-all");
  if (options.allowAllTools) args.push("--allow-all-tools");
  if (options.allowAllPaths) args.push("--allow-all-paths");
  if (Array.isArray(options.allowTools)) {
    for (const tool of options.allowTools) args.push(`--allow-tool=${tool}`);
  }
  if (options.autopilot) args.push("--autopilot");
  return args;
}

export const ACP_MODE_AGENT = "https://agentclientprotocol.com/protocol/session-modes#agent";
export const ACP_MODE_PLAN = "https://agentclientprotocol.com/protocol/session-modes#plan";
export const ACP_MODE_AUTOPILOT = "https://agentclientprotocol.com/protocol/session-modes#autopilot";
