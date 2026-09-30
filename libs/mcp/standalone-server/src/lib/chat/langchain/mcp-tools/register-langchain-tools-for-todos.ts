import type { TodoItem, TodoItemStatus } from '@idl/types/chat';
import { tool } from '@langchain/core/tools';
import { nanoid } from 'nanoid';
import { z } from 'zod';

/**
 * Names of the to-do management tools — used by LangChainChatService to detect
 * when a todo mutation has occurred and a `todo_update` chunk should be
 * emitted instead of a generic `tool_result` chunk.
 */
export const LANGCHAIN_TODO_TOOL_NAMES = new Set([
  'todo-create',
  'todo-update',
  'todo-delete',
]);

/**
 * Create LangChain tools that let the LLM manage its per-request to-do list.
 *
 * The `todos` array is mutated in place so the caller always has the latest
 * state. These are the LangChain-compatible equivalents of the Copilot SDK
 * todo tools in `register-mcp-tools-for-todos.ts`.
 *
 * @param todos - Mutable array initialized from `request.currentTodos`
 */
export function RegisterLangChainToolsForToDos(todos: TodoItem[]) {
  const todoCreate = tool(
    async ({ items }: { items: string[] }) => {
      const newItems: TodoItem[] = items.map((item) => ({
        id: nanoid(),
        text: item,
        status: 'pending',
      }));
      todos.splice(0, todos.length, ...newItems);
      return JSON.stringify(todos);
    },
    {
      name: 'todo-create',
      description:
        'Add new to-do items to the task list. Call this once at the start of a multi-step workflow. Returns the full list.',
      schema: z.object({
        items: z
          .array(z.string())
          .describe('Short descriptions of the to-do items to track.'),
      }),
    },
  );

  const todoUpdate = tool(
    async ({
      id,
      status,
      text,
    }: {
      id: string;
      status?: TodoItemStatus;
      text?: string;
    }) => {
      const item = todos.find((t) => t.id === id);
      if (!item) {
        return JSON.stringify({
          error: `No to-do item found with id "${id}"`,
          todos,
        });
      }
      if (status !== undefined) {
        item.status = status;
      }
      if (text !== undefined) {
        item.text = text;
      }
      return JSON.stringify(todos);
    },
    {
      name: 'todo-update',
      description:
        'Update an existing to-do item by id. Use this to change the status (e.g. in-progress, done, skipped) or revise the text. Returns the full updated list.',
      schema: z.object({
        id: z.string().describe('The id of the to-do item to update.'),
        status: z
          .enum(['pending', 'in-progress', 'done', 'skipped'])
          .optional()
          .describe('New status for the item.'),
        text: z.string().optional().describe('Revised text for the item.'),
      }),
    },
  );

  const todoDelete = tool(
    async ({ id }: { id: string }) => {
      const index = todos.findIndex((t) => t.id === id);
      if (index === -1) {
        return JSON.stringify({
          error: `No to-do item found with id "${id}"`,
          todos,
        });
      }
      todos.splice(index, 1);
      return JSON.stringify(todos);
    },
    {
      name: 'todo-delete',
      description:
        'Remove a to-do item from the list by id. Returns the full updated list.',
      schema: z.object({
        id: z.string().describe('The id of the to-do item to remove.'),
      }),
    },
  );

  return [todoCreate, todoUpdate, todoDelete];
}
