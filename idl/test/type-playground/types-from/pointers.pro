;+
; :Arguments:
;   arg1: in, required, Pointer<Number>
;     Placeholder docs for argument, keyword, or property
;   arg2: in, required, Array<Number>
;     Placeholder docs for argument, keyword, or property
;   arg3: in, required, Array<Pointer<ENVIRaster>>
;     Placeholder docs for argument, keyword, or property
;   arg4: in, required, Pointer<Number> | String
;     Placeholder docs for argument, keyword, or property
;   arg5: in, required, Pointer<any>
;     Placeholder docs for argument, keyword, or property
;   arg6: in, required, Pointer<String> | Pointer<Number>
;     Placeholder docs for argument, keyword, or property
;
;-
pro pointers, arg1, arg2, arg3, arg4, arg5, arg6
  compile_opt idl3

  ; number
  a = *arg1

  ; enviraster
  b = *arg3[0]

  ; and, unable to index
  c = arg1[0]

  ; any, unable to de-reference
  d = *5

  ; any, ambiguous de-reference
  e = *arg4

  ; any
  f = *arg5

  ; union of type args
  g = *arg6
end