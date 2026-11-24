;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

;+
; :Description:
;   Runs toBeInstanceOf and returns 1 if it raised an error.
;
; :Returns: any
;
; :Arguments:
;   e: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;   className: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;
;-
function tobeinstanceof_spec_raises, e, className
  compile_opt idl2, hidden
  catch, err
  if (err ne 0) then begin
    catch, /cancel
    message, /reset
    return, 1
  endif
  e.toBeInstanceOf, className
  catch, /cancel
  return, 0
end

compile_opt idl2, hidden

l = luna()

  suite = l.suite('toBeInstanceOf')

    it = suite.test('passes for the class and its parents')
      (it.expects(list(1))).toBeInstanceOf, 'List'
      (it.expects(list(1))).toBeInstanceOf, 'list'
      (it.expects(orderedhash('a', 1))).toBeInstanceOf, 'OrderedHash'
      (it.expects(orderedhash('a', 1))).toBeInstanceOf, 'Hash'
      (it.expects(list(1))).toBeInstanceOf, 'IDL_Object'

    it = suite.test('fails for other classes')
      (it.expects(list(1))).toBeInstanceOf, 'Hash', /_expect_failure
      (it.expects(hash('a', 1))).toBeInstanceOf, 'OrderedHash', /_expect_failure

    it = suite.test('fails for values that are not objects')
      (it.expects(42)).toBeInstanceOf, 'List', /_expect_failure
      (it.expects('List')).toBeInstanceOf, 'List', /_expect_failure

    it = suite.test('requires every object in an array to match')
      (it.expects([list(1), list(2)])).toBeInstanceOf, 'List'
      (it.expects([list(1), hash('a', 1)])).toBeInstanceOf, 'List', /_expect_failure

    it = suite.test('can be negated')
      (it.expects(42))._not_.toBeInstanceOf, 'List'
      (it.expects(list(1)))._not_.toBeInstanceOf, 'List', /_expect_failure

    it = suite.test('raises an error for invalid input')
      (it.expects(tobeinstanceof_spec_raises(it.expects(list(1)), 5))).toBeTrue

l.generateTestSummary
end
