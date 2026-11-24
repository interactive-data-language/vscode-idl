;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

compile_opt idl2, hidden

l = luna()

  suite = l.suite('toBeFalsy')

    it = suite.test('passes for falsy values')
      (it.expects('')).toBeFalsy
      (it.expects(0)).toBeFalsy
      (it.expects(0.0)).toBeFalsy
      (it.expects()).toBeFalsy
      (it.expects(!null)).toBeFalsy
      (it.expects(list())).toBeFalsy
      (it.expects(hash())).toBeFalsy
      (it.expects(ptr_new())).toBeFalsy
      (it.expects(obj_new())).toBeFalsy

    it = suite.test('fails for truthy values')
      (it.expects('text')).toBeFalsy, /_expect_failure
      (it.expects(2)).toBeFalsy, /_expect_failure
      (it.expects([0, 0])).toBeFalsy, /_expect_failure
      (it.expects(list(0))).toBeFalsy, /_expect_failure

    it = suite.test('can be negated')
      (it.expects('text'))._not_.toBeFalsy
      (it.expects(''))._not_.toBeFalsy, /_expect_failure

l.generateTestSummary
end
