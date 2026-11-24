;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

compile_opt idl2, hidden

l = luna()

  suite = l.suite('toBeGreaterThanOrEqual')

    it = suite.test('passes when greater or equal')
      (it.expects(5)).toBeGreaterThanOrEqual, 4
      (it.expects(5)).toBeGreaterThanOrEqual, 5
      (it.expects(0.5)).toBeGreaterThanOrEqual, 0.5

    it = suite.test('fails when less')
      (it.expects(4)).toBeGreaterThanOrEqual, 5, /_expect_failure

    it = suite.test('requires every element of an array to pass')
      (it.expects([5, 6, 7])).toBeGreaterThanOrEqual, 5
      (it.expects([4, 6, 7])).toBeGreaterThanOrEqual, 5, /_expect_failure

    it = suite.test('can be negated')
      (it.expects(4))._not_.toBeGreaterThanOrEqual, 5
      (it.expects(5))._not_.toBeGreaterThanOrEqual, 5, /_expect_failure

l.generateTestSummary
end
