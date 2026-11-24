;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

;+
; :Description:
;   Verifies that the expectation value (an array or list) has no
;   duplicate items. Items are compared as described for
;   ```idl toContainEqual```, and strings are case sensitive.
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
;   (it.expects([1, 2, 3])).toHaveUniqueValues
;   (it.expects(['a', 'A'])).toHaveUniqueValues
;   (it.expects([1, 2, 2]))._not_.toHaveUniqueValues
;   ```
;
;-
pro expectation::toHaveUniqueValues, $
  _expect_failure = _expect_failure
  compile_opt idl2, hidden
  if ~self.debug then on_error, 2
  self._setCallLine

  ; make sure that we have a value
  if ~self.hasValue then begin
    message, 'Expectation value not set, required!', level = -1
  endif

  value = self.value[0]
  if (size(value, /type) eq 11) and ~isa(value, 'list') then begin
    message, 'Expectation value must be an array or list!', level = -1
  endif

  ; simple arrays can be sorted, anything else is compared item by item
  pass = 1
  if (isa(value, /string) or isa(value, /number)) and ~isa(value, /complex) then begin
    n = n_elements(value)
    if (n gt 1) then pass = n_elements(uniq(value, sort(value))) eq n
  endif else begin
    items = isa(value, 'list') ? value : list(value, /extract)
    for i = 0, items.count() - 2 do begin
      for j = i + 1, items.count() - 1 do begin
        if expectation_item_equal(items[i], items[j]) then pass = 0
      endfor
    endfor
  endelse

  ; process the expectation
  self._processExpectation, 'to have unique values', ~pass, $
    received = self._describeValue(), $
    _expect_failure = _expect_failure
end
