# Angular Modernization Audit

Snapshot of every Angular app/lib in the workspace against modern Angular (root version: 21.1.6) patterns: `inject()`, standalone components, new control flow (`@if`/`@for`/`@switch`), signals, and `input()`/`output()`/`viewChild()` functions. Manual audit, not auto-generated — re-run the greps below to refresh counts before acting on this doc.

## Apps

### `apps/agents/ui` — Modern (5/5)

- Executor: `@angular/build:application`
- Standalone components, `inject()` throughout, no `constructor()` DI found.
- No action needed; use as the reference implementation.

### `apps/vscode/webview` — Modernized (5/5)

- Executor: `@angular/build:application` ✅ (migrated)
- Standalone: 3/3 components converted (`app`, `home`, `profiler`); `AppModule`/`HomeModule`/`ProfilerModule`/`ServicesModule` deleted, `main.ts` uses `bootstrapApplication()`
- DI: `inject()` throughout; the "empty ctor" note below was inaccurate — `vscode.service.ts`'s constructor has real setup logic and was left as-is
- Control flow: unchanged, still just the pre-existing `@switch`
- Decorators: `@ViewChild()` replaced with `viewChild.required()` signal queries in `profiler.component.ts`
- Signals: none added beyond the view queries above
- **Known pre-existing issue found during this migration (unrelated to standalone/executor work)**: [libs/vscode/webview/src/lib/idl-webview.ts](../../libs/vscode/webview/src/lib/idl-webview.ts) loads the webview from `dist/apps/idl-webview`, but the build output path is `dist/apps/vscode/webview` — these no longer match (likely leftover from an earlier project rename). Not fixed here; flagged for follow-up.

### `apps/notebook/components` — Standalone conversion done, executor swap rejected

- Standalone: converted all 9 components (`animation-controls`, `entry`, `image`, `image-animator`, `map`, `map-layer-card`, `map-property-sheet`, `plot`, plus the base class) to `standalone: true`; deleted `AppModule`, `ComponentsModule`, and the dead unused `AppComponent` (never bootstrapped, empty template, stale spec — confirmed via [libs/vscode/webview/src/lib/idl-webview.ts](../../libs/vscode/webview/src/lib/idl-webview.ts)-style search, no selector usage anywhere)
- `main.ts` rewritten to use `createApplication()` + `createCustomElement()` directly (Angular's documented NgModule-free pattern for Angular Elements) instead of `platformBrowserDynamic().bootstrapModule(AppModule)`
- `@ViewChild`/`@Input`/`@Output` replaced with `viewChild.required()`/`input()`/`output()` everywhere **except** two accessor-pattern inputs (`BaseRendererComponent.embed`, `EntryComponent.data`) — both have setter side effects that signal `input()` can't express, left as `@Input()` decorators intentionally (documented inline)
- The earlier audit's "5 `constructor()` DI" claim was wrong — none of this app's constructors actually take injected parameters; they're legitimate lifecycle/init code (event listeners, `super()` calls) and were left alone
- **Executor swap NOT done — reverted after testing.** `@angular/build:application` (esbuild-based) produces an extra unpredictably-named shared chunk (e.g. `chunk-VKXUQOLG.js`) that isn't present with `@angular-devkit/build-angular:browser`. [apps/notebook/renderer/src/main.ts](../../apps/notebook/renderer/src/main.ts) hardcodes static imports of `runtime.js`, `polyfills.js`, and `main.js` from this app's dist output — a missing chunk import would silently break the notebook renderer in the shipped extension. Confirmed via a real production build comparison; kept the legacy executor. Revisiting this needs either a way to disable esbuild's chunk splitting for this entry, or changing `apps/notebook/renderer` to dynamically discover/import whatever files are actually emitted instead of hardcoding names.

## Libs

| Lib                   | Status                       | Notes                                                                                                                                     |
| --------------------- | ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `libs/ngx/chat`       | Modern (5/5)                 | Standalone, `inject()`, signals (`signal`/`computed`/`effect`), `OnPush`, `toSignal()`. Reference implementation for signals-based state. |
| `libs/ngx/theme`      | Modern services              | `inject()`-based service + NGXS state, no components to standalone-ize.                                                                   |
| `libs/ngx/app-config` | Modern services              | `inject(HttpClient)`-based service, no components.                                                                                        |
| `libs/ngx/material`   | Intentional NgModule wrapper | Re-exports Angular Material/CDK modules; **do not convert** — this pattern is the correct one for a module re-export lib.                 |
| `libs/ngx/map`        | No Angular code found        | Zero `@angular/core` imports — stub/marker lib only, needs no action.                                                                     |

Confirmed via `@angular/core` import grep across `libs/**`: only the 22 files listed above import it; no other Angular libs exist outside `libs/ngx/*`.

## Priority order

1. **`apps/vscode/webview`** — smallest surface (3 components, 1 leftover empty constructor), highest day-to-day dev traffic (main extension UI). Do first.
2. **`apps/notebook/components`** — larger surface, and the `DoBootstrap`/Angular Elements bootstrap needs a spike before committing to a standalone conversion plan.
3. `libs/ngx/material`, `libs/ngx/map` — no action.

## Migration steps per project

### `apps/vscode/webview` — done

1. ~~Remove the empty `constructor()` in `vscode.service.ts`~~ — not actually dead code, skipped.
2. ✅ Converted `AppComponent`, `HomeComponent`, `ProfilerComponent` to `standalone: true`; deleted `AppModule`/`HomeModule`/`ProfilerModule`/`ServicesModule`; `MaterialModule` NgModule kept and imported directly into standalone components.
3. ✅ Replaced `@ViewChild()` decorators in `profiler.component.ts` with `viewChild.required()` signal queries.
4. ✅ Switched build/serve/extract-i18n executors to `@angular/build:application`/`:dev-server`/`:extract-i18n`; kept a flat `outputPath` (`{ base, browser: "" }`) so `dist/apps/vscode/webview` still has no `/browser` subfolder, matching prior consumers.
5. ✅ Removed the two commented-out `*ngIf` lines in `home.component.html`.

### `apps/notebook/components` — done (except executor)

1. ✅ Spiked the `ngDoBootstrap()`/Angular Elements bootstrap — replaced with `createApplication()` + `createCustomElement()` in `main.ts`, no NgModule needed.
2. ✅ Converted all components to standalone, leaf components first.
3. ~~Replace remaining `constructor()` DI~~ — none of the constructors actually inject services; claim was inaccurate, skipped.
4. ✅ Replaced `@Input`/`@Output`/`@ViewChild` with `input()`/`output()`/`viewChild()`, except two accessor-pattern inputs kept as decorators (documented above).
5. ❌ **Not done**: build executor swap — reverted after a production build showed it breaks `apps/notebook/renderer`'s hardcoded static imports (see above). Needs a follow-up design change before attempting again.

## Verification checklist

- [ ] Re-run the greps in this doc after each project's conversion to confirm counts drop to zero (standalone, `@Input`/`@Output`/`@ViewChild`, `constructor()` DI)
- [ ] `nx lint` and `nx test` pass for the converted project
- [ ] Notebook renderer still registers/bootstraps as a custom element correctly in a real notebook (manual smoke test — this is the highest-risk regression)
- [ ] VS Code webview still loads under the extension host after the builder swap
