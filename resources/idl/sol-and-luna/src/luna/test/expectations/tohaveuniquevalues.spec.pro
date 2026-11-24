;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

;+
; :Description:
;   Runs toHaveUniqueValues and returns 1 if it raised an error.
;
; :Returns: any
;
; :Arguments:
;   e: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;
;-
function toHaveUniqueValues_spec_raises, e
  compile_opt idl2, hidden
  catch, err
  if (err ne 0) then begin
    catch, /cancel
    message, /reset
    return, 1
  endif
  e.toHaveUniqueValues
  catch, /cancel
  return, 0
end

compile_opt idl2, hidden

l = luna()

  suite = l.suite('toHaveUniqueValues')

    it = suite.test('passes when there are no duplicates')
      (it.expects([1, 2, 3])).toHaveUniqueValues
      (it.expects(['a', 'A'])).toHaveUniqueValues
      (it.expects([1])).toHaveUniqueValues
      (it.expects(list(1, 'a', {x: 1}, {x: 2}))).toHaveUniqueValues
      (it.expects([{a: 1}, {a: 2}])).toHaveUniqueValues

    it = suite.test('fails when there are duplicates')
      (it.expects([1, 2, 2])).toHaveUniqueValues, /_expect_failure
      (it.expects(['a', 'b', 'a'])).toHaveUniqueValues, /_expect_failure
      (it.expects(list(1, list(2), list(2)))).toHaveUniqueValues, /_expect_failure
      (it.expects([{a: 1}, {a: 1}])).toHaveUniqueValues, /_expect_failure

    it = suite.test('can be negated')
      (it.expects([1, 1]))._not_.toHaveUniqueValues
      (it.expects([1, 2]))._not_.toHaveUniqueValues, /_expect_failure

    it = suite.test('raises an error for unsupported values')
      (it.expects(toHaveUniqueValues_spec_raises(it.expects(hash('a', 1))))).toBeTrue

l.generateTestSummary
end
