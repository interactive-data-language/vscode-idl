;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

;+
; :Description:
;   Verifies that the typename on an expectation value
;   matches the specific name. This uses the ```idl typename()```
;   function behind the scenes.
;
; :Arguments:
;   type: in, required, String
;     Specify a typename that an expectation
;     value should have.
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
;   (it.expects('some string')).toBeTypename, 'string'
;   (it.expects(42)).toBeTypename, 'long'
;   ```
;
;-
pro expectation::toBeTypename, type, $
  _expect_failure = _expect_failure
  compile_opt idl2, hidden
  if ~self.debug then on_error, 2
  self._setCallLine

  ; make sure that we have a value
  if ~self.hasValue then begin
    message, 'Expectation value not set, required to check type!', level = -1
  endif

  ; validate inputs
  sol_validate, hash('type', ['required', 'string'])

  ; get our compare type
  compareType = strupcase(strtrim(type, 2))

  ; process the expectation
  self._processExpectation, $
    'to be typename ' + strlowcase(strtrim(type, 2)), $
    ~(typename(self.value[0]) eq compareType), $
    received = strlowcase(typename(self.value[0])), $
    _expect_failure = _expect_failure
end
