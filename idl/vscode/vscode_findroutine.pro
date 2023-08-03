;+
; :Description:
;   Checks to see if a given routine is a function or procedure.
;
; :Arguments:
;   name: in, required, String
;     Specify the name of a routine to retrieve details for
;
;-
pro vscode_findRoutine, name
  compile_opt idl2, hidden
  on_error, 2
  vscode_verifyPath

  ; check for procedure
  isPro = !false
  catch, err
  if (err ne 0) then begin
    catch, /cancel
  endif else begin
    proInfo = routine_info(name, /source)
    isPro = proInfo.path ? !true : !false
  endelse

  ; check for function
  isFunc = !false
  catch, err
  if (err ne 0) then begin
    catch, /cancel
  endif else begin
    funcInfo = routine_info(name, /source, /function)
    isFunc = funcInfo.path ? !true : !false
  endelse

  ; print routine information
  print, json_serialize(hash('procedure', isPro, 'function', isFunc))
end