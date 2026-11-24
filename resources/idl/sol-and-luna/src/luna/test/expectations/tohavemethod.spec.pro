;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

;+
; :Description:
;   Runs toHaveMethod and returns 1 if it raised an error.
;
; :Returns: any
;
; :Arguments:
;   e: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;   name: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;
;-
function tohavemethod_spec_raises, e, name
  compile_opt idl2, hidden
  catch, err
  if (err ne 0) then begin
    catch, /cancel
    message, /reset
    return, 1
  endif
  e.toHaveMethod, name
  catch, /cancel
  return, 0
end

compile_opt idl2, hidden

l = luna()

  suite = l.suite('toHaveMethod')

    it = suite.test('passes when the method exists')
      (it.expects(list())).toHaveMethod, 'add'
      (it.expects(list())).toHaveMethod, 'ADD'
      (it.expects(hash())).toHaveMethod, 'hasKey'
      (it.expects(obj_new('IDL_Container'))).toHaveMethod, 'count'

    it = suite.test('fails when the method does not exist')
      (it.expects(list())).toHaveMethod, 'bogus', /_expect_failure
      (it.expects(hash())).toHaveMethod, 'add2', /_expect_failure

    it = suite.test('can be negated')
      (it.expects(list()))._not_.toHaveMethod, 'bogus'
      (it.expects(list()))._not_.toHaveMethod, 'add', /_expect_failure

    it = suite.test('raises an error for invalid input')
      (it.expects(tohavemethod_spec_raises(it.expects(1), 'add'))).toBeTrue
      (it.expects(tohavemethod_spec_raises(it.expects(obj_new()), 'add'))).toBeTrue
      (it.expects(tohavemethod_spec_raises(it.expects(list()), ['add', 'count']))).toBeTrue
      (it.expects(tohavemethod_spec_raises(it.expects(list()), 1))).toBeTrue

l.generateTestSummary
end
