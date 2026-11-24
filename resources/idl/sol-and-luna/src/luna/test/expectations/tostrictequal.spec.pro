;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

compile_opt idl2, hidden

l = luna()

  suite = l.suite('toStrictEqual')

    it = suite.test('passes for the same type and value')
      (it.expects(1b)).toStrictEqual, 1b
      (it.expects(5)).toStrictEqual, 5
      (it.expects('text')).toStrictEqual, 'text'
      (it.expects([1, 2, 3])).toStrictEqual, [1, 2, 3]
      (it.expects([[1, 2], [3, 4]])).toStrictEqual, [[1, 2], [3, 4]]
      (it.expects({a: 1, b: 'x'})).toStrictEqual, {a: 1, b: 'x'}

    it = suite.test('fails for different types')
      (it.expects(1b)).toStrictEqual, 1, /_expect_failure
      (it.expects(1)).toStrictEqual, 1.0, /_expect_failure
      (it.expects('1')).toStrictEqual, 1, /_expect_failure
      (it.expects([1, 2])).toStrictEqual, [1.0, 2.0], /_expect_failure

    it = suite.test('fails for different values or dimensions')
      (it.expects(5)).toStrictEqual, 6, /_expect_failure
      (it.expects(1)).toStrictEqual, [1], /_expect_failure
      (it.expects([[1, 2], [3, 4]])).toStrictEqual, [1, 2, 3, 4], /_expect_failure
      (it.expects({a: 1})).toStrictEqual, {b: 1}, /_expect_failure
      (it.expects({a: 1})).toStrictEqual, {a: 2}, /_expect_failure

    it = suite.test('compares lists, hashes, and nested containers')
      (it.expects(list(1, 2))).toStrictEqual, list(1, 2)
      (it.expects(list(1, 2))).toStrictEqual, list(1, 3), /_expect_failure
      (it.expects(list(1, 2))).toStrictEqual, list(1, 2, 3), /_expect_failure
      (it.expects(list(1, 2))).toStrictEqual, [1, 2], /_expect_failure
      (it.expects(hash('a', 1))).toStrictEqual, hash('a', 1)
      (it.expects(hash('a', 1))).toStrictEqual, hash('a', 1b), /_expect_failure
      (it.expects(hash('a', 1))).toStrictEqual, hash('b', 1), /_expect_failure
      (it.expects(hash('a', 1))).toStrictEqual, dictionary('a', 1), /_expect_failure
      (it.expects(hash('a', list(1, hash('b', 2))))).toStrictEqual, hash('a', list(1, hash('b', 2)))
      (it.expects(hash('a', list(1, hash('b', 2))))).toStrictEqual, hash('a', list(1, hash('b', 3))), /_expect_failure

    it = suite.test('can be negated')
      (it.expects(1b))._not_.toStrictEqual, 1
      (it.expects(1b))._not_.toStrictEqual, 1b, /_expect_failure

    it = suite.test('is stricter than toEqual')
      (it.expects(1b)).toEqual, 1
      (it.expects(1b))._not_.toStrictEqual, 1

l.generateTestSummary
end
