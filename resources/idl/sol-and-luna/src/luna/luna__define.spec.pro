;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

;+
;-
pro luna_pre_execute_example
  compile_opt idl2, hidden
  print, 'It ran be before creating a test!'
end

compile_opt idl2, hidden

; lets test this!
l = luna()

  ; create a new suite of tests
  suite = l.suite('Test suite for the Luna tester')

    ; make sure that other methods work on the luna objects
    childSuite = suite.suite('Test suite that')

    ; create a test
    it = childSuite.test('verifies miscellaneous object methods work as expected')

      ; create a dummy expectation
      e = it.expects()

        ; get original value for pass/fai
        flag = l.passed

        ; set failure and then passing
        e._failed
        e._passed

        ; check if we need to set to failure since we are changing it
        if ~flag then begin
          l._failed
        endif

    it = childSuite.test('finds the closest idltest.json from a folder or its parents')
      here = file_dirname(l.file)
      root = file_dirname(file_dirname(here))
      (it.expects(l._findConfigDir(here))).toEqual, root
      (it.expects(l._findConfigDir(root))).toEqual, root
      (it.expects(l._findConfigDir(here + path_sep() + 'does_not_exist'))).toEqual, root
      (it.expects(l._findConfigDir(file_dirname(root)))).toEqual, ''

    it = childSuite.test('times each expectation from the previous one')
      first = it._lap()
      wait, 0.05
      second = it._lap()
      (it.expects(first)).toBeGreaterThanOrEqual, 0
      (it.expects(second)).toBeGreaterThanOrEqual, 0.05
      (it.expects(second)).toBeLessThan, 5

; generate a nice summary to visualize
l.generateTestSummary
end
