;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

compile_opt idl2, hidden

l = luna()

  suite = l.suite('toBeA')

    it = suite.test('matches all of the specified types')
      (it.expects(fltarr(5))).toBeA, ['array', 'float']
      (it.expects(fltarr(5))).toBeA, 'byte', /_expect_failure

    it = suite.test('can be negated')
      (it.expects(fltarr(5)))._not_.toBeA, ['byte', 'string']
      (it.expects(fltarr(5)))._not_.toBeA, ['array', 'float'], /_expect_failure

l.generateTestSummary
end
