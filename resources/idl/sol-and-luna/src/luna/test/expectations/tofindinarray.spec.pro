;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

compile_opt idl2, hidden

l = luna()

  suite = l.suite('toFindInArray')

    it = suite.test('finds elements in arrays')
      (it.expects(findgen(5))).toFindInArray, 1.0
      (it.expects(findgen(5))).toFindInArray, 5.0, /_expect_failure

    it = suite.test('can be negated')
      (it.expects(findgen(5)))._not_.toFindInArray, 5.0
      (it.expects(findgen(5)))._not_.toFindInArray, 1.0, /_expect_failure

    it = suite.test('raises an error for invalid input')
      (it.expects(it.expects(findgen(5)))).toThrow, 'toFindInArray', fltarr(2)
      (it.expects(it.expects(5))).toThrow, 'toFindInArray', 1.0

l.generateTestSummary
end
