;+
; :Description:
;   Constructor
;
; :Returns:
;   myclass
;
;-
function myclass::Init
  compile_opt idl2

  return, 1
end

;+
; :Returns:
;   any
;
; :Keywords:
;   kw: out, optional, Array<Number>
;     Placeholder docs for argument, keyword, or property
;
;-
function myclass::method, kw = kw
  compile_opt idl2
  return, 1
end

;+
; :Keywords:
;   kw: out, optional, ENVIRaster
;     Placeholder docs for argument, keyword, or property
;
;-
pro myclass::method, kw = kw
  compile_opt idl2
end

;+
; :Description:
;   Class definition procedure
;
;-
pro myclass__define
  compile_opt idl2

  struct = {myclass}
end

; main level program
compile_opt idl2

; go to init method above
!null = obj_new('myclass',)

; nothing to do
!null = obj_new('enviraster', )

; do nothing apart from what we have already
!null = obj_new()

; if first arg and single quote, then send names
!null = obj_new('')

; if first arg and double quote, then send names
!null = obj_new("")

; if first arg and literal string, then send names
!null = obj_new(``)

end