;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

;+
; :Description:
;   Runs toHaveKey and returns 1 if it raised an error.
;
; :Returns: any
;
; :Arguments:
;   e: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;   key: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;
;-
function tohavekey_spec_raises, e, key
  compile_opt idl2, hidden
  catch, err
  if (err ne 0) then begin
    catch, /cancel
    message, /reset
    return, 1
  endif
  e.toHaveKey, key
  catch, /cancel
  return, 0
end

compile_opt idl2, hidden

l = luna()

  suite = l.suite('toHaveKey')

    it = suite.test('passes when the key exists')
      (it.expects(hash('name', 'luna'))).toHaveKey, 'name'
      (it.expects(orderedhash('name', 'luna'))).toHaveKey, 'name'
      (it.expects(dictionary('name', 'luna'))).toHaveKey, 'name'
      (it.expects(hash(1, 'one'))).toHaveKey, 1

    it = suite.test('fails when the key does not exist')
      (it.expects(hash('name', 'luna'))).toHaveKey, 'age', /_expect_failure
      (it.expects(hash())).toHaveKey, 'name', /_expect_failure

    it = suite.test('can be negated')
      (it.expects(hash('name', 'luna')))._not_.toHaveKey, 'age'
      (it.expects(hash('name', 'luna')))._not_.toHaveKey, 'name', /_expect_failure

    it = suite.test('raises an error for invalid input')
      (it.expects(tohavekey_spec_raises(it.expects(list(1)), 'a'))).toBeTrue
      (it.expects(tohavekey_spec_raises(it.expects([1, 2]), 'a'))).toBeTrue
      (it.expects(tohavekey_spec_raises(it.expects(hash('a', 1)), ['a', 'b']))).toBeTrue

l.generateTestSummary
end
