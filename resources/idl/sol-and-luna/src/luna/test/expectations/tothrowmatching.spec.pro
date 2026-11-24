;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

;+
; :Description:
;   Helper function that raises an error when the input is negative.
;
; :Returns: any
;
; :Arguments:
;   x: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;
;-
function tothrowmatching_spec_fn, x
  compile_opt idl2, hidden
  if (x lt 0) then message, 'negative value not allowed: ' + strtrim(x, 2)
  return, x
end

;+
; :Description:
;   Runs toThrowMatching and returns 1 if it raised an error.
;
; :Returns: any
;
; :Arguments:
;   e: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;   regex: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;   a1: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;
;-
function tothrowmatching_spec_raises, e, regex, a1
  compile_opt idl2, hidden
  catch, err
  if (err ne 0) then begin
    catch, /cancel
    message, /reset
    return, 1
  endif
  e.toThrowMatching, regex, a1
  catch, /cancel
  return, 0
end

compile_opt idl2, hidden

l = luna()

  suite = l.suite('toThrowMatching')

    it = suite.test('matches the error with a regular expression')
      (it.expects('tothrowmatching_spec_fn')).toThrowMatching, 'negative .* allowed: -[0-9]+$', -1, /is_function
      (it.expects('tothrowmatching_spec_fn')).toThrowMatching, '^positive', -1, /is_function, /_expect_failure
      (it.expects('tothrowmatching_spec_fn')).toThrowMatching, 'negative', 1, /is_function, /_expect_failure

    it = suite.test('can be negated')
      (it.expects('tothrowmatching_spec_fn'))._not_.toThrowMatching, '^positive', -1, /is_function
      (it.expects('tothrowmatching_spec_fn'))._not_.toThrowMatching, 'negative', -1, /is_function, /_expect_failure

    it = suite.test('raises an error for invalid input')
      (it.expects(tothrowmatching_spec_raises(it.expects('tothrowmatching_spec_fn'), 1, -1))).toBeTrue
      (it.expects(tothrowmatching_spec_raises(it.expects('tothrowmatching_spec_fn'), ['a', 'b'], -1))).toBeTrue

l.generateTestSummary
end
