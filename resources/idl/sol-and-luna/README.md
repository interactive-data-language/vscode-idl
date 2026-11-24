# Sol and Luna

Sol and Luna create a modern, easy-to-use, testing framework for IDL inspired by test frameworks from the JavaScript/TypeScript world. Sol is the orchestrator that executes tests written with Luna.

Through the use of these tools you can:

- Easily automate unit tests for ENVI, IDL, or ENVI + IDL with a simple pass/fail result

- Create tests that are self describing, i.e. test names say what the tests are doing, which makes them easy to read

- Automatically generate logs with a visual of what tests passed/failed and line numbers for where there were errors.

- Also generates metrics on your tests: code coverage and all of the statistics from IDL's profiler can be extracted with a single keyword/configuration option.

## Quick Start

If we have a procedure called `example` in `example.pro` defined as:

```idl
pro example
  print, 'Hello world!'
end
```

then we create a PRO file called `example.spec.pro` next to the routine which contains:

```idl
; compile opt is **required** for IDL to parse the code correctly
compile_opt idl2

; main level program (Luna can only be instantiated in a main level program)
l = luna(/profile)

  ;create a test suite
  s = l.suite('Sample test suite which has a few tests with' )

    ;create a test for our suite
    it = s.test('a test with expectations that pass')

      ;make sure our routine runs
      (it.expects('example')).toRunProcedure

; summarize our tests
l.generateTestSummary
end
```

And, when you **Compile + Run** the above code, you should see something like the following in your IDL console while it runs:

```
Sample test suite which has a few tests with
  a test with expectations that pass
Hello world!                                  --   what we were doing in our procedure!
--------------------------------------------------------
    expected to run procedure
```

And then the following in the IDL Console after it has finished (which will be quite fast):

```
--------------------------------------------------------
Test summary for 1 tests - PASSED

✔ Sample test suite which has a few tests with
  ✔ a test with expectations that pass
    ✔ expected to run procedure
```

If you then look in the folder where the `example.spec.pro` is located, you will find a file called `example.spec.pro.log` which contains some additional information on the tests that were executed:

```
--------------------------------------------------------
Test summary for 1 tests - PASSED
--------------------------------------------------------

✔ Sample test suite which has a few tests with
  ✔ a test with expectations that pass
    ✔ expected to run procedure

---------------------------
--------------------------------------------------------
Test analysis
--------------------------------------------------------
---------------------------

Overall code coverage (%) : 100.000
Lines executed            : 2
Lines not executed        : 0
Total lines               : 2

######################################################

C:\Users\Traininglead\Documents\github\Tools\idl-require\test\v1\example.pro

Overall code coverage (%) : 100.000
Lines executed            : 2
Lines not executed        : 0
Total lines               : 2

Routine       Coverage      Lines run     Total lines          Hits                 Time             Time/hit             Time+sub         Time+sub/hit
example         100.00              2               2
```

## List of Expectations

Here is a high level overview of the different expectations and what the generic expectation value/inputs are for each.

