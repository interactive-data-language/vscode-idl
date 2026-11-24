;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

;+
; :Description:
;   Verifies that the expectation value is an object that is an instance
;   of a class, including through inheritance (uses ```idl obj_isa()```).
;   Values that are not objects fail the expectation. For an array of
;   objects, every element must be an instance of the class.
;
; :Arguments:
;   type: in, required, String
;     Specify the class name to check, case insensitive.
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
;   (it.expects(list())).toBeInstanceOf, 'List'
;   (it.expects(orderedhash())).toBeInstanceOf, 'Hash'
;   (it.expects(42))._not_.toBeInstanceOf, 'List'
;   ```
;
;-
pro expectation::toBeInstanceOf, type, $
  _expect_failure = _expect_failure
  compile_opt idl2, hidden
  if ~self.debug then on_error, 2
  self._setCallLine

  ; make sure that we have a value
  if ~self.hasValue then begin
    message, 'Expectation value not set, required to check class!', level = -1
  endif

  ; validate input
  sol_validate, hash('type', ['required', 'string'])

  ; only objects can be instances (checked first because AND does not short circuit)
  pass = 0
  if (size(self.value[0], /type) eq 11) then begin
    pass = min(obj_isa(self.value[0], type)) eq 1
  endif

  ; process the expectation
  self._processExpectation, 'to be an instance of ' + type, ~pass, $
    received = strlowcase(typename(self.value[0])), $
    _expect_failure = _expect_failure
end
