;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

;+
; :Description:
;   Runs toBeAnArrayOf and returns 1 if it raised an error.
;
; :Returns: any
;
; :Arguments:
;   e: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;   type: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;
;-
function tobeanarrayof_spec_raises, e, type
  compile_opt idl2, hidden
  catch, err
  if (err ne 0) then begin
    catch, /cancel
    message, /reset
    return, 1
  endif
  e.toBeAnArrayOf, type
  catch, /cancel
  return, 0
end

compile_opt idl2, hidden

l = luna()

  suite = l.suite('toBeAnArrayOf')

    it = suite.test('passes when the array type matches')
      (it.expects(['a', 'b'])).toBeAnArrayOf, 'string'
      (it.expects([1, 2, 3])).toBeAnArrayOf, 'long'
      (it.expects(findgen(3))).toBeAnArrayOf, 'float'
      (it.expects([1, 2, 3])).toBeAnArrayOf, 'number'
      (it.expects([1, 2, 3])).toBeAnArrayOf, 'Integer'

    it = suite.test('fails when the type does not match')
      (it.expects([1, 2, 3])).toBeAnArrayOf, 'string', /_expect_failure
      (it.expects(findgen(3))).toBeAnArrayOf, 'int', /_expect_failure

    it = suite.test('fails for scalars')
      (it.expects('a')).toBeAnArrayOf, 'string', /_expect_failure
      (it.expects(5)).toBeAnArrayOf, 'number', /_expect_failure

    it = suite.test('can be negated')
      (it.expects(['a']))._not_.toBeAnArrayOf, 'long'
      (it.expects(['a']))._not_.toBeAnArrayOf, 'string', /_expect_failure

    it = suite.test('raises an error for invalid input')
      (it.expects(tobeanarrayof_spec_raises(it.expects([1, 2]), 5))).toBeTrue
      (it.expects(tobeanarrayof_spec_raises(it.expects([1, 2]), ['int', 'long']))).toBeTrue

l.generateTestSummary
end
