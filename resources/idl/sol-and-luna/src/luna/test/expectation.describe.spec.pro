;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

compile_opt idl2, hidden

l = luna()

  suite = l.suite('Expected and received descriptions')

    it = suite.test('describes scalars and strings')
      e = it.expects(1)
      (it.expects(e._describe(5))).toEqual, '5'
      (it.expects(e._describe('abc'))).toEqual, "'abc'"
      (it.expects(e._describe(!null))).toEqual, '!null'

    it = suite.test('describes arrays and truncates long ones')
      e = it.expects(1)
      (it.expects(e._describe([1, 2, 3]))).toEqual, '[1, 2, 3]'
      (it.expects(e._describe(indgen(20)))).toEqual, '[0, 1, 2, 3, 4, 5, 6, 7, ...] (20 elements)'
      (it.expects(e._describe(intarr(2, 3)))).toEqual, '[0, 0, 0, 0, 0, 0] with dimensions [2, 3]'

    it = suite.test('describes lists and hashes without indexing them as arrays')
      e = it.expects(1)
      (it.expects(e._describe(list(1, 'a')))).toEqual, "list(1, 'a')"
      (it.expects(e._describe(hash('k', 1)))).toEqual, "hash('k': 1)"
      (it.expects(e._describe(list()))).toEqual, 'list()'

    it = suite.test('shows the received value in a failure')
      e = it.expects(1)
      (it.expects(e._describeValue())).toEqual, '1'

l.generateTestSummary
end
