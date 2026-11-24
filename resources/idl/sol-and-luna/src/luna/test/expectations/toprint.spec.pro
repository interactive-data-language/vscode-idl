;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

;+
; :Description:
;   Helper procedure that prints a message.
;
; :Arguments:
;   text: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;
;-
pro toprint_spec_pro, text
  compile_opt idl2, hidden
  print, 'first line'
  print, text
end

;+
; :Description:
;   Helper function that prints a message and returns it.
;
; :Returns: any
;
; :Arguments:
;   text: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;
;-
function toprint_spec_fn, text
  compile_opt idl2, hidden
  print, text
  return, text
end

;+
; :Description:
;   Helper procedure that prints and then raises an error.
;
; :Arguments:
;   text: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;
;-
pro toprint_spec_error, text
  compile_opt idl2, hidden
  print, text
  message, 'always fails'
end

;+
; :Description:
;   Runs toPrint and returns 1 if it raised an error.
;
; :Returns: any
;
; :Arguments:
;   e: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;   expected: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;   a1: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;
;-
function toprint_spec_raises, e, expected, a1
  compile_opt idl2, hidden
  catch, err
  if (err ne 0) then begin
    catch, /cancel
    message, /reset
    return, 1
  endif
  e.toPrint, expected, a1
  catch, /cancel
  return, 0
end

compile_opt idl2, hidden

l = luna()

  suite = l.suite('toPrint')

    it = suite.test('passes when the text is printed')
      (it.expects('toprint_spec_pro')).toPrint, 'hello', 'hello world'
      (it.expects('toprint_spec_pro')).toPrint, 'first line', 'x'
      (it.expects('toprint_spec_fn')).toPrint, 'luna', 'hello luna', /is_function

    it = suite.test('fails when the text is not printed')
      (it.expects('toprint_spec_pro')).toPrint, 'goodbye', 'hello world', /_expect_failure
      (it.expects('toprint_spec_pro')).toPrint, 'HELLO', 'hello world', /_expect_failure

    it = suite.test('ignores case with /FOLD_CASE')
      (it.expects('toprint_spec_pro')).toPrint, 'HELLO', 'hello world', /fold_case

    it = suite.test('fails when the routine raises an error')
      (it.expects('toprint_spec_error')).toPrint, 'hello', 'hello world', /_expect_failure

    it = suite.test('can be negated')
      (it.expects('toprint_spec_pro'))._not_.toPrint, 'goodbye', 'hello world'
      (it.expects('toprint_spec_pro'))._not_.toPrint, 'hello', 'hello world', /_expect_failure

    it = suite.test('raises an error for invalid input')
      (it.expects(toprint_spec_raises(it.expects('toprint_spec_pro'), 1, 'x'))).toBeTrue
      (it.expects(toprint_spec_raises(it.expects('toprint_spec_pro'), ['a', 'b'], 'x'))).toBeTrue

l.generateTestSummary
end
