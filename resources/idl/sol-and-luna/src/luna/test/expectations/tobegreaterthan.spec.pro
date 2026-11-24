;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

;+
; :Description:
;   Runs toBeGreaterThan and returns 1 if it raised an error.
;
; :Returns: any
;
; :Arguments:
;   e: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;   compare: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;
;-
function tobegreaterthan_spec_raises, e, compare
  compile_opt idl2, hidden
  catch, err
  if (err ne 0) then begin
    catch, /cancel
    message, /reset
    return, 1
  endif
  e.toBeGreaterThan, compare
  catch, /cancel
  return, 0
end

compile_opt idl2, hidden

l = luna()

  suite = l.suite('toBeGreaterThan')

    it = suite.test('passes when greater')
      (it.expects(5)).toBeGreaterThan, 4
      (it.expects(0.5)).toBeGreaterThan, 0
      (it.expects(5b)).toBeGreaterThan, -1.5

    it = suite.test('fails when equal or less')
      (it.expects(5)).toBeGreaterThan, 5, /_expect_failure
      (it.expects(4)).toBeGreaterThan, 5, /_expect_failure

    it = suite.test('requires every element of an array to pass')
      (it.expects([5, 6, 7])).toBeGreaterThan, 4
      (it.expects([5, 6, 7])).toBeGreaterThan, 5, /_expect_failure
      (it.expects([[5, 6], [7, 8]])).toBeGreaterThan, 4

    it = suite.test('fails for NaN')
      (it.expects(!values.f_nan)).toBeGreaterThan, 0, /_expect_failure

    it = suite.test('can be negated')
      (it.expects(5))._not_.toBeGreaterThan, 5
      (it.expects(6))._not_.toBeGreaterThan, 5, /_expect_failure

    it = suite.test('raises an error for invalid input')
      (it.expects(tobegreaterthan_spec_raises(it.expects('a'), 1))).toBeTrue
      (it.expects(tobegreaterthan_spec_raises(it.expects(5), 'a'))).toBeTrue
      (it.expects(tobegreaterthan_spec_raises(it.expects(5), [1, 2]))).toBeTrue
      (it.expects(tobegreaterthan_spec_raises(it.expects(complex(1, 2)), 1))).toBeTrue
      (it.expects(tobegreaterthan_spec_raises(it.expects(), 1))).toBeTrue

l.generateTestSummary
end
