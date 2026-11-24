;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

;+
; :Description:
;   Runs toBeSameObject and returns 1 if it raised an error.
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
function tobesameobject_spec_raises, e, compare
  compile_opt idl2, hidden
  catch, err
  if (err ne 0) then begin
    catch, /cancel
    message, /reset
    return, 1
  endif
  e.toBeSameObject, compare
  catch, /cancel
  return, 0
end

compile_opt idl2, hidden

l = luna()

  suite = l.suite('toBeSameObject')

    it = suite.test('passes for the same reference')
      a = list(1, 2)
      (it.expects(a)).toBeSameObject, a
      h = hash('a', 1)
      (it.expects(h)).toBeSameObject, h

    it = suite.test('fails for equal but different objects')
      a = list(1, 2)
      b = list(1, 2)
      (it.expects(a)).toBeSameObject, b, /_expect_failure
      (it.expects(hash('a', 1))).toBeSameObject, hash('a', 1), /_expect_failure

    it = suite.test('fails when either object is null')
      a = list(1)
      (it.expects(a)).toBeSameObject, obj_new(), /_expect_failure
      (it.expects(obj_new())).toBeSameObject, a, /_expect_failure

    it = suite.test('can be negated')
      a = list(1, 2)
      b = list(1, 2)
      (it.expects(a))._not_.toBeSameObject, b
      (it.expects(a))._not_.toBeSameObject, a, /_expect_failure

    it = suite.test('raises an error for invalid input')
      a = list(1)
      (it.expects(tobesameobject_spec_raises(it.expects(5), a))).toBeTrue
      (it.expects(tobesameobject_spec_raises(it.expects(a), 5))).toBeTrue
      (it.expects(tobesameobject_spec_raises(it.expects(), a))).toBeTrue

l.generateTestSummary
end
