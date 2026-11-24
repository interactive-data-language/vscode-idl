;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

;+
; :Description:
;   Expectation test that makes sure an expectation value
;   matches the type or array of types specified.
;
;   - string
;   - number
;   - file
;   - null
;   - scalar
;   - array
;   - boolean
;   - complex
;   - float
;   - integer
;   - object
;
;   And you can specify any other value that works with
;   IDL's ```idl isa()``` function.
;
; :Arguments:
;   type: in, required, String | Array<String>
;     Specify a type or array of types that an expectation
;     value should have.
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
;   (it.expects(42)).toBeA, 'number'
;   (it.expects(42)).toBeA, ['number', 'long']
;
;   (it.expects([42, 42])).toBeA, ['number', 'long', 'array']
;   (it.expects([42, 42]))._not_.toBeA, ['string', 'array']
;
;   p = plot(/BUFFER, /TEST)
;   (it.expects(p)).toBeA, 'plot'
;   (it.expects(p)).toBeA, ['plot', 'object']
;   ```
;
;-
pro expectation::toBeA, type, $
  _expect_failure = _expect_failure
  compile_opt idl2, hidden
  if ~self.debug then on_error, 2
  self._setCallLine

  ; make sure that we have a value
  if ~self.hasValue then begin
    message, 'Expectation value not set, required to check type!', level = -1
  endif

  ; validate input based on the type
  case (1) of
    isa(type, /array): begin
      sol_validate, hash('type', ['required', 'string', 'array'])
    end
    else: begin
      sol_validate, hash('type', ['required', 'string'])
    end
  endcase

  ; get our compare types
  compareType = strlowcase(strtrim(type, 2))

  ; get the number of types that we need to match
  nMatch = n_elements(compareType)

  ; determine how many items we match
  tot = 0
  foreach type, compareType do tot += self._isa(type)

  ; build the string
  if (nMatch gt 1) then begin
    str = 'to be types '
    foreach type, compareType, idx do begin
      case (1) of
        (idx eq 0): str += type
        (idx eq (nMatch - 1)): str += ', and ' + type
        else: str += ', ' + type
      endcase
    endforeach
  endif else begin
    str = 'to be type ' + compareType[0]
  endelse

  ; process the expectation
  self._processExpectation, str, ~(tot eq nMatch), $
    received = strlowcase(typename(self.value[0])), $
    _expect_failure = _expect_failure
end
