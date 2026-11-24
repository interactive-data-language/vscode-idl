;+
; :Description:
;   Adds two numbers, used by `addition_example.task` for testing IDL tasks
;   with Luna.
;
; :Keywords:
;   a: in, required, Int
;     First value to add
;   b: in, required, Int
;     Second value to add
;   c: out, required, Int
;     Sum of `a` and `b`
;
;-
pro addition, a = a, b = b, c = c
  compile_opt idl2, hidden

  c = a + b
end
