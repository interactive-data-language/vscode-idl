;+
; :struct1:
;
; :struct2:
;
; :struct3:
;   prop: any
;     Placeholder docs for argument, keyword, or property
;
;-
pro docs_overrides2__define
  compile_opt idl2

  !null = {struct1}

  !null = {struct2}

  !null = {struct3, prop: 'socool'}
end