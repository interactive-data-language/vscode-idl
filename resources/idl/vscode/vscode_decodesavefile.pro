;+
; :Private:
;
; :Description:
;   Prints JSON output summarizing key items in IDL SAVE files
;
; :Arguments:
;   uri: in, required, String
;     Specify the fully-qualified filepath for a SAVE file
;
;-
pro vscode_decodeSaveFile, uri
  compile_opt idl2, hidden
  on_error, 2
  vscode_verifyPath

  catch, err
  if (err ne 0) then begin
    catch, /cancel
    print, '{"vars":[],"pros":[],"funcs":[]}'
    return
  endif

  ;+ load our save file
  save = IDL_Savefile(uri)

  ;+ content structure for the savefile
  content = save.contents()

  ;+ lookup for our content in the SAVE file
  lookup = hash()
  lookup['vars'] = content.n_var eq 0 ? list() : strlowcase(save.names())
  lookup['pros'] = content.n_procedure eq 0 ? list() : save.names(/procedure)
  lookup['funcs'] = content.n_function eq 0 ? list() : save.names(/function)

  ;+ cleanup
  save.cleanup

  ; print output
  print, json_serialize(lookup)
end