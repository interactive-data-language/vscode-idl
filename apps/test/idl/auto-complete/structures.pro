pro auto_doc_example
  compile_opt idl2

  ; structure name
  a = {a: 'string', $
    b: `string`}

  ; auto complete
  !null = a.
  !null = a.b.
  !null = a.b.length.

  ; structure names
  !null = {}
  !null = {idl}
end