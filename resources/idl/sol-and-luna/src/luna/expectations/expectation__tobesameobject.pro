;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

;+
; :Description:
;   Verifies that the expectation value is the exact same object
;   reference as the compare value. This differs from
;   ```idl toEqual``` which compares the contents of objects such
;   as lists and hashes.
;
; :Arguments:
;   compare: in, required, Object<any>
;     Specify the object reference to compare against.
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
;   a = list(1, 2)
;   b = list(1, 2)
;   (it.expects(a)).toBeSameObject, a
;   (it.expects(a))._not_.toBeSameObject, b
;   ```
;
;-
pro expectation::toBeSameObject, compare, $
  _expect_failure = _expect_failure
  compile_opt idl2, hidden
  if ~self.debug then on_error, 2
  self._setCallLine

  ; make sure that we have a value
  if ~self.hasValue then begin
    message, 'Expectation value not set, required!', level = -1
  endif

  ; validate inputs (checked by hand because a null object is a valid comparison)
  sol_validate, hash('compare', ['required'])
  if (size(compare, /type) ne 11) then begin
    message, 'Compare value is not an object reference!', level = -1
  endif

  ; make sure we have the right typecode
  if (size(self.value[0], /type) ne 11) then begin
    message, 'Expectation value set, but is not an object reference!', level = -1
  endif

  ; compare heap identifiers because objects such as lists overload the EQ operator
  same = 0
  if obj_valid(self.value[0]) and obj_valid(compare) then begin
    same = obj_valid(self.value[0], /get_heap_identifier) eq obj_valid(compare, /get_heap_identifier)
  endif

  ; process the expectation
  self._processExpectation, 'to be the same object', ~same, $
    received = self._describeValue(), $
    _expect_failure = _expect_failure
end
