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
function tothrowmessage_spec_fn, x
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
;-
pro tothrowmessage_spec_pro, x
  compile_opt idl2, hidden
  if (x lt 0) then message, 'negative value not allowed: ' + strtrim(x, 2)
end

;+
; :Description:
;   Runs toThrowMessage and returns 1 if it raised an error.
;
; :Returns: any
;
; :Arguments:
;   e: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;   str: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;   a1: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;
;-
function tothrowmessage_spec_raises, e, str, a1
  compile_opt idl2, hidden
  catch, err
  if (err ne 0) then begin
    catch, /cancel
    message, /reset
    return, 1
  endif
  e.toThrowMessage, str, a1
  catch, /cancel
  return, 0
end

compile_opt idl2, hidden

l = luna()

  suite = l.suite('toThrowMessage')

    it = suite.test('matches the error text')
      (it.expects('tothrowmessage_spec_fn')).toThrowMessage, 'negative value', -1, /is_function
      (it.expects('tothrowmessage_spec_fn')).toThrowMessage, 'not allowed: -1', -1, /is_function
      (it.expects('tothrowmessage_spec_fn')).toThrowMessage, 'something else', -1, /is_function, /_expect_failure
      (it.expects('tothrowmessage_spec_fn')).toThrowMessage, 'NEGATIVE', -1, /is_function, /_expect_failure
      (it.expects('tothrowmessage_spec_fn')).toThrowMessage, 'negative value', 1, /is_function, /_expect_failure
      (it.expects('tothrowmessage_spec_pro')).toThrowMessage, 'negative', -1

    it = suite.test('can be negated')
      (it.expects('tothrowmessage_spec_fn'))._not_.toThrowMessage, 'something else', -1, /is_function
      (it.expects('tothrowmessage_spec_fn'))._not_.toThrowMessage, 'negative', -1, /is_function, /_expect_failure

    it = suite.test('raises an error for invalid input')
      (it.expects(tothrowmessage_spec_raises(it.expects('tothrowmessage_spec_fn'), 1, -1))).toBeTrue
      (it.expects(tothrowmessage_spec_raises(it.expects('tothrowmessage_spec_fn'), ['a', 'b'], -1))).toBeTrue

l.generateTestSummary
end
