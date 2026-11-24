---
name: idl-init-package
description: 'Guide for initializing a new IDL package or project folder by creating the idlpackage.json, idlformat.json, and idltest.json configuration files. Use when a user wants to start a new IDL library, set up package metadata, code formatting, or test configuration.'
---

Your goal is to initialize an IDL package folder by creating three configuration files at the root of the folder. Be clear and concise.

Never overwrite a file that already exists. If one exists, tell the user and offer to edit it instead.

If the user has the IDL for VS Code extension, they can also create each file with these commands, which prompt for the workspace folder:

- `IDL: Initialize Package Config` (`idlpackage.json`)
- `IDL: Initialize Formatting Config` (`idlformat.json`)
- `IDL: Initialize Test Config` (`idltest.json`)

## Steps

1. Confirm the folder to initialize and the package name (default to the folder name).
2. Create `idlpackage.json`, `idlformat.json`, and `idltest.json` at the folder root using the templates below.
3. Create a `src` folder for code. Test files go in `src` and are named `*.spec.pro` so the default `idltest.json` finds them.
4. Create `run-tests.pro` next to `idltest.json` (see below).
5. Add test output to `.gitignore` (create it if missing):

   ```
   *spec.pro.log
   *idl.test.log
   *idltest.log
   ```

6. Summarize the files created. To add tests next, use the `idl-test-setup` skill (it covers `idltest.json` in more detail).

## idlpackage.json

Describes the package for the IDL Package Manager (IPM).

```json
{
  "name": "MyPackage",
  "version": "1.0.0",
  "author": "",
  "description": "",
  "dependencies": []
}
```

- `name`: package name. Defaults to the folder name.
- `version`: semantic version, starting at `1.0.0`.
- `dependencies`: array of `{ "name": "...", "version": "...", "url": "..." }`. Versions support ranges such as `>=1.2 <1.6`, `^1.2.3` and `~1.2.3`.

## idlformat.json

Controls how the extension formats and styles IDL code for the folder (`tabWidth`, `style`, `autoFix`, `autoDoc`, `styleAndFormat`). Any property that is not set uses the extension defaults, so start small and add only what the user wants to change:

The `idlformat.json` values below are user style settings and take precedence over the lowercase defaults in the IDL instructions.

```json
{
  "tabWidth": 2,
  "style": {
    "quotes": "single",
    "methods": "dot",
    "keywords": "lower",
    "properties": "match",
    "control": "lower",
    "numbers": "lower",
    "hex": "lower",
    "octal": "lower",
    "binary": "lower",
    "routines": "match",
    "routineMethods": "camel",
    "structureNames": "pascal",
    "systemVariables": "lower",
    "localVariables": "match"
  },
  "autoFix": true,
  "autoDoc": true,
  "styleAndFormat": true
}
```

The older name `idl.json` is still read, but `idlformat.json` takes precedence and should be used for new projects.

## idltest.json

Configures how tests are found and run.

```json
{
  "include": ["src/**/*.spec.pro"],
  "exclude": [],
  "source": { "include": ["src/**/*.pro"], "exclude": ["**/*.spec.pro"] },
  "run": { "isolation": "process", "stopOnFailure": false },
  "coverage": { "enabled": true, "profile": false },
  "output": { "level": "normal", "log": "idltest.log" },
  "debug": false
}
```

- `include`/`exclude`: globs for the test files to run.
- `source.include`/`source.exclude`: globs for code measured by coverage.
- `run.isolation`: `process` (separate IDL process per test) or `shared` (one IDL session).
- `run.stopOnFailure`: stop after the first failing test.
- `coverage.enabled`/`coverage.profile`: collect coverage or profile code while testing.
- `output.level`: `quiet`, `normal`, or `verbose`. `output.log` is the log file path.
- `debug`: enable debug output from the test runner.

## run-tests.pro

A small main-level program next to `idltest.json` that runs every test.

```idl
compile_opt idl2

; create test class - next to idltest.json
s = sol()

; run all tests
status = s.runTests()

; write summary to disk
s.generateTestSummary

end
```
