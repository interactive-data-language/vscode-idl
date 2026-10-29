# Copilot Chat Events

How the GitHub Copilot SDK session events that drive our chat fit together, and how they map to what we send to the chat UI. Read this before changing how events become `ChatStreamChunk`s.

- Handler: `libs/mcp/standalone-server/src/lib/chat/copilot/copilot-chat-framework.class.ts` (`streamChatCompletion`, the `session.on` callback)
- Chunk types: `libs/types/chat/src/lib/chat-types.interface.ts`
- Client reducer: `libs/ngx/chat/src/lib/state/chat.state.ts`
- SDK event typings: `node_modules/@github/copilot-sdk/dist/generated/session-events.d.ts`

The timeline below was captured from a real run (BYOK `gpt-5.4`, three assistant turns, five tool calls). Behavior may differ slightly by model or provider; see [Model differences](#model-differences).

## Two levels: request and assistant turn

| Level                                                           | Starts                                  | Ends                 | Id                                                                                           |
| --------------------------------------------------------------- | --------------------------------------- | -------------------- | -------------------------------------------------------------------------------------------- |
| **Request** (one user message)                                  | `user.message` (after `session.send()`) | `session.idle`       | `user.message.data.messageId`, echoed as `originatingMessageId` on every `assistant.message` |
| **Assistant turn** (one model call plus the tools it requested) | `assistant.turn_start`                  | `assistant.turn_end` | `data.turnId` (`"0"`, `"1"`, ...)                                                            |

A request contains one or more assistant turns. While the model keeps requesting tools, another turn follows. **The last turn is the one whose `assistant.message` has no `toolRequests`; that message is the final answer.**

## Timeline of a request

Abbreviated from a real trace. `*` means many events. Times are relative to `user.message`.

```
user.message                               +0.0s   messageId = request id
assistant.turn_start            turnId=0           (model call 1: no thinking, 3 tools)
  assistant.tool_call_delta     x3                 one per tool, tool name + partial args
  assistant.usage                                  tokens, duration, time to first token
  assistant.message             toolRequests=3     content "" ; toolRequests[] has toolCallId, name, arguments, toolTitle
  tool.execution_start          x3                 emitted AFTER assistant.message
  tool.execution_complete       x3                 completion order can differ from start order
assistant.turn_end              turnId=0
assistant.turn_start            turnId=1           (model call 2: thinking, 2 tools)
  assistant.reasoning_delta *                      thinking, streamed
  assistant.tool_call_delta     x2
  assistant.usage
  assistant.message             toolRequests=2
  assistant.reasoning                              reasoning "done" event (see timing caveat)
  tool.execution_start/complete x2
assistant.turn_end              turnId=1
assistant.turn_start            turnId=2           (model call 3: final answer)
  assistant.reasoning_delta *                      +13.2s .. +14.3s
  assistant.message_start       phase=final_answer +14.3s  (ephemeral, announces the final text)
  assistant.message_delta *                        +14.3s .. +25.0s, carries messageId
  assistant.usage
  assistant.message             toolRequests=[]    full text; also carries reasoningText
  assistant.reasoning                              arrives AFTER the message, ~11s after the last reasoning_delta
assistant.turn_end              turnId=2
assistant.idle / session.idle                      request finished
```

## Event reference

"Eph." means ephemeral: not persisted to the session log, only seen live.

### Events we use (or should)

| Event                       | Eph. | Key `data` fields                                                                                                                             | Notes                                                                                    |
| --------------------------- | ---- | --------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `assistant.turn_start`      | no   | `turnId`, `interactionId`, `model?`, `parentToolCallId?`                                                                                      | Opens a step.                                                                            |
| `assistant.turn_end`        | no   | `turnId`                                                                                                                                      | Closes a step.                                                                           |
| `assistant.reasoning_delta` | yes  | `reasoningId`, `deltaContent`                                                                                                                 | Streamed thinking.                                                                       |
| `assistant.reasoning`       | no   | `reasoningId`, `content`                                                                                                                      | Completion marker. **Arrives late**, see timing.                                         |
| `assistant.message_start`   | yes  | `messageId`, `phase` (`final_answer` seen)                                                                                                    | Emitted before the first `message_delta`. Earliest signal that text is the final answer. |
| `assistant.message_delta`   | yes  | `messageId`, `deltaContent`                                                                                                                   | Streamed text.                                                                           |
| `assistant.message`         | no   | `messageId`, `content`, `toolRequests[]`, `originatingMessageId`, `turnId`, `model`, `reasoningText?`, `phase?`, `chunkIndex?`, `chunkCount?` | End of a model call's output. `toolRequests` empty means final answer.                   |
| `assistant.tool_call_delta` | yes  | `toolCallId`, `toolName`, `inputDelta`                                                                                                        | One per tool in this trace, arguments are partial. Early signal that a tool is coming.   |
| `tool.execution_start`      | no   | `toolCallId`, `toolName`, `arguments`, `turnId`, `toolTitle?`, `mcpServerName?`, `mcpToolName?`                                               | Emitted after the `assistant.message` that requested it.                                 |
| `tool.execution_complete`   | no   | `toolCallId`, `turnId`, `success`, `result.content`, `error?`                                                                                 | Pair with start by `toolCallId`.                                                         |
| `assistant.intent`          | yes  | `intent`                                                                                                                                      | Short description of current activity. Not emitted by every model, see below.            |
| `assistant.usage`           | no   | `model`, token counts, `duration`, `timeToFirstTokenMs`                                                                                       | Per model call.                                                                          |
| `session.usage_info`        | yes  | `tokenLimit`, `currentTokens`, `systemTokens`, `conversationTokens`, `toolDefinitionsTokens`                                                  | Emitted at the start of each turn. We forward as `token_usage`.                          |
| `session.idle`              | yes  | `mode`                                                                                                                                        | End of the request. Ends our stream.                                                     |
| `session.error` / `abort`   |      | `message`                                                                                                                                     | Error / user interrupt.                                                                  |
| `session.title_changed`     | yes  |                                                                                                                                               | We generate titles ourselves.                                                            |

### Events we ignore

`assistant.streaming_delta` (byte counters, roughly half of all events), `assistant.idle`, `permission.requested` / `permission.completed`, `pending_messages.modified`, `session.mcp_servers_loaded`, `session.tools_updated`, `system.message`, and every `model.*` event (`model.turn_started`, `model.call_start`, `model.message`, `model.tool_execution`, ...). The `model.*` events are internal runtime telemetry.

## Correlation

| To group...                     | Use                                                                                                                                                     |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Everything for one user message | `originatingMessageId` on `assistant.message` equals `user.message.data.messageId`                                                                      |
| Everything in a step            | between `assistant.turn_start` and `assistant.turn_end` with the same `turnId`. `tool.execution_*` and `assistant.message` also carry `turnId`          |
| A tool call                     | `toolCallId`: `assistant.tool_call_delta`, entry in `assistant.message.toolRequests`, `tool.execution_start`, `tool.execution_complete`, `permission.*` |
| A thinking block                | `reasoningId`                                                                                                                                           |
| Streamed text with its message  | `messageId`: `assistant.message_start`, `assistant.message_delta`, `assistant.message`                                                                  |
| Sub-agent activity              | `agentId` on the event (absent for the main agent) and `parentToolCallId` on `turn_start`                                                               |

Observations about `parentId`:

- It is the id of a preceding event, **not** a semantic parent. In the trace, ephemeral events (deltas, `usage_info`) point at their `assistant.turn_start`, and persisted events chain to the previous persisted event.
- `assistant.usage` and `assistant.message` carry no resolvable `parentId` in the trace, so do not depend on it to find a turn. Track the current `turnId` in the handler instead.
- It can be used to attach an `assistant.intent` to something, but only by resolving it through a map of `eventId -> owner` that the handler builds. When it does not resolve, fall back to the current step.

## Timing

Every event has an ISO `timestamp`. Durations should come from the event timestamps, not from when we received the chunk, so SSE buffering does not skew them.

| Duration       | From                                                               | To                                                                                                                                          |
| -------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Thinking block | first `assistant.reasoning_delta` for the `reasoningId`            | **last** `assistant.reasoning_delta`, or the first non-reasoning event of the turn (`assistant.message_start`, `assistant.tool_call_delta`) |
| Text message   | `assistant.message_start` (or the first `assistant.message_delta`) | `assistant.message`                                                                                                                         |
| Tool call      | `tool.execution_start`                                             | `tool.execution_complete`                                                                                                                   |
| Step           | `assistant.turn_start`                                             | `assistant.turn_end`                                                                                                                        |
| Request        | `user.message`                                                     | `session.idle`                                                                                                                              |

Caveat: **do not use `assistant.reasoning` as the end of thinking.** It is emitted after the `assistant.message` for the same call. In the final turn it arrived about 11 seconds after the last `assistant.reasoning_delta`, which would overstate the thinking time. Within a turn, thinking is over as soon as text or a tool call starts.

`assistant.usage` also reports `duration` and `timeToFirstTokenMs` for the model call, which is useful as a cross-check.

## Model differences

- `assistant.intent` was **not** emitted in the captured trace (a BYOK OpenAI model). Treat it as optional and always have a fallback title.
- For tool titles, use `GetToolDisplayName` (`libs/mcp/standalone-server/src/lib/helpers/get-tool-display-name.ts`). It looks up a human-readable name from our translation and an internal lookup, after stripping the `idl-mcp-` prefix from `toolName`. It returns the raw name when there is no entry. The SDK also sends `toolTitle` (for example "Search Resources") and `mcpToolName` on `assistant.message.toolRequests[]` and `tool.execution_start`; treat `toolTitle` only as a fallback when the lookup has no entry.
- `reasoningText` also appears on the final `assistant.message`. The streamed deltas are the primary source; `reasoningText` could backfill if deltas were missed.
- A turn can have no thinking (turn 0) or several text/thinking phases. Do not assume one of each.

## Current mapping to `ChatStreamChunk`

| SDK event                                                                                                        | Chunk                                           |
| ---------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| `assistant.message_delta`                                                                                        | `text_chunk`                                    |
| `assistant.reasoning_delta`                                                                                      | `thinking_chunk` (`done: false`)                |
| `assistant.reasoning`                                                                                            | `thinking_chunk` (`done: true`)                 |
| `tool.execution_start`                                                                                           | `tool_call` (to-do tools are skipped)           |
| `tool.execution_complete`                                                                                        | `tool_result`, or `todo_update` for to-do tools |
| `session.usage_info`                                                                                             | `token_usage`                                   |
| `abort`                                                                                                          | `cancelled`, ends the stream                    |
| `session.error`                                                                                                  | `error`, ends the stream                        |
| `session.idle`                                                                                                   | ends the stream (the route then emits `done`)   |
| `assistant.turn_start`, `assistant.turn_end`, `assistant.message`, `assistant.message_start`, `assistant.intent` | not forwarded yet                               |

Because turn boundaries are not forwarded, the client currently guesses where a new message starts (`needsNewSystemMessage`) and trims an empty trailing message when the last turn ended on a tool call.

## Capturing a trace

Set `IDL_COPILOT_EVENT_TRACE` to a file path before starting the chat server:

```powershell
$env:IDL_COPILOT_EVENT_TRACE = 'C:\tmp\copilot-trace.jsonl'
```

Every SDK event is appended as one JSON line (`type`, `id`, `parentId`, `agentId`, `timestamp`, `ephemeral`, and `data` with strings truncated to 200 characters). The logger is `libs/mcp/standalone-server/src/lib/chat/copilot/trace-copilot-event.ts`. The file gets large quickly, about 2,400 lines for one request, because of the delta events. Count by `type` or collapse the deltas before reading it.
