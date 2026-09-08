;+
; :Returns:
;   MyClass
;
; :Keywords:
;   kw2: in, optional, Boolean
;     Placeholder docs for argument, keyword, or property
;
;-
function MyClass::init, kw2 = kw2
  compile_opt idl2

  ; hover-help function
  !null = MyClass()

  ; hover-help keywords
  !null = MyClass(kw2 = !true)

  return, 1
end