;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

;+
; :Description:
;   Verifies that the expectation value (an array or list of real
;   numbers or strings) is sorted. Equal neighbors are allowed, and
;   arrays with fewer than two elements are always sorted. Multi
;   dimensional arrays are checked in memory order.
;
; :Keywords:
;   _expect_failure: in, optional, Boolean
;     If the test fails for some reason, set this to
;     force passing because we expected failure. This
;     keyword is for internal use only.
;   descending: in, optional, Boolean
;     Set this keyword to check for descending order instead.
;
; :Examples:
;
;   ```idl
;   (it.expects([1, 2, 2, 3])).toBeSorted
;   (it.expects([3, 2, 1])).toBeSorted, /descending
;   (it.expects(['b', 'a']))._not_.toBeSorted
;   ```
;
;-
pro expectation::toBeSorted, $
  descending = descending, $
  _expect_failure = _expect_failure
  compile_opt idl2, hidden
  if ~self.debug then on_error, 2
  self._setCallLine

  ; make sure that we have a value
  if ~self.hasValue then begin
    message, 'Expectation value not set, required!', level = -1
  endif

  ; get the values as an array
  value = self.value[0]
  if (size(value, /type) eq 11) then begin
    if ~isa(value, 'list') then message, 'Expectation value must be an array or list!', level = -1
    if (value.count() eq 0) then begin
      self._processExpectation, 'to be sorted', 0, _expect_failure = _expect_failure
      return
    endif
    value = value.toArray()
  endif
  if ~(isa(value, /string) or (isa(value, /number) and ~isa(value, /complex))) then begin
    message, 'Expectation value must contain real numbers or strings!', level = -1
  endif

  ; compare each element to the one before it
  n = n_elements(value)
  pass = 1
  if (n gt 1) then begin
    value = value[*]
    if keyword_set(descending) then begin
      pass = min(value[1 : *] le value[0 : n - 2]) eq 1
    endif else begin
      pass = min(value[1 : *] ge value[0 : n - 2]) eq 1
    endelse
  endif

  ; process the expectation
  self._processExpectation, keyword_set(descending) ? 'to be sorted descending' : 'to be sorted', ~pass, $
    received = self._describeValue(), $
    _expect_failure = _expect_failure
end
