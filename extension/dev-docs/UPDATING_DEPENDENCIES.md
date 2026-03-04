# Updating Dependencies

Document that walks through the func, exciting process of updating dependencies!

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

7.Do a sanity check that everything builds correctly with `npm start`

8. Verify no horrible breaking changes for Angular applications

- Open the IDL and ENVI hello world notebooks and run all cells and verify embedded cells look right

- Start a session of IDL and start/stop the profiler

- Change from light to dark theme to verify that theme changes are picked up

9. Commit all changes to GitHub as a checkpoint

10. If you need to migrate to a major version of NX, repeat steps

> CRITICAL: Recommended path is to migrate to latest minor version you have before updating major versions
>
> You can also do something like 21 => latest 21.X => 22.0 => latest 22.X
>
> Sometimes you have to jump right to latest 22.X version because there's usually some issue with brand new versions

## Migrating Libraries

Anything not auto-managed by NX, we also need to try to update to resolve vulnerabilities and more.

### Process

See list below of libs to skip

1. Run `npm outdated` to see all deps

2. Pick one that is not related to NX, angular, prettier, or other things that are provided by NX

### DO NOT UPDATE THESE LIBS

> SCRATCH THIS - You can update these, but there is a cost.
>
> We use commonjs for our VSCode extension compile targets. When we do this, we can't
> strictly check imports from ESM libraries. You will see errors in the editor, but
> not at compile time.
>
> For active dev, this isn't an issue, but for upgrading ESM libraries to newer APIs, we need
> to be most stringent and thoroughly check.

There's a few libraries that we _CANNOT_ update because new versions are ESM which does not play well with TypeScript and the NX configuration.

- chalk
- case-anything
- json-stringify-pretty-compact
- nanoid
