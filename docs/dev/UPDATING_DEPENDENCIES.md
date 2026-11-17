# Updating Dependencies

Document that walks through the func, exciting process of updating dependencies!

## Note About Updating ZOD

Ignore if you aren't updating ZOD :)

Zod is a special library - it has changes at the `tsconfig.base.json` to map to V3 from zod V4.

Also have aliases mapped out in the webpack files:

- webpack.node.config.js
- webpack.vscode.config.js

## Global NX

First, update global NX (if updating to latest NX):

`npm i -g nx@latest`

## Migrating NX - Updates Angular, TypeScript, and more

The big honcho, takes a while and updates key components. Read through this before getting started, you may need to go through a few iterations before this is finished.

1. Run `npm outdated` to see how out of date some libraries are

2. Check NX updates first as this is the most complicated and potentially breaks our web applications (backed by angular)

- View on NPM and see what the latest minor version is (i.e. major.minor.patch)

- Execute `nx migrate 21.latest.latest` where 21 should be the current version

3. After this finishes, you'll need to make sure a number of libraries are updated in the package.json file:

- `@ngbracket/ngx-layout` should pair with angular version, check NPM
- `angular-material-css-vars` should pair with angular version, check NPM

4. (Optional) Delete the `package-lock.json` and `node_modules` folder.

> This is not required, but can sometimes cause critical problems with major version changes
> If you have problems with the next step, this is a good place to start

5. Install all dependencies with `npm i`

> There's a 50/50 chance you will need to micro-manage some libraries. This is where you'll get dependency conflicts if you didn't update the libraries above when angular versions change.

6. Run NX migrations with `nx migrate --run-migrations`

> This auto-updates code for any library version changes

> CRITICAL: Verify code changes. Sometimes there are bugs and it makes changes to test files.
> Ex: it just did that to 600+ test files that changes were discarded for

6.5 Reset the NX daemon

7. Do a sanity check that everything builds correctly with `npm start`

8. Verify no horrible breaking changes for Angular applications

- Open the IDL and ENVI hello world notebooks and run all cells and verify embedded cells look right

- Start a session of IDL and start/stop the profiler

- Change from light to dark theme to verify that theme changes are picked up

9. Make sure test generation still works (helps catch runtime errors from lib changes) with `npm run generate-tests`

10. Commit all changes to GitHub as a checkpoint

11. If you need to migrate to a major version of NX, repeat steps

> CRITICAL: Recommended path is to migrate to latest minor version you have before updating major versions
>
> You can also do something like 21 => latest 21.X => 22.0 => latest 22.X
>
> Sometimes you have to jump right to latest 22.X version because there's usually some issue with brand new versions

12. Once NX has been updated, you _must_ run this command: `nx format:write --all`

This makes sure that formatting rules are updated and match whatever version of prettier are included in the library.

### Notes From The NX 22 => 24 Migration

- Update in phases and commit between them: NX 23 + ESLint, then Angular + TypeScript, then NX 24. NX does not ship package updates for every Angular version, so Angular companion libs (ngxs, ngx-layout, ngx-markdown, jest-preset-angular, angular-eslint) are bumped by hand.

- With npm 12, `nx migrate` fails the provenance check. Run it with `NX_SKIP_PROVENANCE_CHECK=true NX_MIGRATE_CLI_VERSION=<target version> npx nx migrate <target version>`. It takes about 10 minutes and, as of NX 24, asks interactive questions (pick "Required only" and skip Nx Cloud), so do not redirect its output.

- Instead of deleting `package-lock.json`, remove the lock entries for the libraries being migrated (`nx`, `@nx/*`, etc.), delete `node_modules`, and run `npm i`. This avoids bumping about 40 unrelated packages. Compare against `git show HEAD:package-lock.json` to verify.

- Do not bump the ESM-only libs (ansi-styles, chalk, case-anything, json-stringify-pretty-compact, nanoid) because they do not work with jest.

- Executors (`@nx/webpack:webpack`, `@nx/jest:jest`, `@nx/eslint:lint`, `@nx/cypress:cypress`) are replaced by inferred plugins in `nx.json`.
  - Each webpack app has its own `webpack.config.js` built with `createNodeConfig` or `createVscodeConfig` from `webpack.node.config.js` and `webpack.vscode.config.js`. The `production` configuration is read from `NX_TASK_TARGET_CONFIGURATION`.
  - Jest tests expect to run from the workspace root, which `tools/node/jest-workspace-cwd.js` (set in `jest.preset.js`) handles.

- TypeScript 6 uses `moduleResolution: bundler` (with `module: commonjs` for the compile targets) and has no `baseUrl`, so `paths` start with `./`. The `apps/vscode/client-web/tsconfig.app.json` paths are kept in sync by `npm run merge-client-web-paths`.

## Migrating Libraries

Anything not auto-managed by NX, we also need to try to update to resolve vulnerabilities and more.

### Process

See list below of libs to skip

1. Run `npm outdated` to see all deps

2. Pick one that is not related to NX, angular, prettier, or other things that are provided by NX

### DO NOT UPDATE THESE LIBS

> Jest doesn't offer full support for ESM, so this is a big problem when running tests

There's a few libraries that we _CANNOT_ update because new versions are ESM which does not play well with TypeScript and the NX configuration.

- ansi-styles
- chalk
- case-anything
- json-stringify-pretty-compact
- nanoid
