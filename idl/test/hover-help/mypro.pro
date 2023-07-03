pro mypro0, var1, kw1 = kw1
  compile_opt idl2
  ;+ first awesome variable with docs
  a = 42
  ;+
  ; First big comment block here
  ; like a great code writer
  ;-
  b = 42
end

;+
; My procedure
;
; :Args:
;  var1: in, required, any
;    My favorite thing
;
; :Keywords:
;  kw1: in, optional, type=boolean
;    Super Cool flag
;
;-
pro mypro, var1, kw1 = kw1
  compile_opt idl2
  ;+ Second awesome variable with docs
  a = 42
  ;+
  ; Second big comment block here
  ; like a great code writer
  ;-
  b = 42
end