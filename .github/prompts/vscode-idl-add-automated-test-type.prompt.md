---
agent: 'agent'
description: 'Add a new automated test type to the test-tokenizer generation framework'
---

Your goal is to add a new automated test type to the test-tokenizer generation framework in this codebase. The framework auto-generates Jest spec files from declarative test definitions so developers can quickly observe how behavior changes for complex cases.

## Getting Started

1. Get the name of the new test type (e.g. "ENVI Modeler", "Assembler", "Hover Help")
2. Understand what function(s) the tests will exercise and what inputs/outputs they need
3. Determine the output lib directory under `libs/tests/<name>/src/lib`

---

## Step 1 — Add interfaces to `tests.interface.ts`

File: `apps/test-tokenizer/src/test-maker/tests.interface.ts`

Add two interfaces at the bottom of the file, following the `IAssemblerTest` / `IAutoAssemblerTest` pattern:

- **Individual test interface** (`IXxxTest`) — fields: `name: string` plus whatever inputs the function under test requires
- **Suite wrapper interface** (`IAutoXxxTest extends IBaseAutoTest`) — field: `tests: IXxxTest[]`

Add any required type imports at the top of the file.

Example (for ENVI Modeler):
```typescript
export interface IENVIModelerTest {
  name: string;
  nodes: ENVIModelerNode[];
  edges: ENVIModelerEdge[];
}

export interface IAutoENVIModelerTest extends IBaseAutoTest {
  tests: IENVIModelerTest[];
}
```

---

## Step 2 — Create the auto-tests interface file

Create: `apps/test-tokenizer/src/test-maker/tests/auto-<name>-tests.interface.ts`

Export an empty array constant of the suite wrapper type. The developer will populate this with test suites.

Example:
```typescript
import { IAutoENVIModelerTest } from '../tests.interface';

export const AUTO_ENVI_MODELER_TESTS: IAutoENVIModelerTest[] = [];
```

---

## Step 3 — Create the maker function

Create: `apps/test-tokenizer/src/test-maker/makers/tests-for-<name>.ts`

Export an async function `TestsForXxx(name: string, tests: IXxxTest[], uri = join(process.cwd(), 'tokens.ts'))`.

The maker does two things:
1. **At generation time**: runs the actual logic against each test's inputs to capture expected outputs as inline snapshots
2. **Emits a spec file**: writes TypeScript source code to `uri` that reproduces the same setup and asserts against those snapshots

### Key patterns

- Build up a `strings: string[]` array and call `writeFileSync(uri, strings.join('\n'))` at the end
- The generated spec file must be self-contained (all imports, all setup, all assertions inline)
- For each test, serialize inputs as JSON literals using `JSON.stringify(value, null, 2)`
- Close with `strings.push('});')` and `strings.push('')`

### Registry setup (required for ENVI Modeler tests)

When the function under test requires an `MCPTaskRegistry`, bootstrap it fully — both at generation time **and** in the emitted spec (once per file, outside the `describe` block):

```typescript
// generation-time bootstrap
const logManager = new LogManager({ alert: () => {} });
const index = new IDLIndex(logManager, 1, false);
index.loadGlobalTokens(DEFAULT_IDL_EXTENSION_CONFIG);
const registry = new MCPTaskRegistry(logManager);
registry.registerTasksFromGlobalTokens(
  index.globalIndex.globalTokensByTypeByName[GLOBAL_TOKEN_TYPES.FUNCTION],
  index.globalIndex.globalTokensByTypeByName[GLOBAL_TOKEN_TYPES.STRUCTURE],
);
```

Emit the equivalent code into the generated spec using `strings.push(...)`.

Required imports for registry-based tests (in both maker and generated spec):
- `LogManager` from `@idl/logger`
- `MCPTaskRegistry` from `@idl/mcp/tasks`
- `IDL_INDEX_OPTIONS, IDLIndex` from `@idl/parsing/index`
- `GLOBAL_TOKEN_TYPES` from `@idl/types/idl-data-types`
- `DEFAULT_IDL_EXTENSION_CONFIG` from `@idl/vscode/extension-config`

### Structure of one generated test

```typescript
it(`[auto generated] ${testName}`, () => {
  // inputs serialized as JSON literals
  const nodes: ENVIModelerNode[] = <JSON>;
  const edges: ENVIModelerEdge[] = <JSON>;

  // call function under test
  const errors = ValidateENVIModelerWorkflow(nodes, edges, registry);

  // inline snapshot of expected output (captured at generation time)
  const expectedErrors: string[] = <captured>;
  expect(errors).toEqual(expectedErrors);

  // conditional: only emit workflow assertion when there are no errors
  if (workflow !== undefined) {
    const expectedWorkflow = <captured>;
    expect(CreateENVIModelerWorkflow(nodes, edges, registry)).toEqual(expectedWorkflow);
  }
});
```

Look at `apps/test-tokenizer/src/test-maker/makers/tests-for-envi-modeler.ts` for a complete reference implementation.

---

## Step 4 — Wire into the generator

File: `apps/test-tokenizer/src/test-maker/generate-automated-tests.ts`

Add two imports near the other maker/test imports:
```typescript
import { TestsForXxx } from './makers/tests-for-xxx';
import { AUTO_XXX_TESTS } from './tests/auto-xxx-tests.interface';
```

Add a generation block at the end of `GenerateAutomatedTests()`, following the exact same pattern as every other block:
```typescript
const outDirXxx = join(process.cwd(), 'libs/tests/<name>/src/lib');
CleanTestDir(outDirXxx);
console.log('Generating tests for <name>');
for (let i = 0; i < AUTO_XXX_TESTS.length; i++) {
  console.log(`  Suite (${i}): ${AUTO_XXX_TESTS[i].suiteName}`);
  await TestsForXxx(
    AUTO_XXX_TESTS[i].suiteName,
    AUTO_XXX_TESTS[i].tests,
    join(outDirXxx, AUTO_XXX_TESTS[i].fileName),
  );
}
console.log();
```

---

## Step 5 — Set up the test lib

If `libs/tests/<name>/` does not yet exist, scaffold it to match the pattern of an existing test lib such as `libs/tests/assembler/`. Required files:
- `project.json` — name: `"tests-<name>"`, executor: `@nx/jest:jest`
- `jest.config.ts`
- `tsconfig.json`, `tsconfig.lib.json`, `tsconfig.spec.json`
- `.eslintrc.json`
- `src/index.ts` — leave empty (no exports)
- `src/lib/` — directory for generated spec files

If the lib already exists, make sure `src/index.ts` is empty (no broken exports).

Also check `tsconfig.base.json` to confirm the path alias follows the `"@idl/tests/<name>"` pattern used by all other test libs.

---

## Step 6 — Create a placeholder spec

Create: `libs/tests/<name>/src/lib/auto-<name>-basic.spec.ts`

```typescript
describe(`[auto generated] <Name> placeholder`, () => {
  /* stub — run the test-tokenizer generator to populate this directory */
});
```

This ensures Jest recognizes the suite and the directory is non-empty before the generator runs.

---

## Verification

1. Check for TypeScript errors in the edited files
2. Populate `AUTO_XXX_TESTS` in the interface file with at least one test suite entry
3. Run the test-tokenizer NX generator target — should log `Generating tests for <name>` without errors
4. Run `nx test tests-<name>` — stub spec (or generated specs) should pass
