import type { TodoItem, TodoItemStatus } from '@idl/types/chat';
import { DynamicStructuredTool } from '@langchain/core/tools';
import { nanoid } from 'nanoid';
import { z } from 'zod';

/**
 * Names of the to-do management tools — used by ChatService to detect
 * when a todo mutation has occurred and a `todo_update` chunk should be emitted.
 */
export const TODO_TOOL_NAMES = new Set([
  'todo-create',
  'todo-update',
  'todo-delete',
  'todo-list',
]);

/**
 * Create the four LangChain tools that let the LLM manage its to-do list.
 *
 * The `todos` array is mutated in place so the caller (ChatService) always
 * has the latest state without any additional reads.
 *
 * @param todos - Mutable array initialized from `request.currentTodos`
 */
export function RegisterMCPToolsForToDos(
  todos: TodoItem[],
): DynamicStructuredTool[] {
  const todoCreate = new DynamicStructuredTool({
    name: 'todo-create',
    description:
      'Add a new to-do item to the task list. Call this once at the start of a multi-step workflow. Returns the full list.',
    schema: z.object({
      items: z
        .array(z.string())
        .describe('Short description of the to-do items to track.'),
    }),
    func: async (newToDos) => {
      const items: TodoItem[] = newToDos.items.map((item) => {
        return { id: nanoid(), text: item, status: 'pending' };
      });

      // empty
      todos.splice(0, todos.length);

      // populate
      todos.push(...items);

      return JSON.stringify(todos);
    },
  });

  const todoUpdate = new DynamicStructuredTool({
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
    func: async ({ id, status, text }) => {
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

  const todoDelete = new DynamicStructuredTool({
    name: 'todo-delete',
    description:
      'Remove a to-do item from the list by id. Returns the full updated list.',
    schema: z.object({
      id: z.string().describe('The id of the to-do item to remove.'),
    }),
    func: async ({ id }) => {
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

  const todoList = new DynamicStructuredTool({
    name: 'todo-list',
    description:
      'Return the current to-do list without modifying it. Use this at the start of a new turn to re-orient after a long workflow.',
    schema: z.object({}),
    func: async () => JSON.stringify(todos),
  });

  return [todoCreate, todoUpdate, todoDelete, todoList];
}
