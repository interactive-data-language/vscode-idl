;+
; :Arguments:
;   arg1: in, required, Array<Number | String>
;     Placeholder docs for argument, keyword, or property
;   arg2: in, required, List<Number>
;     Placeholder docs for argument, keyword, or property
;   arg3: in, required, Hash<any>
;     Placeholder docs for argument, keyword, or property
;   arg4: in, required, OrderedHash<Byte>
;     Placeholder docs for argument, keyword, or property
;   arg5: in, required, Dictionary<ENVIRaster>
;     Placeholder docs for argument, keyword, or property
;
;-
pro index_problems, arg1, arg2, arg3, arg4, arg5
  compile_opt idl3

  ; for arrays
  !null = arg1[plot()]
  !null = arg1[1j]
  !null = arg1[1i]
  !null = arg1[1di]
  !null = arg1[1dj]

  ; for lists
  !null = arg2[plot()]
  !null = arg2[1j]
  !null = arg2[1i]
  !null = arg2[1di]
  !null = arg2[1dj]

  ; for hashes
  !null = arg3[plot()]
  !null = arg3[1j]
  !null = arg3[1i]
  !null = arg3[1di]
  !null = arg3[1dj]

  ; for ordered hashes
  !null = arg4[plot()]
  !null = arg4[1j]
  !null = arg4[1i]
  !null = arg4[1di]
  !null = arg4[1dj]

  ; for dictionaries
  !null = arg5[plot()]
  !null = arg5[1j]
  !null = arg5[1i]
  !null = arg5[1di]
  !null = arg5[1dj]
end