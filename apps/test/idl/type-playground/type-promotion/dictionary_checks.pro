;+
;-
pro dictionary_checks
  compile_opt idl2

  a = 1 + dictionary()

  b = dictionary() + list()

  c = dictionary() + hash()

  d = dictionary() + orderedhash()

  e = dictionary() + dictionary()
end