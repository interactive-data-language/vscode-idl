;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

;+
; :Description:
;   Runs toHaveKeyValue and returns 1 if it raised an error.
;
; :Returns: any
;
; :Arguments:
;   e: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;   key: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;   value: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;
;-
function tohavekeyvalue_spec_raises, e, key, value
  compile_opt idl2, hidden
  catch, err
  if (err ne 0) then begin
    catch, /cancel
    message, /reset
    return, 1
  endif
  e.toHaveKeyValue, key, value
  catch, /cancel
  return, 0
end

compile_opt idl2, hidden

l = luna()

  suite = l.suite('toHaveKeyValue')

    it = suite.test('passes when the key has the value')
      (it.expects(hash('name', 'luna', 'n', 2))).toHaveKeyValue, 'name', 'luna'
      (it.expects(hash('name', 'luna', 'n', 2))).toHaveKeyValue, 'n', 2.0
      (it.expects(orderedhash('list', list(1, 2)))).toHaveKeyValue, 'list', list(1, 2)
      (it.expects(dictionary('s', {a: 1}))).toHaveKeyValue, 's', {a: 1}

    it = suite.test('fails when the value differs or the key is missing')
      (it.expects(hash('name', 'luna'))).toHaveKeyValue, 'name', 'sol', /_expect_failure
      (it.expects(hash('name', 'luna'))).toHaveKeyValue, 'age', 'luna', /_expect_failure
      (it.expects(hash('n', 2))).toHaveKeyValue, 'n', 'two', /_expect_failure

    it = suite.test('can be negated')
      (it.expects(hash('name', 'luna')))._not_.toHaveKeyValue, 'name', 'sol'
      (it.expects(hash('name', 'luna')))._not_.toHaveKeyValue, 'name', 'luna', /_expect_failure

    it = suite.test('raises an error for invalid input')
      (it.expects(tohavekeyvalue_spec_raises(it.expects(list(1)), 'a', 1))).toBeTrue
      (it.expects(tohavekeyvalue_spec_raises(it.expects(hash('a', 1)), [1, 2], 1))).toBeTrue

l.generateTestSummary
end
