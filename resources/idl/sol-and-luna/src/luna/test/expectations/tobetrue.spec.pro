;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

compile_opt idl2, hidden

l = luna()

  suite = l.suite('toBeTrue')

    it = suite.test('passes for true and fails for false')
      (it.expects(!true)).toBeTrue
      (it.expects(!false)).toBeTrue, /_expect_failure

    it = suite.test('can be negated')
      (it.expects(!false))._not_.toBeTrue
      (it.expects(!true))._not_.toBeTrue, /_expect_failure

    it = suite.test('raises an error for non scalar values')
      (it.expects(it.expects(findgen(10)))).toThrow, 'toBeTrue'

l.generateTestSummary
end
