;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

;+
; :Description:
;   Verifies that the expectation value (an array, list, or the values
;   of a hash, orderedhash, or dictionary) contains every one of the
;   values specified. See ```idl toContainEqual``` for how items
;   are compared.
;
; :Arguments:
;   values: in, required, Array<any> | List<any>
;     Specify the items to look for. Must contain at least one item.
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
;   (it.expects(['a', 'b', 'c'])).toContainAll, ['a', 'c']
;   (it.expects([1, 2, 3]))._not_.toContainAll, [1, 4]
;   ```
;
;-
pro expectation::toContainAll, values, $
  _expect_failure = _expect_failure
  compile_opt idl2, hidden
  if ~self.debug then on_error, 2
  self._setCallLine

  ; make sure that we have a value
  if ~self.hasValue then begin
    message, 'Expectation value not set, required!', level = -1
  endif

  ; validate inputs
  sol_validate, hash('values', ['required'])
  items = isa(values, 'list') ? values : list(values, /extract)
  if (items.count() eq 0) then message, 'At least one value is required!', level = -1

  ; every item must be found
  pass = 1
  foreach item, items do begin
    if ~self._containsItem(item) then begin
      pass = 0
      break
    endif
  endforeach

  ; process the expectation
  self._processExpectation, 'to contain all values', ~pass, $
    received = self._describeValue(), $
    _expect_failure = _expect_failure
end
