;+
; :Returns: Hash<String>
;
;-
function getNameOverrides
  compile_opt idl2, hidden

  ; overrides for names
  nameOverride = orderedhash(/fold_case)
  nameOverride['idlunit'] = 'IDLUnit'
  nameOverride['enviroi'] = 'ENVIROI'
  nameOverride['envinitf'] = 'ENVINITF'
  nameOverride['enviui'] = 'ENVIUI'
  nameOverride['idl_primitive'] = 'IDL_Primitive'
  nameOverride['idl_base64'] = 'IDL_Base64'
  nameOverride['idl_validname'] = 'IDL_ValidName'
  nameOverride['idlexbr_assistant'] = 'IDLExBr_Assistant'
  nameOverride['idlitsys_createtool'] = 'IDLITSys_CreateTool'
  nameOverride['envi'] = 'envi'
  nameOverride['idl_hashvar'] = 'idl_hashvar'

  ; typo in docs for 9.1
  nameOverride['cli_progres:initialize'] = 'CLI_Progress::Initialize'

  return, nameOverride
end
