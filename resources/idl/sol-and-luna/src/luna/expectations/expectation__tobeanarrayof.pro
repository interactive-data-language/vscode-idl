;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

;+
; :Description:
;   Verifies that the expectation value is an array whose type matches
;   the type specified. Accepts the same type names as ```idl toBeA```.
;
; :Arguments:
;   type: in, required, String
;     Specify the type that the array should have.
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
;   (it.expects(['a', 'b'])).toBeAnArrayOf, 'string'
;   (it.expects([1, 2, 3])).toBeAnArrayOf, 'number'
;   (it.expects('a'))._not_.toBeAnArrayOf, 'string'
;   ```
;
;-
pro expectation::toBeAnArrayOf, type, $
  _expect_failure = _expect_failure
  compile_opt idl2, hidden
  if ~self.debug then on_error, 2
  self._setCallLine

  ; make sure that we have a value
  if ~self.hasValue then begin
    message, 'Expectation value not set, required to check type!', level = -1
  endif

  ; validate input
  sol_validate, hash('type', ['required', 'string'])

  ; check the dimensions first, then the type
  compareType = strlowcase(strtrim(type, 2))
  pass = self._isArray()
  if pass then pass = self._isa(compareType)

  ; process the expectation
  self._processExpectation, 'to be an array of ' + compareType, ~pass, $
    received = self._describeValue(), $
    _expect_failure = _expect_failure
end
