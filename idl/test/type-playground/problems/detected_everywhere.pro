;+
; :Arguments:
;   arg3: in, required, Hash<any>
;     Placeholder docs for argument, keyword, or property
;   arg4: in, required, OrderedHash<Byte>
;     Placeholder docs for argument, keyword, or property
;
;-
pro detected_everywhere, arg3, arg4
  compile_opt idl3

  ; validation edge cases
  ; same variables should always have validation applied, but not always saved
  dup1 = arg3[arg4]
  dup1 = arg3[arg4]

  ; anything with assignment before should validate
  !x.charsize = arg3[arg4]
  !null = arg3[arg4]

  ; arguments and keywords
  a = polot1(arg3[arg4], $
    arg3[arg4], $
    thing = arg3[arg4], $
    thang = arg3[arg4])

  ; left-side of the equation
  arg3[arg4] = 5
  (arg3[arg4]) = 5
  (myfunc(arg3[arg4])) = 5
  !null = (myfunc2(arg3[arg4]))
  !null = (myfunc3(arg3[arg4])) + 1

  ; arguments
  a = polot2(arg3[arg4], arg3[arg4])
end