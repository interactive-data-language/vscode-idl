;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

compile_opt idl2, hidden

; lets test this!
l = luna(config_file = './idltest.json')

  ; create a new suite of tests
  suite = l.suite('Test suite for the to make sure Sol works')

    ; create a new test for our suite
    it = suite.test('runs a dummy test for kicks')

      (it.expects(!true)).toBeTrue

; generate a nice summary to visualize
l.generateTestSummary
end
