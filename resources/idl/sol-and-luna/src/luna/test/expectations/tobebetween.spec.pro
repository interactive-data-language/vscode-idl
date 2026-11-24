;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

;+
; :Description:
;   Runs toBeBetween and returns 1 if it raised an error.
;
; :Returns: any
;
; :Arguments:
;   e: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;   low: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;   high: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;
;-
function tobebetween_spec_raises, e, low, high
  compile_opt idl2, hidden
  catch, err
  if (err ne 0) then begin
    catch, /cancel
    message, /reset
    return, 1
  endif
  e.toBeBetween, low, high
  catch, /cancel
  return, 0
end

compile_opt idl2, hidden

l = luna()

  suite = l.suite('toBeBetween')

    it = suite.test('passes inside the range, including the bounds')
      (it.expects(50)).toBeBetween, 0, 100
      (it.expects(0)).toBeBetween, 0, 100
      (it.expects(100)).toBeBetween, 0, 100
      (it.expects(0.5)).toBeBetween, 0, 1

    it = suite.test('fails outside the range')
      (it.expects(-1)).toBeBetween, 0, 100, /_expect_failure
      (it.expects(101)).toBeBetween, 0, 100, /_expect_failure

    it = suite.test('excludes the bounds with /EXCLUSIVE')
      (it.expects(50)).toBeBetween, 0, 100, /exclusive
      (it.expects(0)).toBeBetween, 0, 100, /exclusive, /_expect_failure
      (it.expects(100)).toBeBetween, 0, 100, /exclusive, /_expect_failure

    it = suite.test('requires every element of an array to pass')
      (it.expects([1, 50, 99])).toBeBetween, 0, 100
      (it.expects([1, 50, 101])).toBeBetween, 0, 100, /_expect_failure

    it = suite.test('can be negated')
      (it.expects(101))._not_.toBeBetween, 0, 100
      (it.expects(50))._not_.toBeBetween, 0, 100, /_expect_failure

    it = suite.test('raises an error for invalid input')
      (it.expects(tobebetween_spec_raises(it.expects(5), 10, 0))).toBeTrue
      (it.expects(tobebetween_spec_raises(it.expects(5), 'a', 10))).toBeTrue
      (it.expects(tobebetween_spec_raises(it.expects(5), 0, [1, 2]))).toBeTrue
      (it.expects(tobebetween_spec_raises(it.expects('a'), 0, 10))).toBeTrue

l.generateTestSummary
end
