;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

;+
; :Description:
;   Verifies that the expectation value (an array, list, or the values
;   of a hash, orderedhash, or dictionary) contains an item equal to the
;   compare value. Unlike ```idl toContain```, structures, lists, hashes
;   and other nested values are compared by their contents. Scalar
;   numbers and strings are compared with ```idl eq```.
;
; :Arguments:
;   compare: in, required, any
;     Specify the item to look for.
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
;   (it.expects(list({a: 1}, {a: 2}))).toContainEqual, {a: 2}
;   (it.expects(list(list(1, 2), list(3)))).toContainEqual, list(3)
;   ```
;
;-
pro expectation::toContainEqual, compare, $
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
  self._processExpectation, 'to contain an equal item', ~self._containsItem(compare), $
    expected = 'to contain ' + self._describe(compare), $
    received = self._describeValue(), $
    _expect_failure = _expect_failure
end
