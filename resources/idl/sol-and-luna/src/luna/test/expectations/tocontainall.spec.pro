;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

;+
; :Description:
;   Runs toContainAll with the values and returns 1 if it raised an error.
;
; :Returns: any
;
; :Arguments:
;   e: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;   values: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;
;-
function tocontainall_spec_raises, e, values
  compile_opt idl2, hidden
  catch, err
  if (err ne 0) then begin
    catch, /cancel
    message, /reset
    return, 1
  endif
  e.toContainAll, values
  catch, /cancel
  return, 0
end

compile_opt idl2, hidden

l = luna()

  suite = l.suite('toContainAll')

    it = suite.test('passes when every value is found')
      (it.expects(['a', 'b', 'c'])).toContainAll, ['a', 'c']
      (it.expects(['a', 'b', 'c'])).toContainAll, 'b'
      (it.expects([1, 2, 3])).toContainAll, [3.0, 1.0]
      (it.expects(list(1, 'a', {x: 1}))).toContainAll, list('a', {x: 1})

    it = suite.test('fails when a value is missing')
      (it.expects(['a', 'b', 'c'])).toContainAll, ['a', 'z'], /_expect_failure
      (it.expects([1, 2, 3])).toContainAll, [1, 4], /_expect_failure

    it = suite.test('can be negated')
      (it.expects([1, 2, 3]))._not_.toContainAll, [1, 4]
      (it.expects([1, 2, 3]))._not_.toContainAll, [1, 2], /_expect_failure

    it = suite.test('raises an error for an empty list of values')
      (it.expects(tocontainall_spec_raises(it.expects([1, 2]), list()))).toBeTrue

l.generateTestSummary
end
