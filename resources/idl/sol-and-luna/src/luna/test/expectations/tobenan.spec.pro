;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

compile_opt idl2, hidden

l = luna()

  suite = l.suite('toBeNaN')

    it = suite.test('passes for NaN')
      (it.expects(!values.f_nan)).toBeNaN
      (it.expects(!values.d_nan)).toBeNaN
      (it.expects([!values.f_nan, !values.f_nan])).toBeNaN

    it = suite.test('fails for other numbers')
      (it.expects(1.0)).toBeNaN, /_expect_failure
      (it.expects(!values.f_infinity)).toBeNaN, /_expect_failure
      (it.expects([!values.f_nan, 1.0])).toBeNaN, /_expect_failure
      (it.expects(5)).toBeNaN, /_expect_failure

    it = suite.test('can be negated')
      (it.expects(1.0))._not_.toBeNaN
      (it.expects(!values.f_nan))._not_.toBeNaN, /_expect_failure

l.generateTestSummary
end
