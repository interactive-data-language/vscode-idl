import { USER_AGENTS_FOLDER } from '@idl/idl/files';
import { appendFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';

/** Append every tool invocation to the host's log, including repeated calls. */
export function LogCopilotToolCall(tool: string): void {
  const file =
    process.env.IDL_AGENT_TOOL_LOG ||
    join(USER_AGENTS_FOLDER, 'tool-calls.jsonl');
  try {
    mkdirSync(dirname(file), { recursive: true });
    appendFileSync(
      file,
      JSON.stringify({ timestamp: new Date().toISOString(), tool }) + '\n',
      'utf8',
    );
  } catch (error) {
    console.error(
      `[CopilotChatService] Could not append tool log "${file}":`,
      error,
    );
  }
}
