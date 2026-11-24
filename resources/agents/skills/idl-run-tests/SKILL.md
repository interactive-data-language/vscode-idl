---
name: idl-run-tests
description: Run IDL tests written with Sol and Luna and interpret the results. Use when a user asks to run, re-run or debug tests, run a single .spec.pro file, run the whole suite, or find out why a test failed.
---

# Running IDL tests

Prefer the IDL MCP tools over spawning `idl` from a shell. They manage the IDL session, return the captured output, and report whether the run succeeded. Tool names may be prefixed (for example `IDL-for-VSCode-`).

## Run one spec file

Use `run-idl-file` with the full path of the spec:

```
run-idl-file  uri: C:\path\to\repo\src\my_routine.spec.pro
```

- The spec is a main-level program (`l = luna()` ... `l.generateTestSummary`), so it runs as is.
- Output is the Luna report: `Test file:` header, suites, expectations, then `PASS`/`FAIL`, `Tests:` and `Time:`.
- The log `<name>.spec.pro.log` is written next to the spec, with the same output and code coverage at the bottom.

## Run the whole suite

Run the repository's runner (`run-tests.pro`, see `idl-test-setup`) with `run-idl-file`:

```
run-idl-file  uri: C:\path\to\repo\run-tests.pro
```

To filter or customize, use `run-idl-code`:

```idl
s = sol('C:\path\to\repo')
passed = s.runTests(filter = 'strings')
s.generateTestSummary
```

```
run-idl-code  code: <the IDL above>
```

Sol prints one line per spec file (`Processed file N of M in X.X s (path)`). Failures print `%FAILED%` with `Error:` and `Location:`, and errors such as syntax problems print `%ERROR%` without stopping the other files.

## Session tips

- New or renamed files are not seen by a running session. Use `control-idl-and-envi-session` with `restart-idl` after adding files, or if a previous run left IDL in a bad state.
- Sol and Luna's `src` folder must be on IDL's path. If routines are not found, check the IDL path, then restart IDL.
- Don't start ENVI unless the specs test ENVI tasks or ENVI API. They start it headless on their own.
- Long suites can take a minute or more. Run a single spec while iterating, and the whole suite once at the end.

## Investigating a failure

1. Read the `%FAILED%` block: the expectation, `Expected:`/`Received:`, the code snippet (`>` marks the line) and `at file:line`.
2. `get-idl-state` with `get-output` returns the raw captured output if the result was truncated. `get-errors` lists syntax errors by file.
3. `get-idl-state` with `get-coverage` and a `file` shows code coverage of a source file after a run.
4. Open the spec's `.spec.pro.log` for the full report and coverage analysis.
5. Fix the code or spec, then re-run just that spec file.

## Reporting back

Summarize: pass or fail, the `Tests:` line, and for each failure the spec file, test name, and expected versus received. Don't paste the whole log.
