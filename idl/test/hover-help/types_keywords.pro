;+
; :Arguments:
;   arg1: in, optional, ENVIRaster
;     Placeholder docs for argument or keyword
;
;-
pro auto_doc_example, arg1
  compile_opt idl2

  ; some really cool science!!
  !null = arg1.GetData(sub_rect = sub)

  arg1.SetData, bands = !null
end