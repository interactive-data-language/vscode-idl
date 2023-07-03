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
  !null = 42
  c = a + b
  !null = 42
end

; main level
compile_opt idl2

mypro, 17, 25

end