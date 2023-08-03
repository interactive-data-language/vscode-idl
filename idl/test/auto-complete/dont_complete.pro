
pro myclass::mypro, a, b, c, kw = 
  compile_opt idl2

end

pro mypro, a, b, c, kw = 
  compile_opt idl2

end

compile_opt idl2

; in comments

; in comment blocks
;+
;-

; in strings
a = 'something'
a = "something"
a = `something`

; line continuations
a = 5 + $ 
  6

!null = 42

end