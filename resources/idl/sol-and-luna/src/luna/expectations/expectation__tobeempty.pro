;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

;+
; :Description:
;   Verifies that the expectation value is empty. A string is empty
;   when it has no characters (every element, for an array) and a list,
;   hash, orderedhash or dictionary is empty when it has no items. Other
;   values always have at least one element.
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
;   (it.expects('')).toBeEmpty
;   (it.expects(list())).toBeEmpty
;   (it.expects(hash('a', 1)))._not_.toBeEmpty
;   ```
;
;-
pro expectation::toBeEmpty, $
  _expect_failure = _expect_failure
  compile_opt idl2, hidden
  if ~self.debug then on_error, 2
  self._setCallLine

  ; make sure that we have a value
  if ~self.hasValue then begin
    message, 'Expectation value not set, required to check if empty!', level = -1
  endif

  ; check by type
  if isa(self.value[0], /string) then begin
    empty = max(strlen(self.value[0])) eq 0
  endif else begin
    empty = self._count() eq 0
  endelse

  ; process the expectation
  self._processExpectation, 'to be empty', ~empty, $
    received = self._describeValue(), $
    _expect_failure = _expect_failure
end
