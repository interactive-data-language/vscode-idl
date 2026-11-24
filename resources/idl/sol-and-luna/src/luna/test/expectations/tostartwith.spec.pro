;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

;+
; :Description:
;   Runs toStartWith and returns 1 if it raised an error.
;
; :Returns: any
;
; :Arguments:
;   e: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;   prefix: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;
;-
function tostartwith_spec_raises, e, prefix
  compile_opt idl2, hidden
  catch, err
  if (err ne 0) then begin
    catch, /cancel
    message, /reset
    return, 1
  endif
  e.toStartWith, prefix
  catch, /cancel
  return, 0
end

compile_opt idl2, hidden

l = luna()

  suite = l.suite('toStartWith')

    it = suite.test('passes when the string starts with the prefix')
      (it.expects('sol and luna')).toStartWith, 'sol'
      (it.expects('sol')).toStartWith, 'sol'
      (it.expects('sol')).toStartWith, ''

    it = suite.test('fails otherwise')
      (it.expects('sol and luna')).toStartWith, 'luna', /_expect_failure
      (it.expects('so')).toStartWith, 'sol', /_expect_failure
      (it.expects('Sol')).toStartWith, 'sol', /_expect_failure

    it = suite.test('ignores case with /FOLD_CASE')
      (it.expects('Sol and Luna')).toStartWith, 'sOL', /fold_case
      (it.expects('Sol')).toStartWith, 'luna', /fold_case, /_expect_failure

    it = suite.test('requires every element of an array to pass')
      (it.expects(['solar', 'sol'])).toStartWith, 'sol'
      (it.expects(['solar', 'luna'])).toStartWith, 'sol', /_expect_failure

    it = suite.test('can be negated')
      (it.expects('luna'))._not_.toStartWith, 'sol'
      (it.expects('sol'))._not_.toStartWith, 'sol', /_expect_failure

    it = suite.test('raises an error for invalid input')
      (it.expects(tostartwith_spec_raises(it.expects(42), 'a'))).toBeTrue
      (it.expects(tostartwith_spec_raises(it.expects('a'), 42))).toBeTrue

l.generateTestSummary
end
