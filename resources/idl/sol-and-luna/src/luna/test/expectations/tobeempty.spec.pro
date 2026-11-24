;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

compile_opt idl2, hidden

l = luna()

  suite = l.suite('toBeEmpty')

    it = suite.test('passes for empty strings')
      (it.expects('')).toBeEmpty
      (it.expects(['', ''])).toBeEmpty

    it = suite.test('passes for empty containers')
      (it.expects(list())).toBeEmpty
      (it.expects(hash())).toBeEmpty
      (it.expects(orderedhash())).toBeEmpty
      (it.expects(dictionary())).toBeEmpty

    it = suite.test('fails for values with content')
      (it.expects('a')).toBeEmpty, /_expect_failure
      (it.expects(['', 'a'])).toBeEmpty, /_expect_failure
      (it.expects(list(1))).toBeEmpty, /_expect_failure
      (it.expects(hash('a', 1))).toBeEmpty, /_expect_failure
      (it.expects(0)).toBeEmpty, /_expect_failure
      (it.expects(findgen(3))).toBeEmpty, /_expect_failure

    it = suite.test('can be negated')
      (it.expects(list(1)))._not_.toBeEmpty
      (it.expects(list()))._not_.toBeEmpty, /_expect_failure
      (it.expects(''))._not_.toBeEmpty, /_expect_failure
      (it.expects(list()))._not_.toHaveLength, 1

l.generateTestSummary
end
