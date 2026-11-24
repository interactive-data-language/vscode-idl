;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

compile_opt idl2, hidden

l = luna()

  suite = l.suite('toMatchRegex')

    it = suite.test('matches regular expressions')
      (it.expects('string')).toMatchRegex, 'str'
      (it.expects('string')).toMatchRegex, 'thing', /_expect_failure

    it = suite.test('can be negated')
      (it.expects('string'))._not_.toMatchRegex, 'thing'
      (it.expects('string'))._not_.toMatchRegex, 'str', /_expect_failure
      (it.expects('string'))._not_.toMatchRegex, '[0-9][0-9.]*'

    it = suite.test('raises an error for non strings')
      e = it.expects('string')
      (it.expects(e)).toThrow, 'toMatchRegex', 1
      (it.expects(e._not_)).toThrow, 'toMatchRegex', 1

l.generateTestSummary
end