```idl
(it.expects(array)).toFindInArray, scalar
(it.expects(scalar)).toBeA, string
(it.expects(scalarObject)).toBeAValidObject
(it.expects(scalar)).toBeTrue
(it.expects(scalar)).toBeFalse
(it.expects(scalar)).toBeTypename, string
(it.expects(scalar)).toBeNull
(it.expects(arrayOrList)).toContain, value
(it.expects(string)).toContainString, string
(it.expects(string)).toMatchRegex, string
(it.expects(string)).toStartWith, prefix [, /is_function]
(it.expects(string)).toEndWith, suffix [, /is_function]
(it.expects(anything)).toHaveLength, length
(it.expects(array)).toHaveDimensions, dims
(it.expects(array)).toHaveSameDimensions, compare
(it.expects(stringOrContainer)).toBeEmpty
(it.expects(arrayOrContainer)).toContainEqual, value
(it.expects(arrayOrContainer)).toContainAll, values
(it.expects(arrayOrContainer)).toContainAny, values
(it.expects(hashOrDictionary)).toHaveKey, key
(it.expects(hashOrDictionary)).toHaveKeyValue, key, value
(it.expects(structure)).toHaveTag, name
(it.expects(arrayOrList)).toBeSorted [, /descending]
(it.expects(arrayOrList)).toHaveUniqueValues
(it.expects(object)).toHaveMethod, name
(it.expects(routineOrObject)).toThrow, [method,] args [, /IS_FUNCTION]
(it.expects(routineOrObject)).toThrowMessage, text, [method,] args [, /is_function]
(it.expects(routineOrObject)).toThrowMatching, regex, [method,] args [, /is_function]
(it.expects(routineOrObject)).toRunWithin, seconds, [method,] args [, /is_function]
(it.expects(routineOrObject)).toPrint, compare, [method,] args [, /is_function] [, /fold_case]
(it.expects(path)).toBeFile
(it.expects(path)).toBeDirectory
(it.expects(path)).toExist
(it.expects(scalar)).toEqual, scalar [, /fold_case]
(it.expects(anything)).toStrictEqual, value
(it.expects(object)).toBeSameObject, object
(it.expects(anything)).toBeTruthy
(it.expects(anything)).toBeFalsy
(it.expects(number)).toBeGreaterThan, n
(it.expects(number)).toBeGreaterThanOrEqual, n
(it.expects(number)).toBeLessThan, n
(it.expects(number)).toBeLessThanOrEqual, n
(it.expects(number)).toBeBetween, low, high [, /exclusive]
(it.expects(number)).toBeCloseTo, n [, tolerance=1e-6] [, /relative]
(it.expects(number)).toBeNaN
(it.expects(number)).toBeFinite
(it.expects(number)).toBeInfinite
(it.expects(anything)).toBeScalar
(it.expects(anything)).toBeArray
(it.expects(array)).toBeAnArrayOf, typeName
(it.expects(object)).toBeInstanceOf, type
(it.expects(string)).toBeAValidIDLTask
(it.expects(string)).toBeAValidENVITask
(it.expects(IDLTask)).toExecuteIDLTask
(it.expects(ENVITask)).toExecuteENVITask
(it.expects(string)).toRunFunction, arg1, ..., arg8, keywords = values
(it.expects(object)).toRunFunctionMethod, string, arg1, ..., arg8, keywords = values
(it.expects(string)).toRunProcedure, arg1, ..., arg8, keywords = values
(it.expects(object)).toRunProcedureMethod, string, arg1, ..., arg8, keywords = values
```

To negate **any** expectation, just use the `_not_` property of the expectation like this:

```idl
(it.expects(42))._not_.toBeNull
```

which then reads that `it expects 42 not to be null`.

## How does it work?

Writing and running your test takes no time at all!

Once you have added Sol and Luna to IDL's search path you simply need to do this following in a new file:

```idl
; main level program (Luna can only be instantiated in a main level program)
l = luna(/PROFILE)

  ;create a test suite
  s = l.suite('Sample test suite which has a few tests with' )

    ;create a test for our suite
    it = s.test('a test with expectations that pass')

      ;make sure we have a null value
      (it.expects(!NULL)).toBeNull

      ;match a substring
      (it.expects('string')).toContainString, 'ing'

    ;create another test
    it = s.test('a test with expectations that fail')

      ;run a test that fails
      (it.expects(42)).toBeNull

; summarize our tests
l.generateTestSummary
end
```

and while this code is running, you should see something like the following in the IDL console just as a basis for progress:

```
Sample test suite which has a few tests with
  expectations that pass
    expected to be null
    expected to contain string

  an expectation that fails
    %FAILED% : expected to be null (Failed on line: 20)
```

## Running tests with Sol

Sol finds the test files in a folder (using `idltest.json` when present), runs each one in a clean IDL process, and summarizes the results:

