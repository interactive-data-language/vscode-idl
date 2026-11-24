;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

compile_opt idl2, hidden

l = luna()

  suite = l.suite('toContain')

    it = suite.test('checks list elements')
      (it.expects(list(0, 1, 2, 3, 4))).toContain, 1
      (it.expects(list(0, 1, 2, 3, 4))).toContain, 5, /_expect_failure

    it = suite.test('checks array elements')
      (it.expects(findgen(5))).toContain, 1
      (it.expects(findgen(5))).toContain, 5, /_expect_failure

    it = suite.test('checks container keys and items')
      (it.expects(list(1, 2, 42))).toContain, 42
      (it.expects(hash('42', 42))).toContain, '42'
      (it.expects(orderedhash('42', 42))).toContain, '42'
      (it.expects(dictionary('fortyTwo', 42))).toContain, 'fortyTwo'

    it = suite.test('can be negated')
      (it.expects(list(0, 1, 2, 3, 4)))._not_.toContain, 5
      (it.expects(list(0, 1, 2, 3, 4)))._not_.toContain, 1, /_expect_failure
      (it.expects(findgen(5)))._not_.toContain, 5
      (it.expects(findgen(5)))._not_.toContain, 1, /_expect_failure

l.generateTestSummary
end
