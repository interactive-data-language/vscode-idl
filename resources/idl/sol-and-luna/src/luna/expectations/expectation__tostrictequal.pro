;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

;+
; :Description:
;   Verifies that an expectation value is equal to a compare value
;   and also has the same type and dimensions. Unlike
;   ```idl toEqual``` this does not treat `1` and `1b` as equal and
;   does not compare lists to arrays or hashes to dictionaries.
;
;   Nested lists, hashes, orderedhashes, dictionaries, and
;   structures are compared recursively.
;
; :Arguments:
;   compare: in, required, any
;     Specify a value to compare against.
;
; :Keywords:
;   _expect_failure: in, optional, Boolean
;     If the test fails for some reason, set this to
;     force passing because we expected failure. This
;     keyword is for internal use only.
;
; :Examples:
;
;   ```idl
;   (it.expects(1b)).toStrictEqual, 1b
;   (it.expects(1b))._not_.toStrictEqual, 1
;   (it.expects([1, 2]))._not_.toStrictEqual, list(1, 2)
;   ```
;
;-
pro expectation::toStrictEqual, compare, $
  _expect_failure = _expect_failure
  compile_opt idl2, hidden
  if ~self.debug then on_error, 2
  self._setCallLine

  ; make sure that we have a value
  if ~self.hasValue then begin
    message, 'Expectation value not set, required!', level = -1
  endif

  ; validate inputs
  sol_validate, hash('compare', ['required'])

  ; process the expectation
  self._processExpectation, 'to be strictly equal', ~expectation_strict_equal(self.value[0], compare), $
    expected = self._describe(compare), $
    received = self._describeValue(), $
    _expect_failure = _expect_failure
end
