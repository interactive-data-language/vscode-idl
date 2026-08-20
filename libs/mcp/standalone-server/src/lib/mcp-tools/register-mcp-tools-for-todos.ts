import { defineTool, type Tool } from '@github/copilot-sdk';
import type { TodoItem, TodoItemStatus } from '@idl/types/chat';
import { nanoid } from 'nanoid';
import { z } from 'zod';

/**
 * Names of the to-do management tools — used by ChatService to detect
 * when a todo mutation has occurred and a `todo_update` chunk should be
 * emitted instead of a generic `tool_result` chunk.
 */
export const TODO_TOOL_NAMES = new Set([
  'todo-create',
  'todo-update',
  'todo-delete',
]);

/**
 * Create the SDK tools that let the LLM manage its per-request to-do list.
 *
 * The `todos` array is mutated in place so the caller (ChatService) always
 * has the latest state without any additional reads. `skipPermission` is
 * set so the SDK does not prompt for permission on these internal tools.
 *
 * @param todos - Mutable array initialized from `request.currentTodos`
 */
export function RegisterMCPToolsForToDos(todos: TodoItem[]): Tool<any>[] {
  const todoCreate = defineTool('todo-create', {
    description:
      'Add a new to-do item to the task list. Call this once at the start of a multi-step workflow. Returns the full list.',
    parameters: z.object({
      items: z
        .array(z.string())
        .describe('Short description of the to-do items to track.'),
    }),
    skipPermission: true,
    handler: async ({ items }) => {
      const newItems: TodoItem[] = items.map((item) => ({
        id: nanoid(),
        text: item,
        status: 'pending',
      }));

      // replace contents in place so the caller sees the new list
      todos.splice(0, todos.length, ...newItems);

      return JSON.stringify(todos);
    },
  });

  const todoUpdate = defineTool('todo-update', {
    description:
      'Update an existing to-do item by id. Use this to change the status (e.g. in-progress, done, skipped) or revise the text. Returns the full updated list.',
    parameters: z.object({
      id: z.string().describe('The id of the to-do item to update.'),
      status: z
        .enum(['pending', 'in-progress', 'done', 'skipped'])
        .optional()
        .describe('New status for the item.'),
      text: z.string().optional().describe('Revised text for the item.'),
    }),
    skipPermission: true,
    handler: async ({ id, status, text }) => {
      const item = todos.find((t) => t.id === id);
      if (!item) {
        return JSON.stringify({
          error: `No to-do item found with id "${id}"`,
          todos,
        });
      }
      if (status !== undefined) {
        item.status = status as TodoItemStatus;
      }
      if (text !== undefined) {
        item.text = text;
      }
      return JSON.stringify(todos);
    },
  });

  const todoDelete = defineTool('todo-delete', {
    description:
      'Remove a to-do item from the list by id. Returns the full updated list.',
    parameters: z.object({
      id: z.string().describe('The id of the to-do item to remove.'),
    }),
    skipPermission: true,
    handler: async ({ id }) => {
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
  });

  return [todoCreate, todoUpdate, todoDelete];
}
