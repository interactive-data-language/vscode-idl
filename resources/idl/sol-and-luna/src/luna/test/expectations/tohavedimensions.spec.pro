;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

;+
; :Description:
;   Runs toHaveDimensions and returns 1 if it raised an error.
;
; :Returns: any
;
; :Arguments:
;   e: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;   dims: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;
;-
function tohavedimensions_spec_raises, e, dims
  compile_opt idl2, hidden
  catch, err
  if (err ne 0) then begin
    catch, /cancel
    message, /reset
    return, 1
  endif
  e.toHaveDimensions, dims
  catch, /cancel
  return, 0
end

compile_opt idl2, hidden

l = luna()

  suite = l.suite('toHaveDimensions')

    it = suite.test('passes for matching dimensions')
      (it.expects(bytarr(512, 256, 3))).toHaveDimensions, [512, 256, 3]
      (it.expects(findgen(5))).toHaveDimensions, 5
      (it.expects(findgen(5))).toHaveDimensions, [5]
      (it.expects(42)).toHaveDimensions, 0

    it = suite.test('fails for different dimensions')
      (it.expects(findgen(3, 4))).toHaveDimensions, [4, 3], /_expect_failure
      (it.expects(findgen(3, 4))).toHaveDimensions, [3, 4, 1], /_expect_failure
      (it.expects(findgen(3, 4))).toHaveDimensions, 12, /_expect_failure

    it = suite.test('can be negated')
      (it.expects(findgen(3, 4)))._not_.toHaveDimensions, [4, 3]
      (it.expects(findgen(3, 4)))._not_.toHaveDimensions, [3, 4], /_expect_failure

    it = suite.test('raises an error for invalid input')
      (it.expects(tohavedimensions_spec_raises(it.expects(findgen(3)), 'a'))).toBeTrue
      (it.expects(tohavedimensions_spec_raises(it.expects(findgen(3)), 3.5))).toBeTrue
      (it.expects(tohavedimensions_spec_raises(it.expects(list(1)), 1))).toBeTrue

l.generateTestSummary
end
