;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

compile_opt idl2, hidden

l = luna()

  suite = l.suite('toContainString')

    it = suite.test('checks for substrings')
      (it.expects('string')).toContainString, 'str'
      (it.expects('string')).toContainString, 'thing', /_expect_failure

    it = suite.test('can be negated')
      (it.expects('string'))._not_.toContainString, 'things'
      (it.expects('string'))._not_.toContainString, 'str', /_expect_failure

    it = suite.test('raises an error for non strings')
      e = it.expects('string')
      (it.expects(e)).toThrow, 'toContainString', 1
      (it.expects(e._not_)).toThrow, 'toContainString', 1

l.generateTestSummary
end
