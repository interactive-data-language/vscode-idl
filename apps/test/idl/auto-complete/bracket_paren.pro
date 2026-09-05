;+
; :Arguments:
;   arg1: in, required, Array<Number | String>
;     Placeholder docs for argument, keyword, or property
;   arg2: in, required, Array<Number>
;     Placeholder docs for argument, keyword, or property
;   arg3: in, required, Number
;     Placeholder docs for argument, keyword, or property
;
;-
pro auto_complete_bracket_paren, arg1, arg2, arg3
  compile_opt idl3

  ; properties and methods
  !null = arg1[0].

  ; nested properties and methods
  !null = arg1[0].tname.

  ; properties
  !null = (arg3).

  ; properties and methods
  !null = (plot()).
  (plot()).
end