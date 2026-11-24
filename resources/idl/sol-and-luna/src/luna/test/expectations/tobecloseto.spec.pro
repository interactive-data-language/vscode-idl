;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

;+
; :Description:
;   Runs toBeCloseTo with a tolerance and returns 1 if it raised an error.
;
; :Returns: any
;
; :Arguments:
;   e: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;   compare: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;   tolerance: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;
;-
function tobecloseto_spec_raises, e, compare, tolerance
  compile_opt idl2, hidden
  catch, err
  if (err ne 0) then begin
    catch, /cancel
    message, /reset
    return, 1
  endif
  e.toBeCloseTo, compare, tolerance = tolerance
  catch, /cancel
  return, 0
end

compile_opt idl2, hidden

l = luna()

  suite = l.suite('toBeCloseTo')

    it = suite.test('passes within the default tolerance')
      (it.expects(0.1d + 0.2d)).toBeCloseTo, 0.3d
      (it.expects(1.0)).toBeCloseTo, 1.0
      (it.expects(5)).toBeCloseTo, 5

    it = suite.test('fails outside the default tolerance')
      (it.expects(1.0)).toBeCloseTo, 1.001, /_expect_failure

    it = suite.test('uses the TOLERANCE keyword')
      (it.expects(10.4)).toBeCloseTo, 10.0, tolerance = 0.5
      (it.expects(10.6)).toBeCloseTo, 10.0, tolerance = 0.5, /_expect_failure
      (it.expects(10.5)).toBeCloseTo, 10.0, tolerance = 0.5

    it = suite.test('supports relative tolerance')
      (it.expects(1005.0)).toBeCloseTo, 1000.0, tolerance = 0.01, /relative
      (it.expects(1020.0)).toBeCloseTo, 1000.0, tolerance = 0.01, /relative, /_expect_failure
      (it.expects(0.0001)).toBeCloseTo, 0.0, tolerance = 0.001, /relative

    it = suite.test('requires every element of an array to pass')
      (it.expects([1.0, 1.1])).toBeCloseTo, 1.0, tolerance = 0.2
      (it.expects([1.0, 1.3])).toBeCloseTo, 1.0, tolerance = 0.2, /_expect_failure

    it = suite.test('fails for NaN')
      (it.expects(!values.f_nan)).toBeCloseTo, 1.0, /_expect_failure

    it = suite.test('can be negated')
      (it.expects(2.0))._not_.toBeCloseTo, 1.0
      (it.expects(1.0))._not_.toBeCloseTo, 1.0, /_expect_failure

    it = suite.test('raises an error for invalid input')
      (it.expects(tobecloseto_spec_raises(it.expects(1.0), 1.0, -1))).toBeTrue
      (it.expects(tobecloseto_spec_raises(it.expects(1.0), 1.0, 'a'))).toBeTrue
      (it.expects(tobecloseto_spec_raises(it.expects(1.0), 'a', 1))).toBeTrue
      (it.expects(tobecloseto_spec_raises(it.expects('a'), 1.0, 1))).toBeTrue

l.generateTestSummary
end
