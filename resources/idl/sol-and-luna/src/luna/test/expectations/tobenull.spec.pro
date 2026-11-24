;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

compile_opt idl2, hidden

l = luna()

  suite = l.suite('toBeNull')

    it = suite.test('passes when there is no value')
      (it.expects()).toBeNull
      (it.expects(!null)).toBeNull

    it = suite.test('fails when there is a value')
      (it.expects(5)).toBeNull, /_expect_failure
      (it.expects('')).toBeNull, /_expect_failure
      (it.expects(0)).toBeNull, /_expect_failure

    it = suite.test('can be negated')
      (it.expects(5))._not_.toBeNull
      (it.expects())._not_.toBeNull, /_expect_failure

l.generateTestSummary
end
