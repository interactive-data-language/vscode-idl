;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

compile_opt idl2, hidden

l = luna()

  suite = l.suite('toBeScalar')

    it = suite.test('passes for scalars')
      (it.expects(42)).toBeScalar
      (it.expects('text')).toBeScalar
      (it.expects(1.5d)).toBeScalar
      (it.expects(list(1, 2))).toBeScalar
      (it.expects({a: 1})).toBeScalar

    it = suite.test('fails for arrays')
      (it.expects([1, 2])).toBeScalar, /_expect_failure
      (it.expects(['a'])).toBeScalar, /_expect_failure
      (it.expects(replicate({a: 1}, 3))).toBeScalar, /_expect_failure

    it = suite.test('can be negated')
      (it.expects([1, 2]))._not_.toBeScalar
      (it.expects(42))._not_.toBeScalar, /_expect_failure

l.generateTestSummary
end
