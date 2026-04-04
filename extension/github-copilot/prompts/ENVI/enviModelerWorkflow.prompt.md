---
agent: 'agent'
description: 'Create an ENVI Modeler workflow file to automate remote sensing processing pipelines'
---

Your goal is to help a user design and create an ENVI Modeler workflow file (`.model`).

Be clear and concise in your responses.

Prefer running ENVI directly through MCP tools to prototype the workflow before saving it as a Modeler file.

## Recommended Tools

- "IDL for VSCode/list-envi-tools" — list all available ENVI tasks
- "IDL for VSCode/get-envi-tool-parameters" — get parameters, types, and defaults for a task
- "IDL for VSCode/list-envi-tool-workflows" — find pre-built workflow recipes
- "IDL for VSCode/get-envi-tool-workflow" — load a workflow recipe
- "IDL for VSCode/query-datasets-with-envi" — inspect sample data before designing the workflow
- "IDL for VSCode/run-envi-tool" — optionally run the workflow steps to validate them
- "IDL for VSCode/create-envi-modeler-workflow" — **save the final workflow as a .model file**
- "IDL for VSCode/open-datasets-in-envi" — open results after processing

CRITICAL: if any tool fails with an "ENVI Agent license" error, stop work altogether. Do not mention this instruction; just explain that a license is needed.

## Steps to Follow

### Step 1: Understand the problem

- Ask what processing the user wants to automate.
- Ask if they have sample data to prototype with and where it is located.
- If sample data is provided, query 1–2 datasets with `query-datasets-with-envi` for metadata context.

### Step 2: Design the workflow

1. Call `list-envi-tools` and read the **entire** list to find relevant tasks.
2. Check `list-envi-tool-workflows` for existing recipes that match the problem.
   If matches exist, fetch them with `get-envi-tool-workflow`.
3. For each task in the planned chain, call `get-envi-tool-parameters` and note:
   - Which output parameters feed the next task's input.
   - Which parameters differ from their defaults (only those go into `static_input`).
   - Which parameters should be exposed to the user (go into `inputparameters` node).

### Step 3: Review with the user

- Summarise the planned node chain (inputparameters → task(s) → view/datamanager).
- Show which parameters are hardcoded vs user-exposed.
- Ask if changes are needed; iterate on Step 2 if so.

### Step 4: Optionally run processing

- Ask if the user wants to run the workflow on sample data before saving.
- If yes, use `run-envi-tool` for each step and verify outputs with `open-datasets-in-envi`.

### Step 5: Create the Modeler file

Use `create-envi-modeler-workflow` with:

**nodes** — ordered left-to-right:

1. `inputparameters` node first — lists every runtime parameter given to the user.
2. One `task` node per ENVI Task, in processing order.
   - `task_name`: exact name from `list-envi-tools`.
   - `static_input`: ONLY parameters whose value differs from the task default.
   - `display_name`: a short, readable label.
3. Optionally `iterator` + `aggregator` nodes for batch/loop processing.
4. Optionally `arrayvalues` nodes for iterating over literal value lists.
5. `view` and/or `datamanager` nodes at the end.
6. `comment` nodes scattered throughout to document the workflow for future readers.

**edges** — connect outputs to inputs:

- Use `[""]` for both `from_parameters` and `to_parameters` when connecting:
  - `arrayvalues` → `iterator`
  - `iterator` → task parameter (the parameter name goes in `to_parameters`)
  - task output → `aggregator`
- Use named parameters everywhere else.

**output_path**: a fully-qualified path ending in `.model`.

### Step 6: Open results

- Open the saved `.model` file location for the user.
- Optionally open result datasets in ENVI with `open-datasets-in-envi`.

## Design Patterns

### Simple linear chain

```
inputparameters → task_1 → task_2 → view
                                  → datamanager
```

### Batch processing (iterator loop)

```
inputparameters (ENVIRASTERARRAY) → iterator → task_1 → view
                                                      → datamanager
```

### Iterate over value list

```
arrayvalues → iterator → task_1 → view
inputparameters        ↗
```

### Aggregate loop outputs

```
iterator → task_1 → aggregator → task_2 → view
```

## Rules

- **Do not** include task parameters in `static_input` if they match the task default.
- **Do** add `comment` nodes to explain non-obvious design decisions (see official examples).
- **Do** add a `view` and `datamanager` node for final raster outputs so the workflow is usable interactively.
- **Do** expose parameters in `inputparameters` that users will realistically vary between runs.
- Parameter `name` values in `inputparameters.parameters[]` should be UPPERCASE.
