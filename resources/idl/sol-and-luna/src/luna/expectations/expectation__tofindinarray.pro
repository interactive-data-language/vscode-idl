;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

;+
; :Description:
;   Similar to luna__expectation::toContain, this
;   method verifies that an array has the value `compare` as
;   one of the elements. This method is specifically restricted
;   to arrays.
;
; :Arguments:
;   compare: in, required, any
;     Specify a scalar value to find in the expectation value array.
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
;   (it.expects([1, 2, 42])).toFindInArray, 42
;   ```
;
;-
pro expectation::toFindInArray, compare, $
  _expect_failure = _expect_failure
  compile_opt idl2, hidden
  if ~self.debug then on_error, 2
  self._setCallLine

  ; validate inputs
  sol_validate, hash('compare', ['required'])

  ; make sure that we have a value
  if ~self.hasValue then begin
    message, 'Expectation value not set, required!', level = -1
  endif

  ; make sure our value is an array
  if ~isa(self.value[0], /array) then begin
    message, 'Expectation value is not an array, required!', level = -1
  endif

  ; make sure we are comparing a scalar
  if ~isa(compare, /scalar) then begin
    message, 'Value to find is not a scalar, required!', level = -1
  endif

  ; check for value
  idx = where(self.value[0] eq compare, countMatch)

  ; process exception
  ; process the expectation
  self._processExpectation, $
    'to find in array', $
    (countMatch eq 0), $
    expected = 'to find ' + self._describe(compare), $
    received = self._describeValue(), $
    _expect_failure = _expect_failure
end
