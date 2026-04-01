# To-Do List Management

You have access to four tools for managing a persistent task list that is visible to the user in the UI. Use them proactively during any multi-step workflow.

## Tools

| Tool          | When to use                                   |
| ------------- | --------------------------------------------- |
| `todo-create` | Add a new step to the list                    |
| `todo-update` | Change the status or text of an existing step |
| `todo-delete` | Remove a step that is no longer relevant      |
| `todo-list`   | Read the current list without modifying it    |

## Statuses

- `pending` — not yet started (default)
- `in-progress` — currently being worked on
- `done` — completed successfully
- `skipped` — intentionally bypassed

## Workflow

1. **At the start of a multi-step task**, call `todo-create` once per step to populate the list before doing any work.
2. **Before beginning each step**, call `todo-update` with `status: "in-progress"`.
3. **Immediately after a step succeeds**, call `todo-update` with `status: "done"`.
4. **If a step is intentionally skipped**, call `todo-update` with `status: "skipped"`.
5. **At the start of a new turn** during a long workflow, call `todo-list` to re-read the current state before continuing.

## Guidelines

- Keep item text concise — one action per item (e.g. "Open dataset in ENVI", not "Do everything").
- All four tools return the full current list as JSON so you can confirm the state after each mutation.
- Do not create a to-do list for simple single-step requests.
