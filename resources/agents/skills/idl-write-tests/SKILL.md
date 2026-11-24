---
name: idl-write-tests
description: Write IDL tests with Luna's Jest-style expect() API and read their output. Use when a user asks to write, extend or debug a .spec.pro file, choose an expectation, test errors or printed output, or understand Luna failure messages.
---

# Writing IDL tests with Luna

Setup (path, `idltest.json`, runner) is covered by the `idl-test-setup` skill. This skill covers the spec file itself.

## Spec file structure

A spec is a main-level program named `<name>.spec.pro`:

```idl
compile_opt idl2

l = luna()

  s = l.suite('toBeA')

    it = s.test('matches all of the specified types')
      (it.expects(fltarr(5))).toBeA, ['array', 'float']
      (it.expects(42))._not_.toBeA, 'string'

    it = s.test('can run a routine')
      (it.expects('my_routine')).toRunProcedure, 5

l.generateTestSummary
end
```

- `l = luna()` must be in a main-level program. It auto-detects the closest `idltest.json`.
- One suite groups related tests. One `it` is a test. A test has one or more expectations.
- `compile_opt idl2` is required. Always end with `l.generateTestSummary` and `end`.
- Name a test for what it checks: "can be negated", "throws on bad input".
- Keep each spec focused. One spec file per routine or per expectation is fine.

## Using expectations

`(it.expects(value)).matcher, args`. Negate any matcher with `_not_`: `(it.expects(42))._not_.toBeNull`.

If you need the expectation in a variable first, assign it, then call the matcher:

```idl
e = it.expects(1B)
e.toBeA, 'byte'
```

Assign `it.expects(x)._not_` to a variable before using it as an argument.

### Choosing a matcher

| You want to check           | Use                                                                                                                                                                                                  |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Equality                    | `toEqual` (`/fold_case` for strings), `toStrictEqual` (type, shape and values)                                                                                                                       |
| Truth                       | `toBeTrue`, `toBeFalse`, `toBeTruthy`, `toBeFalsy`, `toBeNull`                                                                                                                                       |
| Numbers                     | `toBeGreaterThan`, `toBeGreaterThanOrEqual`, `toBeLessThan`, `toBeLessThanOrEqual`, `toBeBetween` (`/exclusive`), `toBeCloseTo` (`tolerance=`, `/relative`), `toBeNaN`, `toBeFinite`, `toBeInfinite` |
| Types                       | `toBeA`, `toBeTypename`, `toBeInstanceOf`, `toBeAnArrayOf`, `toBeScalar`, `toBeArray`, `toBeAValidObject`, `toBeSameObject`                                                                          |
| Strings                     | `toContainString`, `toMatchRegex`, `toStartWith`, `toEndWith`                                                                                                                                        |
| Arrays and lists            | `toContain`, `toContainEqual`, `toContainAll`, `toContainAny`, `toFindInArray`, `toBeSorted` (`/descending`), `toHaveUniqueValues`, `toBeEmpty`                                                      |
| Size                        | `toHaveLength`, `toHaveDimensions`, `toHaveSameDimensions`                                                                                                                                           |
| Hashes, structures, objects | `toHaveKey`, `toHaveKeyValue`, `toHaveTag`, `toHaveMethod`                                                                                                                                           |
| Files                       | `toBeFile`, `toBeDirectory`, `toExist`                                                                                                                                                               |
| Running code                | `toRunProcedure`, `toRunFunction`, `toRunProcedureMethod`, `toRunFunctionMethod`                                                                                                                     |
| Errors, speed and output    | `toThrow`, `toThrowMessage`, `toThrowMatching`, `toRunWithin`, `toPrint`                                                                                                                             |
| ENVI and IDL tasks          | `toBeAValidENVITask`, `toBeAValidIDLTask`, `toExecuteENVITask`, `toExecuteIDLTask`                                                                                                                   |

### Testing routines

```idl
(it.expects('my_routine')).toThrow, bad_input                  ; procedure by default
(it.expects('my_function')).toThrow, bad_input, /is_function   ; use /IS_FUNCTION for functions
(it.expects('my_routine')).toThrowMessage, 'must be positive', -1
(it.expects('my_routine')).toRunWithin, 2.0, big_input
(it.expects('my_routine')).toPrint, 'Hello', /fold_case
(it.expects(obj)).toThrow, 'method', arg1                      ; objects take the method name first
```

- `toThrow*`, `toRunWithin` and `toPrint` default to a procedure. Add `/is_function` for functions. Don't name a keyword `function`, it is an IDL reserved word.
- Pass arguments straight after the matcher inputs (`arg1` to `arg9`). Extra keywords pass through to the routine.
- Create objects with `obj_new`, not by calling the class function directly: `(it.expects('obj_new')).toRunFunction, 'my_class', arg`.
- If your code uses `scope_level()`, call it directly in the test instead. Routines run from inside the expectation code, which has a different scope.
- If your code handles an error and moves on, it must call `message, /reset` in its catch block. Otherwise errors bubble up through the IDL-IDLBridge.

### Finding more expectations

To find all matchers, use the MCP tool `search-for-routine` to query IDL's known routines with these tool parameters:

```json
{
  "routines": [
    {
      "name": "Expectation::to",
      "type": "ProcedureMethod"
    }
  ],
  "limit": 100
}
```

## Reading the output

Luna prints as the tests run. IDL can't rewrite earlier lines, so lines appear in order and the result comes in the final summary:

```
Test file: src/example.spec.pro

toBeA
  can be negated
    expected not to be types byte, and string (0.00 s, line 16)

    %FAILED% expected to be type string (0.01 s)

      Expected: to be type string
      Received: byte

        3 | it = s.test('can be negated')
        4 |   e = it.expects(1B)
      > 5 |     e.toBeA, 'string'
        6 |   e = it.expects(1B)
        7 |     e.toBeA, 'string'

      at C:\repo\src\example.spec.pro:5

FAIL
Tests:   1 failed, 1 passed, 2 total
Time:    0.2 s
```

- The `Test file:` header shows a path relative to the `idltest.json` folder, or the full path if there is none.
- Passing lines show `(time, line N)`. The time runs from the previous expectation (or the start of the test), so it includes any setup. `, overridden` is added for `/_expect_failure`.
- A failure shows `%FAILED%`, optional `Expected:` and `Received:` lines, up to two lines of code on each side with `>` on the failing line, and `at file:line`.
- `Tests:` counts one per `it` block. A test fails if any of its expectations fail.
- The log (`<name>.spec.pro.log`) has the same output, then the code coverage analysis at the bottom.

## Running one spec while writing it

Compile + Run the spec file in IDL for VSCode. Add `/debug` to `luna()` to stop on errors, or set `debug` in `idltest.json`. Use `l = luna(/no_log)` to skip writing a log file.

## Checklist before you finish

- Each test name says what the behavior is.
- Error paths are covered (`toThrow`, `toThrowMessage`) as well as happy paths.
- `_not_` is used instead of testing the opposite with `toBeFalse`.
- No temporary files left behind, and no ENVI start-up unless an ENVI task is being tested.
- The spec runs by itself and through `sol().runTests()`.
