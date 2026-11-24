---
name: idl-test-setup
description: Set up a repository so it can write and run IDL tests with Sol and Luna. Use when a user wants to start testing IDL or ENVI code, add an idltest.json, create a test runner, or get code coverage and logs working.
---

# Setting up a repository for IDL tests

Luna is the test framework (`luna()`), Sol is the runner (`sol()`). Both are IDL code, so the folder containing them must be on IDL's path.

## Steps

1. **Put Sol and Luna on IDL's path.** Add the `src` folder of the sol-and-luna repo (or the installed package) to `IDL_PATH` or the workspace's IDL path settings. Check that `luna()` and `sol()` compile.

2. **Choose a test layout.** Spec files end in `.spec.pro` and live next to the code or in a `test` folder:

   ```
   my-repo/
     idltest.json
     run-tests.pro
     src/
       my_routine.pro
       my_routine.spec.pro
   ```

   Use one spec file per routine or per expectation group. Each spec file is a main-level program, so it can't define routines.

3. **Create `idltest.json` at the repository root.** Every option is optional. The file is only read, never written. Paths are relative to the file and support `*`, `?` and `**`.

   ```json
   {
     "include": ["src/**/*.spec.pro"],
     "exclude": [],
     "source": {
       "include": ["src/**/*.pro"],
       "exclude": ["src/**/*.spec.pro"]
     },
     "run": { "isolation": "process", "stopOnFailure": false },
     "coverage": { "enabled": true, "profile": false },
     "output": { "level": "normal", "log": "idltest.log" },
     "debug": false
   }
   ```

   - `include`/`exclude`: which spec files Sol runs.
   - `source.include`/`source.exclude`: code that Luna checks for syntax errors and code coverage. Exclude the spec files.
   - `run.isolation`: `process` runs each spec in a clean IDL process, `shared` reuses one.
   - `coverage.profile`: also collect IDL profiler statistics.
   - `debug`: stop on errors and keep child process output in `sol.log` and `luna.log`.
   - There is no `idl.package.json` fallback. `idltest.json` is the only configuration file.

4. **Create `run-tests.pro` next to `idltest.json`:**

   ```idl
   compile_opt idl2

   s = sol()
   status = s.runTests()
   s.generateTestSummary

   end
   ```

   Run it with Compile + Run in IDL for VSCode, or from a shell with an absolute path:

   ```
   idl -e ".run C:\path\to\run-tests.pro"
   ```

   Set `IDL_PATH` (for example `+C:\path\to\src;<IDL_DEFAULT>`) so the child processes find your code. Restart IDL after adding new files.

5. **Add a first spec**, then run everything. See the `idl-write-tests` skill for how to write it.

6. **Ignore generated files.** Add these to `.gitignore`:
   ```
   *.spec.pro.log
   idltest.log
   sol.log
   luna.log
   ```

## Running tests with Sol

```idl
s = sol('C:\path\to\repo')                        ; only specify repo path if not next to idltest.json
passed = s.runTests()
passed = s.runTests(filter = 'strings')           ; only specs with "strings" in the path
result = s.runFile('C:\path\to\a.spec.pro')       ; one file
s.writeReport, 'results.xml'                      ; JUnit XML, or .json
```

- A passing file prints one line: `Processed file N of M in X.X s (relative/path.spec.pro)`.
- A failing file prints `%FAILED% processing file N of M (path)`, then `Error:` and `Location:` blocks.
- An error in one file (for example a syntax error) is recorded as `%ERROR%` and doesn't stop the remaining files.
- Paths are shown relative to the folder with `idltest.json`.
- `no_restart` on `runTests` reuses one IDL process. `test_files` and `test_source` on `sol()` skip searching.

## Configuration detection

`luna()` finds the closest `idltest.json` automatically: it walks the spec file's folder and each parent, closest first, and falls back to defaults if none is found. Use `luna(config_file = 'path\idltest.json')` to override. There is no `in_package` keyword.

## Things to know

- Luna can only be created in a main-level program.
- Only start ENVI (headless) in specs that test ENVI tasks.
- Sol and Luna can't test widgets directly.
- Each spec also writes `<name>.spec.pro.log` next to the spec: the same output as the console, then the code coverage analysis at the bottom.
- Check the logs first when something fails. They include the full traceback.
