;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

;+
; :Description:
;   Verifies that the expectation value has a number of elements. Arrays
;   and strings use ```idl n_elements()``` while lists, hashes,
;   orderedhashes and dictionaries use their item count.
;
; :Arguments:
;   length: in, required, Int
;     Specify the number of elements expected, zero or greater.
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
;   (it.expects(findgen(100))).toHaveLength, 100
;   (it.expects(list(1, 2))).toHaveLength, 2
;   (it.expects(hash('a', 1)))._not_.toHaveLength, 2
;   ```
;
;-
pro expectation::toHaveLength, length, $
  _expect_failure = _expect_failure
  compile_opt idl2, hidden
  if ~self.debug then on_error, 2
  self._setCallLine

  ; make sure that we have a value
  if ~self.hasValue then begin
    message, 'Expectation value not set, required to check length!', level = -1
  endif

  ; validate input
  sol_validate, hash('length', ['required'])
  if ~isa(length, /integer, /scalar) or isa(length, /boolean) then begin
    message, 'Length must be a scalar integer!', level = -1
  endif
  if (length lt 0) then message, 'Length must be zero or greater!', level = -1

  ; process the expectation
  self._processExpectation, 'to have length ' + strtrim(length, 2), ~(self._count() eq length), $
    received = strtrim(self._count(), 2), $
    _expect_failure = _expect_failure
end
