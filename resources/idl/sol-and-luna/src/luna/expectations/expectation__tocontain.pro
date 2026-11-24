;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

;+
; :Description:
;   Verifies that an expectation value contains
;   the specified variable value. Behind the scenes
;   this uses the ```idl obj.where()``` method. The following
;   data types can be used as expectation values:
;
;   - array
;   - list
;   - hash
;   - orderedhash
;   - dictionary
;
; :Arguments:
;   compare: in, required, any
;     Specify a value that an expectation value should contain.
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
;   (it.expects([1, 2, 42])).toContain, 42
;   (it.expects(list(1, 2, 42))).toContain, 42
;   (it.expects(hash('42', 42))).toContain, '42'
;   (it.expects(orderedhash('42', 42))).toContain, '42'
;   (it.expects(dictionary('fortyTwo', 42))).toContain, 'fortyTwo'
;   ```
;
;-
pro expectation::toContain, compare, $
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

  ; filter out any data types that we cant process
  if isa(self.value[0], /string) and ~isa(self.value[0], /array) then begin
    message, 'Expectation value is a string, use the ToContainString or ToMatchRegex expectations instead', level = -1
  endif

  ; check for value
  idx = (self.value[0]).where(compare)

  ; process exception
  ; process the expectation
  self._processExpectation, $
    'to contain value', $
    (idx eq !null), $
    expected = 'to contain ' + self._describe(compare), $
    received = self._describeValue(), $
    _expect_failure = _expect_failure
end
