;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

;+
; :Private:
;
; :Description:
;   Compares two items held by a collection. Scalar numbers and scalar
;   strings are compared with ```idl eq``` so that `2` equals `2.0`,
;   and anything else is compared with ```idl expectation_strict_equal()```.
;
; :Returns: Boolean
;
; :Arguments:
;   a: in, required, any
;     Specify the first item.
;   b: in, required, any
;     Specify the second item.
;
;-
function expectation_item_equal, a, b
  compile_opt idl2, hidden

  aNum = isa(a, /number, /scalar)
  bNum = isa(b, /number, /scalar)
  if aNum and bNum then return, a eq b
  if isa(a, /string, /scalar) and isa(b, /string, /scalar) then return, a eq b
  if aNum or bNum then return, 0
  return, expectation_strict_equal(a, b)
end
