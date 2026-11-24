;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

;+
; :Description:
;   Helper function that waits and returns the input.
;
; :Returns: any
;
; :Arguments:
;   x: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;
;-
function torunwithin_spec_fn, x
  compile_opt idl2, hidden
  wait, x
  return, x
end

;+
; :Description:
;   Helper procedure that waits.
;
; :Arguments:
;   x: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;
;-
pro torunwithin_spec_pro, x
  compile_opt idl2, hidden
  wait, x
end

;+
; :Description:
;   Helper function that always raises an error.
;
; :Returns: any
;
; :Arguments:
;   x: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;
;-
function torunwithin_spec_error, x
  compile_opt idl2, hidden
  message, 'always fails'
  return, x
end

;+
; :Description:
;   Runs toRunWithin and returns 1 if it raised an error.
;
; :Returns: any
;
; :Arguments:
;   e: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;   seconds: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;   a1: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;
;-
function torunwithin_spec_raises, e, seconds, a1
  compile_opt idl2, hidden
  catch, err
  if (err ne 0) then begin
    catch, /cancel
    message, /reset
    return, 1
  endif
  e.toRunWithin, seconds, a1
  catch, /cancel
  return, 0
end

compile_opt idl2, hidden

l = luna()

  suite = l.suite('toRunWithin')

    it = suite.test('passes when the routine is fast enough')
      (it.expects('torunwithin_spec_fn')).toRunWithin, 2, 0.01, /is_function
      (it.expects('torunwithin_spec_pro')).toRunWithin, 2, 0.01
      (it.expects(it.expects(list()))).toRunWithin, 2, 'toHaveMethod', 'add'

    it = suite.test('fails when the routine is too slow')
      (it.expects('torunwithin_spec_fn')).toRunWithin, 0.05, 0.5, /is_function, /_expect_failure
      (it.expects('torunwithin_spec_pro')).toRunWithin, 0.05, 0.5, /_expect_failure

    it = suite.test('fails when the routine raises an error')
      (it.expects('torunwithin_spec_error')).toRunWithin, 2, 1, /is_function, /_expect_failure

    it = suite.test('can be negated')
      (it.expects('torunwithin_spec_fn'))._not_.toRunWithin, 0.05, 0.5, /is_function
      (it.expects('torunwithin_spec_fn'))._not_.toRunWithin, 2, 0.01, /is_function, /_expect_failure

    it = suite.test('raises an error for invalid input')
      (it.expects(torunwithin_spec_raises(it.expects('torunwithin_spec_fn'), 'a', 0.01))).toBeTrue
      (it.expects(torunwithin_spec_raises(it.expects('torunwithin_spec_fn'), [1, 2], 0.01))).toBeTrue

l.generateTestSummary
end
