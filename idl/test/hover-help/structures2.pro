;+
; :NYStruct:
;   prop1: Long
;     Favorite property
;   prop2: String
;     Second favorite property
;
;-
pro pro3__define
  compile_opt idl3
  ; compile option
  compOptDouble = 0

  !null = {NYStruct, prop1: 5, prop2: 6}

  a = {prop: 'string', val: compOptDouble}
end