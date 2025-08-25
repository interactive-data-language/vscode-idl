; do nothing

; no output from running this cell
;+
;-
pro test1
  compile_opt idl2

  print, 42
end

; if we have a main level, then run it
;+
; :Returns: any
;
;-
function foo1
  compile_opt idl2
  return, 42
end

; main level programs dont need to have an end
;+
; :Returns: any
;
;-
function foo2
  compile_opt idl2
  return, 42
end

; when we have a stop or syntax error, dont stop at it
;+
;-
pro mypro
  compile_opt idl2
  stop
end

; dont execute when we have syntax errors 2
;+
;-
pro syntax_error
  compile_opt idl2

  a =
end

; main level program
compile_opt idl2

; First three cells are empty and should not run or generate eny output

; run when we dont have compile opt or main level
arr = findgen(42)
help, arr

; we have compile_opt idl2, so we should have a long
a = 15
help, a

; run our procedure from above
test1

; run when we have compile opt and main level end

compile_opt idl2

print, 5

; Some

; Markdown

; we have compile_opt idl2, so we should have a long
a = 15
help, a

; we have compile_opt idl2, so we should have a long
a = 15
help, a

; embed graphics
p = plot(/test)

; run cell and dont capture image output (or any output)
!null = 42

; embed more than one graphic
p1 = plot(/test)
p2 = surface(/test)
p3 = barplot(/test)

; run routine with a stop
mypro

; verify we are at the main level (one item in stack trace)
print, n_elements(scope_traceback()), /implied_print

; dont execute when we have syntax errors 1
a =
end