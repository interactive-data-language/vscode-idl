;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

compile_opt idl2, hidden

l = luna()

  suite = l.suite('toBeLessThan')

    it = suite.test('passes when less')
      (it.expects(3)).toBeLessThan, 4
      (it.expects(-0.5)).toBeLessThan, 0

    it = suite.test('fails when equal or greater')
      (it.expects(4)).toBeLessThan, 4, /_expect_failure
      (it.expects(5)).toBeLessThan, 4, /_expect_failure

    it = suite.test('requires every element of an array to pass')
      (it.expects([1, 2, 3])).toBeLessThan, 4
      (it.expects([1, 2, 4])).toBeLessThan, 4, /_expect_failure

    it = suite.test('can be negated')
      (it.expects(4))._not_.toBeLessThan, 4
      (it.expects(3))._not_.toBeLessThan, 4, /_expect_failure

l.generateTestSummary
end
