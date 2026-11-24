;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

compile_opt idl2, hidden

l = luna()

  suite = l.suite('toBeFinite')

    it = suite.test('passes for finite numbers')
      (it.expects(1.0)).toBeFinite
      (it.expects(5)).toBeFinite
      (it.expects([1.0, 2.0])).toBeFinite

    it = suite.test('fails for NaN and infinity')
      (it.expects(!values.f_nan)).toBeFinite, /_expect_failure
      (it.expects(!values.f_infinity)).toBeFinite, /_expect_failure
      (it.expects(-!values.f_infinity)).toBeFinite, /_expect_failure
      (it.expects([1.0, !values.f_nan])).toBeFinite, /_expect_failure

    it = suite.test('can be negated')
      (it.expects(!values.f_infinity))._not_.toBeFinite
      (it.expects(1.0))._not_.toBeFinite, /_expect_failure

l.generateTestSummary
end
