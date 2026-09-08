;+
; :Returns:
;   Number
;
;-
function myfunc
  compile_opt idl2

  return, 1
end

;+
; :Returns:
;   Array<Number>
;
;-
function myfunc2
  compile_opt idl2

  return, 1
end

;+
; :Arguments:
;   arg1: in, required, List<Number | String>
;     Placeholder docs for argument, keyword, or property
;   arg2: in, required, Array<Number>
;     Placeholder docs for argument, keyword, or property
;   arg3: in, required, Array<any>
;     Placeholder docs for argument, keyword, or property
;   arg4: in, required, Array<Byte>
;     Placeholder docs for argument, keyword, or property
;   arg5: in, required, Array<ENVIRaster>
;     Placeholder docs for argument, keyword, or property
;   arg6: in, required, any
;     Placeholder docs for argument, keyword, or property
;
;-
pro lists, arg1, arg2, arg3, arg4, arg5, arg6
  compile_opt idl3

  ; type args
  c = arg1[0]

  ; return array of type args
  d = arg1[arg2]

  ; return array
  e = arg1[*]

  ; return array
  f = arg1[0, 1, *]

  ; return type args
  g = arg1[myfunc()]

  ; return array
  h = arg1[myfunc2()]

  ; type args
  i = arg1[0, 1, 2]

  ; return array
  j = arg1[0, 1, myfunc2()]

  ; return array
  k = arg1[0 : -1 : 1]

  ; return array
  l = arg1[0, 1, *]

  ; return type args
  m = arg1[-1]

  ; any
  n = arg3[0]

  ; array of any
  o = arg3[myfunc2()]

  ; return array
  p = arg1[0, myfunc2(), 1]

  ; return array
  q = arg1[[1, 2, 3]]

  ; return type args
  r = arg1[1 + 2]

  ; return array
  s = arg1[1 + myfunc2()]

  ; return any
  t = arg1[plot()]

  ; return any
  u = arg1[1j]

  ; return any
  v = arg1[1i]

  ; return any
  w = arg1[1di]

  ; return any
  x = arg1[1dj]

  ; merge type args
  y = arg1 + arg3

  ; merge type args
  z = arg1 + arg4 + 1l

  ; merge type args
  a2 = arg1 + arg4 + 1

  ; merge type args
  b2 = arg1 + arg4 + arg5

  ; any
  c2 = arg1[arg6]

  ; any
  d2 = arg1 + arg4 + arg6
end