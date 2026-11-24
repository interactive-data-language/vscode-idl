;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

;+
; :Description:
;   Runs toBeSorted and returns 1 if it raised an error.
;
; :Returns: any
;
; :Arguments:
;   e: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;
;-
function tobesorted_spec_raises, e
  compile_opt idl2, hidden
  catch, err
  if (err ne 0) then begin
    catch, /cancel
    message, /reset
    return, 1
  endif
  e.toBeSorted
  catch, /cancel
  return, 0
end

compile_opt idl2, hidden

l = luna()

  suite = l.suite('toBeSorted')

    it = suite.test('passes for ascending values')
      (it.expects([1, 2, 3])).toBeSorted
      (it.expects([1, 2, 2, 3])).toBeSorted
      (it.expects(['a', 'b', 'c'])).toBeSorted
      (it.expects([5])).toBeSorted
      (it.expects(list(1, 2, 3))).toBeSorted
      (it.expects(list())).toBeSorted

    it = suite.test('fails for values out of order')
      (it.expects([1, 3, 2])).toBeSorted, /_expect_failure
      (it.expects([3, 2, 1])).toBeSorted, /_expect_failure
      (it.expects(['b', 'a'])).toBeSorted, /_expect_failure

    it = suite.test('checks descending order with /DESCENDING')
      (it.expects([3, 2, 2, 1])).toBeSorted, /descending
      (it.expects(['c', 'b'])).toBeSorted, /descending
      (it.expects([1, 2, 3])).toBeSorted, /descending, /_expect_failure

    it = suite.test('can be negated')
      (it.expects([3, 1, 2]))._not_.toBeSorted
      (it.expects([1, 2, 3]))._not_.toBeSorted, /_expect_failure

    it = suite.test('raises an error for unsupported values')
      (it.expects(tobesorted_spec_raises(it.expects(hash('a', 1))))).toBeTrue
      (it.expects(tobesorted_spec_raises(it.expects(complex(1, 2))))).toBeTrue
      (it.expects(tobesorted_spec_raises(it.expects({a: 1})))).toBeTrue

l.generateTestSummary
end
