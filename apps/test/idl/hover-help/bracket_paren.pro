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
pro hover_help_bracket_paren, arg1, arg2, arg3
  compile_opt idl3

  ; properties and methods
  !null = arg1[0].dim

  ; nested properties and methods
  !null = arg1[0].tname.contains()

  ; properties
  !null = (arg3).typecode

  ; properties and methods
  !null = (plot()).axis_style
  (plot()).save
end