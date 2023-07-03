;+
;-
pro struct_checks
  compile_opt idl2

  str = {a: 42}

  a = 1 + str

  b = str + {a: 42}

  c = str + list()

  d = str + hash()

  e = str + orderedhash()

  f = str + dictionary()
end