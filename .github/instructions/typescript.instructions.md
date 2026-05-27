---
applyTo: "**/*.ts"
description: "TypeScript coding conventions for the vscode-idl codebase — naming, imports, types, null handling, functions, classes, error handling, JSDoc, formatting, and testing patterns"
---

# TypeScript Coding Conventions

## Naming Conventions

**Functions (exported and internal file-private helpers):** PascalCase
```ts
export function CleanPath(uri: string): string { ... }
function BuildIdMap(nodes: ENVIModelerNode[]): Map<string, string> { ... }
export async function GetAutoComplete(...): Promise<GetAutoCompleteResponse> { ... }
```

**Classes:** PascalCase
```ts
export class GlobalIndex { ... }
export class CancellationToken { ... }
```

**Interfaces:** PascalCase with `I` prefix
```ts
export interface IFindTokensOptions { ... }
export interface IParserOptions { ... }
export interface IMessageToWorker<_Message extends string> { ... }
```

**Type aliases:** PascalCase, no `I` prefix
```ts
export type ParsedType = 'def' | 'notebook' | 'pro';
export type LogInterceptor = (options: ILogOptions) => void;
export type NameCounters = Record<string, number>;
```

**Module-level constants:** SCREAMING_SNAKE_CASE
```ts
export const LAYOUT_BASE_X = 1200;
export const TOKEN_TYPES: ITokenTypes = { BASIC: 0, START: 1, END: 2 };
```

**Exported mutable module-level state:** SCREAMING_SNAKE_CASE with `export let`
```ts
export let EXTENSION_FOLDER = '';
export let LANGUAGE_SERVER_CLIENT: LanguageClient;
```

**Local variables:** camelCase
```ts
const foundDefs: ITokenDef<TokenName>[] = [];
let hasLineContinuation = false;
```

**Generic type parameters:** PascalCase with
```ts
export class WorkerIO<Message extends string> { ... }
export interface IMessageToWorker<Message extends string> { ... }
```

**File naming:** kebab-case with dot-separated category suffix
- `name.class.ts` — class definitions
- `name.interface.ts` — interfaces, types, and constants
- `name.class.interface.ts` — interface for a specific class
- `name.spec.ts` — test files
- `verb-noun.ts` — standalone utility functions (e.g., `clean-path.ts`, `get-sort-idx.ts`)
- `index.ts` — barrel re-exports only

---

## Imports

**Always use named imports.** Default imports are not used.
```ts
import { CancellationToken } from '@idl/cancellation-tokens';
import { existsSync, readFileSync } from 'fs';
import { basename, dirname, join } from 'path';
```

**Star (`* as`) imports only** for modules without good typings or where the whole namespace is needed:
```ts
import * as vscode from 'vscode';
```

**CJS interop** uses `= require()` syntax:
```ts
import GlobToRegExp = require('glob-to-regexp');
```

**Use `@idl/...` path aliases** for all cross-library imports — never use deep relative paths across library boundaries:
```ts
import { IDL_TRANSLATION } from '@idl/translation';
import { CleanPath } from '@idl/shared/extension';
```

**Barrel `index.ts` files** contain only `export * from '...'` lines — no logic, no default exports, no selective re-exports:
```ts
export * from './lib/clean-path';
export * from './lib/simple-promise-queue.class';
```

---

## Type Annotations

**Use `undefined`, not `null`.** Never use `null` to represent the absence of a value — use `undefined` or optional (`?`) members instead. This keeps absence checks consistent and avoids the two-value problem (`null` vs `undefined`) throughout the codebase.

```ts
// DO — optional parameter (implicitly `string | undefined`)
export function MyFunc(optParam?: string): void { ... }

// DO — optional property in an interface
export interface IMyOptions {
  folder?: string;       // string | undefined, not string | null
  closer?: ITokenDef;
}

// DO — explicit undefined union when a variable may not be set yet
let current: string | undefined;

// DO — check with !== undefined (not truthiness) when falsy values are valid
if (current !== undefined) { ... }

// DON'T — never use null
let current: string | null = null;     // avoid
export function MyFunc(optParam: string | null): void { ... } // avoid
```

**Explicit parameter and return types on all exported functions:**
```ts
export function NextName(counters: NameCounters, prefix: string): string { ... }
export function ComputeLayout(nodes: ENVIModelerNode[]): Map<string, [number, number]> { ... }
```

Return type may be omitted when trivially inferred from a simple expression.

**`any` only when truly necessary** — e.g., cross-boundary serialization or genuinely unknown shapes. Do not use it to avoid typing work.

**Generics** are used extensively for typed message passing, event systems, and indexed lookups:
```ts
export class WorkerIO<Message extends string> { ... }
export type ExportedGlobalTokensByType = { [key in GlobalTokenType]: IGlobalIndexedToken<key>[] };
```

**Prefer `{ [key: string]: T }` index types over `Map`** for plain data objects that are serialized or iterated by key:
```ts
changedFiles: { [key: string]: boolean } = {};
globalTokensByFile: { [key: string]: GlobalTokens } = {};
```

