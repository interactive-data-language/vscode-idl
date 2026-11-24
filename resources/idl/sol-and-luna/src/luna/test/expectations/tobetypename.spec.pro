;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

compile_opt idl2, hidden

l = luna()

  suite = l.suite('toBeTypename')

    it = suite.test('matches the type name')
      (it.expects(5b)).toBeTypename, 'byte'
      (it.expects(5b)).toBeTypename, 'float', /_expect_failure

    it = suite.test('can be negated')
      (it.expects(5b))._not_.toBeTypename, 'float'
      (it.expects(5b))._not_.toBeTypename, 'byte', /_expect_failure

l.generateTestSummary
end
