import type { SessionEvent } from '@github/copilot-sdk';
import { appendFileSync } from 'fs';

/**
 * Environment variable that enables event tracing. Set it to a file path and
 * every Copilot SDK session event is appended there as one JSON line.
 */
export const COPILOT_EVENT_TRACE_ENV = 'IDL_COPILOT_EVENT_TRACE';

/**
 * Longest string value kept in a trace entry before it is truncated
 */
const MAX_TRACE_STRING = 200;

/**
 * Recursively truncates long strings so traces stay readable
 */
function TruncateTraceValue(value: unknown, depth = 0): unknown {
  if (typeof value === 'string') {
    return value.length > MAX_TRACE_STRING
      ? `${value.slice(0, MAX_TRACE_STRING)}...[${value.length} chars]`
      : value;
  }
  if (depth > 6 || value === null || typeof value !== 'object') {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map((item) => TruncateTraceValue(item, depth + 1));
  }
  const result: Record<string, unknown> = {};
  for (const [key, item] of Object.entries(value)) {
    result[key] = TruncateTraceValue(item, depth + 1);
  }
  return result;
}

/**
 * Appends a session event to the trace file when tracing is enabled.
 *
 * Keeps the envelope (id, parentId, agentId, timestamp, type) intact and
 * truncates the payload, which is what we need to understand how events
 * correlate. Never throws.
 *
 * @param event - Event received from the Copilot SDK
 */
export function TraceCopilotEvent(event: SessionEvent): void {
  const file = process.env[COPILOT_EVENT_TRACE_ENV];
  if (!file) {
    return;
  }
  try {
    appendFileSync(
      file,
      JSON.stringify({
        agentId: event.agentId,
        data: TruncateTraceValue(event.data),
        ephemeral: event.ephemeral,
        id: event.id,
        parentId: event.parentId,
        timestamp: event.timestamp,
        type: event.type,
      }) + '\n',
    );
  } catch {
    // tracing must never affect chat behavior
  }
}