**`Partial<Record<K, V>>`** and mapped types for optional lookup tables:
```ts
export const FIXED_DISPLAY_NAMES: Partial<Record<ENVIModelerNode['type'], string>> = { ... };
```

**`interface` vs `type`:**
- `interface` with `I` prefix → object shapes that describe a data structure or contract
- `type` → unions, mapped types, function signatures, string literal sets, and type composition

---

## Null and Undefined Handling

**Prefer `??` over `||`** for falsy-safe defaults (avoids incorrectly overriding `0`, `''`, `false`):
```ts
counters[prefix] = (counters[prefix] ?? 0) + 1;
base['revision'] = node.revision ?? '1.0.0';
```

**Explicit `!== undefined`** for values that could be legitimately falsy:
```ts
if (buff !== undefined) { ... }
if (problem !== undefined) { ... }
```

**Optional chaining (`?.`)** in usage:
```ts
if (first?.name in NAME_TOKENS) { ... }
```

**No non-null assertion (`!`).** Handle `undefined` explicitly rather than asserting it away.

---

## Function Style

**Top-level exported functions and internal file helpers:** regular `function` declarations (not arrow functions assigned to `const`)
```ts
export function CleanPath(uri: string): string { ... }
function BuildIdMap(nodes: ENVIModelerNode[]): Map<string, string> { ... }
```

**Callbacks and inline functions:** arrow functions
```ts
vscode.workspace.onDidChangeConfiguration((ev) => { ... });
this.listeners[fileType].forEach((listener) => { listener(payload); });
```

**Async:** always `async/await`. No raw `.then()` / `.catch()` chains.
```ts
export async function GetAutoComplete(...): Promise<GetAutoCompleteResponse> {
  const recipes = await GetCompletionRecipes(index, file, code, position);
  return BuildCompletionItems(index, recipes, config, formatting);
}
```

**`switch (true)` pattern** as an alternative to long `if/else if` chains:
```ts
switch (true) {
  case kids.length === 0: { ... } break;
  case kids.length > 1: { ... } break;
  default: break;
}
```

---

## Classes vs Standalone Functions

**Use classes** for stateful, long-lived objects with clear lifecycle (construct → use → destroy):
- e.g., `IDLIndex`, `LogManager`, `WorkerIO`, `CancellationToken`

**Static methods on classes** for related utility logic that belongs conceptually to the class:
```ts
export class IDLFileHelper {
  static isConfigFile(file: string): boolean { ... }
}
```

**Standalone exported functions** for stateless logic with no shared state:
```ts
export function CleanPath(uri: string): string { ... }
export function GetSortIndexForStrings(arr: string[]): number[] { ... }
```

**Module-level `export let` singletons** for shared global state — initialized by a separate `Initialize...()` function, not a singleton class:
```ts
export let IDL_EXTENSION_CONFIG: IIDLWorkspaceConfig;
export let LANGUAGE_SERVER_CLIENT: LanguageClient;
```

---

## Error Handling

**Minimal try/catch.** Let errors propagate unless there is a specific, documented reason to catch them. Do not wrap large blocks defensively.

**When intentionally skipping a try/catch, leave the commented-out block** with an explanation:
```ts
// Don't catch errors at this level — failures should propagate so they
// get caught and reported at the caller.
// try {
Object.assign(tokenized, Tokenizer(code, cancel, tokenOptions));
// } catch (err) { ... }
```

**Route errors via callbacks** passed into constructors rather than throwing from within class internals:
```ts
constructor(options: ILogManagerOptions) {
  this.alert = options.alert; // caller decides how to surface errors
}
```

**`CancellationToken` uses throw for control flow** — this is the one intentional throw-for-flow pattern:
```ts
throwIfCancelled() {
  if (this.cancelRequested()) throw new Error(CANCELLATION_MESSAGE);
}
```

---

## Comments and JSDoc

**`/** ... */` JSDoc on all exported functions, classes, interfaces, and class members:**
```ts
/**
 * Converts a file-system path to a normalized URI string.
 */
export function CleanPath(uri: string): string { ... }
```

**Single-line `/** */` for interface and class properties:**
```ts
/** Cancellation token */
cancel: CancellationToken;

/** Worker threads by worker ID */
workers: { [key: string]: Worker } = {};
```

**`/** */` for significant local variable declarations** inside functions:
```ts
/** Current position of the iteration cursor */
const current = iterator.current;
```

**No `@param` or `@returns` tags.** Write the full description in the summary line of the JSDoc block.

**Preserve commented-out code** with an explanatory comment — do not silently delete it.

---

## Formatting

- **Single quotes** for all string literals: `'pro'`, `'my_file.pro'`
- **Semicolons** always
- **2-space indentation**
- **Trailing commas** in multiline function call arguments and array/object literals
- **Template literals** for string interpolation: `` `${prefix}_${count}` ``
- Target **~80–100 character line length**; break long import lists and argument lists across lines

