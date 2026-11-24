;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

;+
; :Description:
;   Runs toContainEqual and returns 1 if it raised an error.
;
; :Returns: any
;
; :Arguments:
;   e: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;   compare: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;
;-
function tocontainequal_spec_raises, e, compare
  compile_opt idl2, hidden
  catch, err
  if (err ne 0) then begin
    catch, /cancel
    message, /reset
    return, 1
  endif
  e.toContainEqual, compare
  catch, /cancel
  return, 0
end

compile_opt idl2, hidden

l = luna()

  suite = l.suite('toContainEqual')

    it = suite.test('finds simple items')
      (it.expects([1, 2, 3])).toContainEqual, 2
      (it.expects([1, 2, 3])).toContainEqual, 2.0
      (it.expects(['a', 'b'])).toContainEqual, 'b'
      (it.expects(list(1, 'a'))).toContainEqual, 'a'
      (it.expects([1, 2, 3])).toContainEqual, 4, /_expect_failure
      (it.expects(['a', 'b'])).toContainEqual, 'c', /_expect_failure
      (it.expects(['a', 'b'])).toContainEqual, 1, /_expect_failure

    it = suite.test('finds structures by content')
      (it.expects(list({a: 1}, {a: 2}))).toContainEqual, {a: 2}
      (it.expects(list({a: 1}, {a: 2}))).toContainEqual, {a: 3}, /_expect_failure
      (it.expects([{a: 1}, {a: 2}])).toContainEqual, {a: 1}

    it = suite.test('finds nested containers by content')
      (it.expects(list(list(1, 2), list(3)))).toContainEqual, list(3)
      (it.expects(list(list(1, 2), list(3)))).toContainEqual, list(4), /_expect_failure
      (it.expects(list(hash('a', 1)))).toContainEqual, hash('a', 1)

    it = suite.test('searches the values of a hash')
      (it.expects(hash('a', 1, 'b', 2))).toContainEqual, 2
      (it.expects(hash('a', 1, 'b', 2))).toContainEqual, 'a', /_expect_failure

    it = suite.test('can be negated')
      (it.expects([1, 2]))._not_.toContainEqual, 3
      (it.expects([1, 2]))._not_.toContainEqual, 1, /_expect_failure

    it = suite.test('raises an error for unsupported values')
      (it.expects(tocontainequal_spec_raises(it.expects(obj_new('IDL_Container')), 1))).toBeTrue

l.generateTestSummary
end