```idl
s = sol('C:\path\to\directory')

;run everything, returns true if all tests passed
passed = s.RunTests()

;only run specs with "strings" in their path (glob patterns also work)
passed = s.RunTests(filter = 'strings')

;run a single test file and get its result
result = s.RunFile('C:\path\to\package\src\example.spec.pro')
print, result.status, result.nTests, result.nFailed

;write a machine readable report (JUnit XML when the file ends in .xml)
s.WriteReport, 'results.json'
s.WriteReport, 'results.xml'
```

`RunTests` and `RunFile` return a `sol_result` object per test file with these properties:

| Property            | Description                            |
| ------------------- | -------------------------------------- |
| `file`              | Test file that was run                 |
| `status`            | `passed`, `failed`, or `error`         |
| `passed`            | True if the file passed                |
| `nTests`, `nFailed` | Number of tests and failures           |
| `duration`          | Run time in seconds                    |
| `message`           | Error message when `status` is `error` |

An error in one test file (for example a syntax error) is recorded as an `error` result and does not stop the remaining files. `s.results` holds all results keyed by file path, and `result.ToHash()` converts a result to a hash.

Other useful options are `TEST_FILES` and `TEST_SOURCE` on `sol()` to specify files directly instead of searching, and `NO_RESTART` on `RunTests` to reuse one IDL process.

## Configuration

Sol and Luna are configured with an optional `idltest.json` file. The file is only ever read, never written, and every option is optional. Paths and patterns are relative to the folder with the file and support `*`, `?`, and `**`. These are the options and their defaults:

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

- `include`/`exclude`: test files to run.
- `source.include`/`source.exclude`: code that Luna checks for syntax errors and code coverage. If no source is found, the routine is inferred from the name of the test file.
- `run.isolation`: `process` uses a new IDL process for each test file, `shared` reuses one.
- `run.stopOnFailure`: stop after the first failing test file.
- `coverage.enabled`/`coverage.profile`: track code coverage and optionally use IDL's profiler.
- `output.level`: `quiet`, `normal`, or `verbose`. `output.log` is the summary file written by Sol.
- `debug`: stop on errors and keep the child process output in `sol.log` and `luna.log` next to the file.

Use `luna(CONFIG_FILE = './idltest.json')` in a test, or let `luna()` find the closest `idltest.json` automatically.

## Helpful Hints

- Sol and Luna have **no** way to directly test widgets and ensure that they work correctly.

- **ENVI should only be started headlessly when writing tests that require ENVI's tools/functionality**

- If creating objects with tests, make sure to use `obj_new` instead of calling the function directly because of the way that the routines are resolved. Here is an example:

```idl
;correct way
(it.expects('obj_new')).toRunFunction, 'sol_config', file

;incorrect way - throws and error
(it.expects('sol_config')).toRunFunction, file
```

- Calling functions, procedures, function methods, or procedure methods for system (IDL/ENVI internal) routines does not check how many arguments or keyword are provided. This is a limitation of `idl routine_info()`.

- When handling **any** error in your code, if you decide to ignore the error and move on, **YOU MUST** use `idl message, /reset` in your catch blocks like the example below. Otherwise the error messages bubble up when using the IDL-IDLBridge to run the tests because there is an error in the state, even though the error was "handled".

```idl
;handle errors and return
catch,err
if (err ne 0) then begin
  catch, /CANCEL
  message, /RESET
  return, 0
endif
```

- If your routines use IDL's `idl scope_level()` function, then you will need to call them directly in your tests. This is because routines or methods are called from within `expectation__define` which has a different scope compared to the main level program that is where the tests are written.

## Troubleshooting

Make sure to check the log files as they contain all the information, including a full traceback to errors for easier debugging. In addition to this, these routines use the IDL_IDLBridge to spawn processes and run them in a clean environment. This works great for most cases, but there are some occasional issues with "error" messages being raised that are not really error messages. In this case, make an issue on GitHub and we will take a closer look and handling those exceptions.
