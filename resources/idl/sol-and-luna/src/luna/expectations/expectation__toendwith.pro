;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

;+
; :Description:
;   Verifies that the expectation value ends with a suffix. For an
;   array of strings, every element must end with the suffix.
;
; :Arguments:
;   suffix: in, required, String
;     Specify the string that the value should end with.
;
; :Keywords:
;   _expect_failure: in, optional, Boolean
;     If the test fails for some reason, set this to
;     force passing because we expected failure. This
;     keyword is for internal use only.
;   fold_case: in, optional, Boolean
;     Set this keyword to ignore case.
;
; :Examples:
;
;   ```idl
;   (it.expects('image.tif')).toEndWith, '.tif'
;   (it.expects('IMAGE.TIF')).toEndWith, '.tif', /fold_case
;   ```
;
;-
pro expectation::toEndWith, suffix, $
  fold_case = fold_case, $
  _expect_failure = _expect_failure
  compile_opt idl2, hidden
  if ~self.debug then on_error, 2
  self._setCallLine

  ; make sure that we have a value
  if ~self.hasValue then begin
    message, 'Expectation value not set, required!', level = -1
  endif
  if ~isa(self.value[0], /string) then begin
    message, 'Expectation value is not a string, required!', level = -1
  endif

  ; validate inputs
  sol_validate, hash('suffix', ['required', 'string'])

  ; check each string
  value = self.value[0]
  if keyword_set(fold_case) then begin
    value = strlowcase(value)
    suffix = strlowcase(suffix)
  endif
  pos = strpos(value, suffix, /reverse_search)
  pass = min((pos ge 0) and (pos eq (strlen(value) - strlen(suffix)))) eq 1
  if (strlen(suffix) eq 0) then pass = 1

  ; process the expectation
  self._processExpectation, 'to end with ' + suffix, ~pass, $
    received = self._describeValue(), $
    _expect_failure = _expect_failure
end
