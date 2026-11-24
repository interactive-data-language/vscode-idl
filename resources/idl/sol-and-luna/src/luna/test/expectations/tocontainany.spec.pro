;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

;+
; :Description:
;   Runs toContainAny with the values and returns 1 if it raised an error.
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
function tocontainany_spec_raises, e, values
  compile_opt idl2, hidden
  catch, err
  if (err ne 0) then begin
    catch, /cancel
    message, /reset
    return, 1
  endif
  e.toContainAny, values
  catch, /cancel
  return, 0
end

compile_opt idl2, hidden

l = luna()

  suite = l.suite('toContainAny')

    it = suite.test('passes when at least one value is found')
      (it.expects(['a', 'b', 'c'])).toContainAny, ['z', 'c']
      (it.expects(['a', 'b', 'c'])).toContainAny, 'a'
      (it.expects([1, 2, 3])).toContainAny, [9, 2]
      (it.expects(list(1, {x: 1}))).toContainAny, list(5, {x: 1})

    it = suite.test('fails when no value is found')
      (it.expects(['a', 'b'])).toContainAny, ['y', 'z'], /_expect_failure
      (it.expects([1, 2, 3])).toContainAny, [4, 5], /_expect_failure

    it = suite.test('can be negated')
      (it.expects([1, 2, 3]))._not_.toContainAny, [4, 5]
      (it.expects([1, 2, 3]))._not_.toContainAny, [5, 1], /_expect_failure

    it = suite.test('raises an error for an empty list of values')
      (it.expects(tocontainany_spec_raises(it.expects([1, 2]), list()))).toBeTrue

l.generateTestSummary
end
