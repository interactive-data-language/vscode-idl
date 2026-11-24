;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

compile_opt idl2, hidden

l = luna()

  suite = l.suite('toBeArray')

    it = suite.test('passes for arrays')
      (it.expects([1, 2, 3])).toBeArray
      (it.expects(['a'])).toBeArray
      (it.expects(findgen(3, 4))).toBeArray
      (it.expects(replicate({a: 1}, 3))).toBeArray

    it = suite.test('fails for scalars')
      (it.expects(42)).toBeArray, /_expect_failure
      (it.expects('text')).toBeArray, /_expect_failure
      (it.expects(list(1, 2))).toBeArray, /_expect_failure
      (it.expects({a: 1})).toBeArray, /_expect_failure

    it = suite.test('can be negated')
      (it.expects(42))._not_.toBeArray
      (it.expects([1, 2]))._not_.toBeArray, /_expect_failure

l.generateTestSummary
end
