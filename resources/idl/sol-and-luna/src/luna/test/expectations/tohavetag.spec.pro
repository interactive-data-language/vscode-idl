;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

;+
; :Description:
;   Runs toHaveTag and returns 1 if it raised an error.
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
function tohavetag_spec_raises, e, name
  compile_opt idl2, hidden
  catch, err
  if (err ne 0) then begin
    catch, /cancel
    message, /reset
    return, 1
  endif
  e.toHaveTag, name
  catch, /cancel
  return, 0
end

compile_opt idl2, hidden

l = luna()

  suite = l.suite('toHaveTag')

    it = suite.test('passes when the tag exists')
      (it.expects({a: 1, bee: 2})).toHaveTag, 'a'
      (it.expects({a: 1, bee: 2})).toHaveTag, 'BEE'
      (it.expects({a: 1, bee: 2})).toHaveTag, ['A', 'bee']
      (it.expects({Tagged, a: 1})).toHaveTag, 'a'

    it = suite.test('fails when a tag does not exist')
      (it.expects({a: 1})).toHaveTag, 'b', /_expect_failure
      (it.expects({a: 1})).toHaveTag, ['a', 'b'], /_expect_failure

    it = suite.test('can be negated')
      (it.expects({a: 1}))._not_.toHaveTag, 'b'
      (it.expects({a: 1}))._not_.toHaveTag, 'a', /_expect_failure

    it = suite.test('raises an error for invalid input')
      (it.expects(tohavetag_spec_raises(it.expects(hash('a', 1)), 'a'))).toBeTrue
      (it.expects(tohavetag_spec_raises(it.expects({a: 1}), 1))).toBeTrue

l.generateTestSummary
end
