pro auto_doc_example
  compile_opt idl2

  ; structure name
  a = {a: 'string', $
    b: `string`}

  ; hover help
  !null = a
  !null = a.a
  !null = a.b.length
  !null = a.invalid
end