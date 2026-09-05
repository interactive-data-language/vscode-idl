;+
;-
pro hash_checks
  compile_opt idl2

  a = 1 + hash()

  b = hash() + list()

  c = hash() + hash()

  d = hash() + orderedhash()

  e = hash() + dictionary()
end