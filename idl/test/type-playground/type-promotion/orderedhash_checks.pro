;+
;-
pro orderedhash_checks
  compile_opt idl2

  a = 1 + orderedhash()

  b = orderedhash() + list()

  c = orderedhash() + hash()

  d = orderedhash() + orderedhash()

  e = orderedhash() + dictionary()
end