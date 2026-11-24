;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

;+
; :Description:
;   Verifies that the expectation value (a structure) has a tag. Tag
;   names are not case sensitive.
;
; :Arguments:
;   name: in, required, String | Array<String>
;     Specify the tag to look for. When an array is given, every tag
;     must exist.
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
;   (it.expects({a: 1, b: 2})).toHaveTag, 'a'
;   (it.expects({a: 1, b: 2})).toHaveTag, ['A', 'b']
;   (it.expects({a: 1}))._not_.toHaveTag, 'c'
;   ```
;
;-
pro expectation::toHaveTag, name, $
  _expect_failure = _expect_failure
  compile_opt idl2, hidden
  if ~self.debug then on_error, 2
  self._setCallLine

  ; make sure that we have a value
  if ~self.hasValue then begin
    message, 'Expectation value not set, required!', level = -1
  endif
  if (size(self.value[0], /type) ne 8) then begin
    message, 'Expectation value is not a structure, required!', level = -1
  endif

  ; validate inputs
  sol_validate, hash('name', ['required', 'string'])

  ; every tag must exist
  tags = tag_names(self.value[0])
  pass = 1
  foreach tag, strupcase(strtrim(name, 2)) do begin
    if (where(tags eq tag, /null) eq !null) then pass = 0
  endforeach

  ; process the expectation
  self._processExpectation, 'to have tag ' + strjoin(name, ', '), ~pass, $
    received = self._describeValue(), $
    _expect_failure = _expect_failure
end
