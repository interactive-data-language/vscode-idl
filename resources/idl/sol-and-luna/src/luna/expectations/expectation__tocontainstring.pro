;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

;+
; :Description:
;   Verifies that an expectation value contains
;   a sub string.
;
; :Arguments:
;   compare: in, required, String
;     Specify a string to find in the expectation value.
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
;   (it.expects('42')).toContain, '42'
;   ```
;
;-
pro expectation::toContainString, compare, $
  _expect_failure = _expect_failure
  compile_opt idl2, hidden
  if ~self.debug then on_error, 2
  self._setCallLine

  ; make sure that we have a value
  if ~self.hasValue then begin
    message, 'Expectation value not set, required!', level = -1
  endif
  if ~isa(self.value[0], /string, /scalar) then begin
    message, 'Expectation value not scalar string, required!', level = -1
  endif

  ; validate inputs
  sol_validate, hash('compare', ['required', 'string'])

  ; match the string
  pos = strpos(self.value[0], compare)

  ; process the expectation
  self._processExpectation, $
    'to contain string', $
    (pos eq -1), $
    expected = 'to contain ' + self._describe(compare), $
    received = self._describeValue(), $
    _expect_failure = _expect_failure
end
