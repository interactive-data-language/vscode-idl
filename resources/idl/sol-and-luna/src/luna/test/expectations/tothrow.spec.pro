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
function tothrow_spec_fn, x
  compile_opt idl2, hidden
  if (x lt 0) then message, 'negative value not allowed: ' + strtrim(x, 2)
  return, x
end

;+
; :Description:
;   Helper procedure that raises an error when the input is negative.
;
; :Arguments:
;   x: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;
; :Keywords:
;   scale: bidirectional, optional, any
;     Placeholder docs for argument, keyword, or property
;
;-
pro tothrow_spec_pro, x, scale = scale
  compile_opt idl2, hidden
  if (x lt 0) then message, 'negative value not allowed: ' + strtrim(x, 2)
end

;+
; :Description:
;   Runs toThrow and returns 1 if it raised an error.
;
; :Returns: any
;
; :Arguments:
;   e: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;   a1: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;   a2: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;
;-
function tothrow_spec_raises, e, a1, a2
  compile_opt idl2, hidden
  catch, err
  if (err ne 0) then begin
    catch, /cancel
    message, /reset
    return, 1
  endif
  e.toThrow, a1, a2
  catch, /cancel
  return, 0
end

compile_opt idl2, hidden

l = luna()

  suite = l.suite('toThrow')

    it = suite.test('passes when a function throws')
      (it.expects('tothrow_spec_fn')).toThrow, -1, /is_function
      (it.expects('tothrow_spec_fn')).toThrow, 1, /is_function, /_expect_failure

    it = suite.test('works with procedures and keywords')
      (it.expects('tothrow_spec_pro')).toThrow, -1, scale = 2
      (it.expects('tothrow_spec_pro')).toThrow, 1, /_expect_failure

    it = suite.test('works with object methods')
      (it.expects(it.expects())).toThrow, 'toHaveMethod', 'add'
      (it.expects(it.expects(list()))).toThrow, 'toHaveMethod', 'add', /_expect_failure

    it = suite.test('can be negated to verify clean runs')
      (it.expects('tothrow_spec_fn'))._not_.toThrow, 1, /is_function
      (it.expects('tothrow_spec_fn'))._not_.toThrow, -1, /is_function, /_expect_failure

    it = suite.test('raises an error for invalid input')
      (it.expects(tothrow_spec_raises(it.expects(list(1)), 1))).toBeTrue
      (it.expects(tothrow_spec_raises(it.expects('tothrow_spec_fn')))).toBeTrue

l.generateTestSummary
end
