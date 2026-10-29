import type { ChatMessage } from '@idl/types/chat';

/**
 * A message that is shown on its own
 */
export interface IChatDisplayMessage {
  kind: 'message';
  message: ChatMessage;
}

/**
 * Consecutive agent activity (thinking, tools, interim text) shown as one collapsible block
 */
export interface IChatDisplayActivity {
  /** True while the agent is still working and has not started its final answer */
  active: boolean;
  id: string;
  kind: 'activity';
  messages: ChatMessage[];
}

/**
 * What the chat content renders, in order
 */
export type ChatDisplayItem = IChatDisplayActivity | IChatDisplayMessage;

/**
 * True for system messages that have no text yet
 */
function IsEmptyText(message: ChatMessage): boolean {
  return (
    message.type === 'system' && (message.content[0]?.payload ?? '') === ''
  );
}

/**
 * Groups agent activity into collapsible blocks.
 *
 * Messages that have a stepId and are not the final answer are grouped while
 * they are consecutive. The final answer (or, once the request is finished,
 * trailing text) always stays outside of the group so it is never collapsed.
 *
 * @param messages - Messages in the session
 * @param inProgress - Whether the session is still processing a request
 */
export function GroupChatMessages(
  messages: ChatMessage[],
  inProgress: boolean,
): ChatDisplayItem[] {
  const items: ChatDisplayItem[] = [];
  let run: ChatMessage[] = [];

  const flush = () => {
    if (run.length > 0) {
      items.push({
        active: false,
        id: run[0].id,
        kind: 'activity',
        messages: run,
      });
      run = [];
    }
  };

  for (let i = 0; i < messages.length; i++) {
    const message = messages[i];
    const isLast = i === messages.length - 1;

    const isActivity =
      message.type !== 'user' &&
      message.stepId !== undefined &&
      message.isFinal !== true &&
      // finished requests keep trailing text visible even without a final flag
      !(!inProgress && isLast && message.type === 'system') &&
      !IsEmptyText(message);

    if (isActivity) {
      run.push(message);
      continue;
    }

    flush();

    // empty placeholders add nothing between activity and the answer
    if (message.stepId !== undefined && IsEmptyText(message)) {
      continue;
    }
    items.push({ kind: 'message', message });
  }
  flush();

  // only the trailing group can still be working
  const last = items[items.length - 1];
  if (inProgress && last?.kind === 'activity') {
    last.active = true;
  }

  return items;
}
