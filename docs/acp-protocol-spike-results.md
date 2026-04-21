# ACP Protocol Spike Results (Copilot CLI 1.0.34)

**Date:** 2026-04-21
**Copilot CLI:** 1.0.34
**Platform:** darwin arm64

## Wire Format

NDJSON (newline-delimited JSON) over stdio. No Content-Length / LSP-style framing. Protocol version: 1 (JSON-RPC 2.0).

## Confirmed Working

| Method | Required Params | Returns |
|---|---|---|
| `initialize` | `protocolVersion: 1`, `capabilities: {}`, `clientInfo: { name, version }` | `protocolVersion`, `agentCapabilities`, `agentInfo`, `authMethods` |
| `session/new` | `cwd: string`, `mcpServers: []` | `sessionId` (UUID), `models`, `modes`, `configOptions` |
| `session/prompt` | `sessionId: string`, `prompt: [{ type: "text", text: string }]` | `{ stopReason: "end_turn" }` (streams `session/update` notifications during execution) |
| `session/load` | `sessionId: string`, `cwd: string`, `mcpServers: []` | Session metadata. Replays history via `user_message_chunk` / `agent_message_chunk` notifications. Full conversation continuity confirmed. |
| `session/list` | `{}` | `{ sessions: [{ sessionId, cwd, title, updatedAt }] }` |
| `session/set_mode` | `sessionId: string`, `modeId: string` (full URI) | `{}` + `config_option_update` notification |

## Not Available (Method Not Found)

| Method | Error Code | Notes |
|---|---|---|
| `session/cancel` | -32601 | Cancellation must remain as process-level SIGTERM |
| `session/configure` | -32601 | Model/effort cannot be set per-session via protocol |
| `rpc.discover` | -32601 | No method introspection available |

## Agent Capabilities

```json
{
  "loadSession": true,
  "mcpCapabilities": { "http": true, "sse": true },
  "promptCapabilities": { "image": true, "audio": false, "embeddedContext": true },
  "sessionCapabilities": { "list": {} }
}
```

## Available Models

| Model ID | Name | Copilot Usage |
|---|---|---|
| `auto` | Auto | -- |
| `claude-sonnet-4.6` | Claude Sonnet 4.6 | 1x |
| `claude-haiku-4.5` | Claude Haiku 4.5 | 0.33x |
| `claude-opus-4.7` | Claude Opus 4.7 | 7.5x |
| `claude-opus-4.6` | Claude Opus 4.6 | 3x |
| `gpt-5.4` | GPT-5.4 | 1x |
| `gpt-5.3-codex` | GPT-5.3-Codex | 1x |
| `gpt-5.4-mini` | GPT-5.4 mini | 0.33x |
| `gpt-5-mini` | GPT-5 mini | 0x |
| `gpt-4.1` | GPT-4.1 | 0x |

## Available Modes

| Mode ID | Name |
|---|---|
| `https://agentclientprotocol.com/protocol/session-modes#agent` | Agent (default) |
| `https://agentclientprotocol.com/protocol/session-modes#plan` | Plan |
| `https://agentclientprotocol.com/protocol/session-modes#autopilot` | Autopilot |

## Streaming Notification Types

All notifications use `method: "session/update"` with a `params.update.sessionUpdate` discriminator:

| `sessionUpdate` value | Content Shape | When |
|---|---|---|
| `agent_message_chunk` | `{ type: "text", text: string }` | Streaming assistant response tokens |
| `agent_thought_chunk` | `{ type: "text", text: string }` | Streaming reasoning/thinking tokens |
| `tool_call` | `{ toolCallId, title, kind, status: "pending", rawInput, locations }` | Tool invocation started |
| `tool_call_update` | `{ toolCallId, status: "completed", rawOutput }` | Tool invocation completed |
| `config_option_update` | `{ configOptions: [...] }` | Mode/model/config changed |
| `user_message_chunk` | `{ type: "text", text: string }` | Replayed user message during `session/load` |

## Bidirectional Callbacks

None observed across all spikes (including tool-use scenarios). The agent handles all tool execution internally. `serverRequestMethods: []` in every test. Permissions are controlled exclusively via CLI flags.

## CLI Flags with ACP Mode

CLI flags work alongside `--acp --stdio`. Confirmed:

```bash
copilot --acp --stdio --model gpt-5.4 --effort high
```

Result: `session/new` returns `currentModel: "gpt-5.4"`, `reasoningEffort: "xhigh"`. Model self-confirmed as GPT-5.4.

Other applicable CLI flags (expected to work based on shared flag parser):
- `--allow-tool`, `--allow-all`, `--allow-all-paths`, `--allow-all-tools`
- `--autopilot`
- `--no-custom-instructions`

## Key Findings for Migration

### What ACP Fixes

| Current (fragile) | ACP (reliable) |
|---|---|
| `tryExtractSessionId` -- regex scan of NDJSON for 3 field name variants | `session/new` returns `sessionId` UUID directly |
| `extractAssistantMessage` -- scan for `phase === "final_answer"` with cascading fallbacks | Concatenate `agent_message_chunk` content texts |
| `isEphemeralEvent` -- JSON.parse every line to check `ephemeral === true` | Typed `sessionUpdate` discriminator -- no filtering needed |
| No tool visibility | `tool_call` / `tool_call_update` events give progress insight |
| `--resume=<id>` flag construction + regex session ID extraction | `session/load(sessionId, { cwd })` with typed params |

### What ACP Does Not Fix

- **Cancellation** -- `session/cancel` not implemented. SIGTERM tree kill remains.
- **Permission callbacks** -- not bidirectional. Agent handles tools internally. CLI flags only.
- **Per-session model/effort** -- must be CLI flags on the process. One process per model/effort combo.
- **Structured output** -- no special mode. `parseStructuredOutput` fallback still needed for adversarial review JSON extraction.

### Simplified Client Architecture

No bidirectional callback handling needed. The JSON-RPC client is purely unidirectional: send requests, receive responses + notifications. Estimated ~80-120 lines of zero-dependency Node.js ESM.
