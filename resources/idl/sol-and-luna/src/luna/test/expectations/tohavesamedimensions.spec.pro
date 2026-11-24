;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

;+
; :Description:
;   Runs toHaveSameDimensions and returns 1 if it raised an error.
;
; :Returns: any
;
; :Arguments:
;   e: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;   other: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;
;-
function tohavesamedimensions_spec_raises, e, other
  compile_opt idl2, hidden
  catch, err
  if (err ne 0) then begin
    catch, /cancel
    message, /reset
    return, 1
  endif
  e.toHaveSameDimensions, other
  catch, /cancel
  return, 0
end

compile_opt idl2, hidden

l = luna()

  suite = l.suite('toHaveSameDimensions')

    it = suite.test('passes for the same shape regardless of type')
      (it.expects(findgen(3, 4))).toHaveSameDimensions, bytarr(3, 4)
      (it.expects(['a', 'b'])).toHaveSameDimensions, [1, 2]
      (it.expects(1)).toHaveSameDimensions, 'a'

    it = suite.test('fails for different shapes')
      (it.expects(findgen(3, 4))).toHaveSameDimensions, bytarr(4, 3), /_expect_failure
      (it.expects(findgen(12))).toHaveSameDimensions, bytarr(3, 4), /_expect_failure
      (it.expects(findgen(2))).toHaveSameDimensions, 1, /_expect_failure

    it = suite.test('can be negated')
      (it.expects(findgen(3, 4)))._not_.toHaveSameDimensions, bytarr(4, 3)
      (it.expects(findgen(3, 4)))._not_.toHaveSameDimensions, bytarr(3, 4), /_expect_failure

    it = suite.test('raises an error for objects')
      (it.expects(tohavesamedimensions_spec_raises(it.expects(findgen(3)), list(1)))).toBeTrue
      (it.expects(tohavesamedimensions_spec_raises(it.expects(list(1)), findgen(3)))).toBeTrue

l.generateTestSummary
end
