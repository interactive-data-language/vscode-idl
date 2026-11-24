;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

;+
; :Description:
;   Runs toHaveLength and returns 1 if it raised an error.
;
; :Returns: any
;
; :Arguments:
;   e: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;   n: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;
;-
function tohavelength_spec_raises, e, n
  compile_opt idl2, hidden
  catch, err
  if (err ne 0) then begin
    catch, /cancel
    message, /reset
    return, 1
  endif
  e.toHaveLength, n
  catch, /cancel
  return, 0
end

compile_opt idl2, hidden

l = luna()

  suite = l.suite('toHaveLength')

    it = suite.test('counts array elements')
      (it.expects(findgen(100))).toHaveLength, 100
      (it.expects(findgen(3, 4))).toHaveLength, 12
      (it.expects(['a', 'b'])).toHaveLength, 2
      (it.expects(42)).toHaveLength, 1
      (it.expects(replicate({a: 1}, 3))).toHaveLength, 3

    it = suite.test('counts container items')
      (it.expects(list(1, 2, 3))).toHaveLength, 3
      (it.expects(hash('a', 1, 'b', 2))).toHaveLength, 2
      (it.expects(orderedhash('a', 1))).toHaveLength, 1
      (it.expects(dictionary('a', 1))).toHaveLength, 1
      (it.expects(list())).toHaveLength, 0
      (it.expects(hash())).toHaveLength, 0

    it = suite.test('fails when the length differs')
      (it.expects(findgen(5))).toHaveLength, 4, /_expect_failure
      (it.expects(list(1, 2))).toHaveLength, 3, /_expect_failure

    it = suite.test('can be negated')
      (it.expects(findgen(5)))._not_.toHaveLength, 4
      (it.expects(findgen(5)))._not_.toHaveLength, 5, /_expect_failure

    it = suite.test('raises an error for invalid input')
      (it.expects(tohavelength_spec_raises(it.expects(findgen(5)), -1))).toBeTrue
      (it.expects(tohavelength_spec_raises(it.expects(findgen(5)), 'a'))).toBeTrue
      (it.expects(tohavelength_spec_raises(it.expects(findgen(5)), [1, 2]))).toBeTrue

l.generateTestSummary
end
