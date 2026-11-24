;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

;+
; :Description:
;   Runs toEqual with /FOLD_CASE and returns 1 if it raised an error.
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
function toequal_spec_raises, e, compare
  compile_opt idl2, hidden
  catch, err
  if (err ne 0) then begin
    catch, /cancel
    message, /reset
    return, 1
  endif
  e.toEqual, compare, /fold_case
  catch, /cancel
  return, 0
end

compile_opt idl2, hidden

l = luna()

  suite = l.suite('toEqual')

    it = suite.test('/FOLD_CASE ignores case for strings')
      (it.expects('Hello')).toEqual, 'hello', /fold_case
      (it.expects('HELLO')).toEqual, 'hello', /fold_case
      (it.expects('Hello')).toEqual, 'world', /fold_case, /_expect_failure

    it = suite.test('is case sensitive by default')
      (it.expects('Hello')).toEqual, 'hello', /_expect_failure

    it = suite.test('/FOLD_CASE works for arrays')
      (it.expects(['A', 'b'])).toEqual, ['a', 'B'], /fold_case
      (it.expects(['A', 'b'])).toEqual, ['a', 'c'], /fold_case, /_expect_failure
      (it.expects(['A', 'b'])).toEqual, ['a'], /fold_case, /_expect_failure

    it = suite.test('/FOLD_CASE can be negated')
      (it.expects('Hello'))._not_.toEqual, 'world', /fold_case
      (it.expects('Hello'))._not_.toEqual, 'hello', /fold_case, /_expect_failure

    it = suite.test('/FOLD_CASE raises an error for non strings')
      (it.expects(toequal_spec_raises(it.expects(42), 42))).toBeTrue
      (it.expects(toequal_spec_raises(it.expects('a'), 42))).toBeTrue

    it = suite.test('requires a value')
      (it.expects(it.expects())).toThrow, 'toEqual', 1

    it = suite.test('compares scalars')
      (it.expects(1)).toEqual, 1
      (it.expects(1))._not_.toEqual, 2
      (it.expects(5)).toEqual, 4, /_expect_failure
      (it.expects(5))._not_.toEqual, 5, /_expect_failure

    it = suite.test('compares arrays and checks shape')
      (it.expects([1, 2, 3])).toEqual, [1, 2, 3]
      (it.expects([[1, 2], [3, 4]]))._not_.toEqual, [1, 2, 3, 4]

    it = suite.test('compares scalars and arrays')
      (it.expects(1)).toEqual, [1]
      (it.expects('this')).toEqual, ['this']

    it = suite.test('compares lists and arrays')
      (it.expects(1)).toEqual, list(1)
      (it.expects(list('this'))).toEqual, ['this']
      (it.expects(list('this'))).toEqual, list(['this'])
      (it.expects(list('fortyTwo', 42))).toEqual, list('fortyTwo', 42)
      (it.expects(['fortyTwo', '42'])).toEqual, ['fortyTwo', '42']
      (it.expects(list('fortyTwo', '42'))).toEqual, ['fortyTwo', '42']
      (it.expects(['fortyTwo', '42'])).toEqual, list('fortyTwo', '42')

    it = suite.test('compares hashes, orderedhashes, and dictionaries')
      (it.expects(hash('one', 2, 'three', 4))).toEqual, hash('three', 4, 'one', 2)
      (it.expects(orderedhash('one', 2, 'three', 4))).toEqual, hash('three', 4, 'one', 2)
      (it.expects(dictionary('one', 2, 'three', 4))).toEqual, hash('three', 4, 'one', 2)
      (it.expects(hash('fortyTwo', 42))).toEqual, hash('fortyTwo', 42)
      (it.expects(orderedhash('fortyTwo', 42))).toEqual, orderedhash('fortyTwo', 42)
      (it.expects(dictionary('fortyTwo', 42))).toEqual, dictionary('fortyTwo', 42)
      e = it.expects(hash('one', 2, 'three', 4))
      (it.expects(e._not_)).toThrow, 'toEqual', list(['this'])

l.generateTestSummary
end
