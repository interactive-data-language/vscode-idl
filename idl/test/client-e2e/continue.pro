;+
; :Arguments:
;   a: in, required, Array<Number>
;     First argument
;   b: in, required, Array<Number>
;     Second argument
;
;-
pro mypro, a, b
  compile_opt idl2
  stop
  c = a + b
  if !true then stop
end

; main level
compile_opt idl2

if !true then stop
if !true then stop
if !true then stop
if !true then stop
mypro, 17, 25
if !true then stop

end