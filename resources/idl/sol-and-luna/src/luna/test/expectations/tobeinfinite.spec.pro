;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

compile_opt idl2, hidden

l = luna()

  suite = l.suite('toBeInfinite')

    it = suite.test('passes for positive and negative infinity')
      (it.expects(!values.f_infinity)).toBeInfinite
      (it.expects(-!values.d_infinity)).toBeInfinite
      (it.expects([!values.f_infinity, -!values.f_infinity])).toBeInfinite

    it = suite.test('fails for NaN and finite numbers')
      (it.expects(!values.f_nan)).toBeInfinite, /_expect_failure
      (it.expects(1.0)).toBeInfinite, /_expect_failure
      (it.expects([!values.f_infinity, 1.0])).toBeInfinite, /_expect_failure

    it = suite.test('can be negated')
      (it.expects(1.0))._not_.toBeInfinite
      (it.expects(!values.f_infinity))._not_.toBeInfinite, /_expect_failure

l.generateTestSummary
end
