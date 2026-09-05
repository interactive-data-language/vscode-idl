;+
;-
pro list_checks
  compile_opt idl2

  a = 1 + list()

  b = list() + list()

  c = list() + hash()

  d = list() + orderedhash()

  e = list() + dictionary()
end