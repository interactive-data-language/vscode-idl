;+
;+
; :NYStruct:
;   prop1: Long
;     Placeholder docs for argument, keyword, or property
;   prop2: String
;     Placeholder docs for argument, keyword, or property
;
;-
pro pro3__define
  compile_opt idl3

  !null = {NYStruct, prop1: 5, prop2: 6}
end

compile_opt idl2

a = {NYStruct, }

b = {NYStruct, prop1: }

!null = {NYStruct,prop1:something,prop2: byte1.}

; structure inheritance
!null = {mystruct, inherits }

end