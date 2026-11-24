;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

compile_opt idl2, hidden

l = luna()

  suite = l.suite('toBeLessThanOrEqual')

    it = suite.test('passes when less or equal')
      (it.expects(3)).toBeLessThanOrEqual, 4
      (it.expects(4)).toBeLessThanOrEqual, 4

    it = suite.test('fails when greater')
      (it.expects(5)).toBeLessThanOrEqual, 4, /_expect_failure

    it = suite.test('requires every element of an array to pass')
      (it.expects([1, 2, 4])).toBeLessThanOrEqual, 4
      (it.expects([1, 2, 5])).toBeLessThanOrEqual, 4, /_expect_failure

    it = suite.test('can be negated')
      (it.expects(5))._not_.toBeLessThanOrEqual, 4
      (it.expects(4))._not_.toBeLessThanOrEqual, 4, /_expect_failure

l.generateTestSummary
end
