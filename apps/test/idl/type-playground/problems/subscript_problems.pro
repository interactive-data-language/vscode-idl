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
pro subscript_problems, arg1, arg2, arg3, arg4, arg5
  compile_opt idl3

  ; for arrays
  a1 = arg1[*]
  a2 = arg1[0, 1, *]
  a3 = arg1[0, 1, 2]
  a4 = arg1[0 : -1 : 1]
  a5 = arg1[0, 1, *]

  ; for lists
  l1 = arg2[*]
  l2 = arg2[0, 1, *]
  l3 = arg2[0, 1, 2]
  l4 = arg2[0 : -1 : 1]
  l5 = arg2[0, 1, *]

  ; for hashes
  h1 = arg3[*]
  h2 = arg3[0, 1, *]
  h3 = arg3[0, 1, 2]
  h4 = arg3[0 : -1 : 1]
  h5 = arg3[0, 1, *]

  ; for ordered hashes
  oh1 = arg4[*]
  oh2 = arg4[0, 1, *]
  oh3 = arg4[0, 1, 2]
  oh4 = arg4[0 : -1 : 1]
  oh5 = arg4[0, 1, *]

  ; for dictionaries
  d1 = arg5[*]
  d2 = arg5[0, 1, *]
  d3 = arg5[0, 1, 2]
  d3 = arg5[0 : -1 : 1]
  d5 = arg5[0, 1, *]
end