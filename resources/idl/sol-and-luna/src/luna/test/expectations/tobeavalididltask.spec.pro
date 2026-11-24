;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

compile_opt idl2, hidden

l = luna()

  suite = l.suite('toBeAValidIDLTask')

    it = suite.test('passes for an IDL task')
      (it.expects('addition_example')).toBeAValidIDLTask

    it = suite.test('can be negated')
      (it.expects('addition_example'))._not_.toBeAValidIDLTask, /_expect_failure

l.generateTestSummary
end
