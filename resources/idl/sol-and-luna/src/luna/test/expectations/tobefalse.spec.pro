;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

compile_opt idl2, hidden

l = luna()

  suite = l.suite('toBeFalse')

    it = suite.test('passes for false and fails for true')
      (it.expects(!false)).toBeFalse
      (it.expects(!true)).toBeFalse, /_expect_failure

    it = suite.test('can be negated')
      (it.expects(!true))._not_.toBeFalse
      (it.expects(!false))._not_.toBeFalse, /_expect_failure

    it = suite.test('raises an error for non scalar values')
      (it.expects(it.expects(findgen(10)))).toThrow, 'toBeFalse'

l.generateTestSummary
end
