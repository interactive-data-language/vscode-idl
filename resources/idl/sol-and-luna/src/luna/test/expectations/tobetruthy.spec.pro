;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

compile_opt idl2, hidden

l = luna()

  suite = l.suite('toBeTruthy')

    it = suite.test('passes for truthy values')
      (it.expects('text')).toBeTruthy
      (it.expects(1)).toBeTruthy
      (it.expects(2)).toBeTruthy
      (it.expects(-1.5)).toBeTruthy
      (it.expects([0, 0])).toBeTruthy
      (it.expects({a: 1})).toBeTruthy
      (it.expects(list(0))).toBeTruthy
      (it.expects(hash('a', 0))).toBeTruthy
      (it.expects(ptr_new(0))).toBeTruthy

    it = suite.test('fails for falsy values')
      (it.expects('')).toBeTruthy, /_expect_failure
      (it.expects(0)).toBeTruthy, /_expect_failure
      (it.expects(0.0)).toBeTruthy, /_expect_failure
      (it.expects()).toBeTruthy, /_expect_failure
      (it.expects(!null)).toBeTruthy, /_expect_failure
      (it.expects(list())).toBeTruthy, /_expect_failure
      (it.expects(hash())).toBeTruthy, /_expect_failure
      (it.expects(ptr_new())).toBeTruthy, /_expect_failure
      (it.expects(obj_new())).toBeTruthy, /_expect_failure

    it = suite.test('can be negated')
      (it.expects(''))._not_.toBeTruthy
      (it.expects(0))._not_.toBeTruthy
      (it.expects('text'))._not_.toBeTruthy, /_expect_failure

l.generateTestSummary
end
