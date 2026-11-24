;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

;+
; :Description:
;   Checks if IDL is running from an IDE (IDL for VS Code or the IDL Workbench),
;   which can open a file at a line number from a `file:line` path.
;
;   IDL for VS Code is detected with the `VSCODE_PID` environment variable.
;   The IDL Workbench is detected by looking for its bundled Java runtime in
;   the environment variable that IDL uses to find it.
;
;   ***TURNED OFF*** emoji issues in text moving around
;
; :Returns: Boolean
;
;-
function sol_is_workbench
  compile_opt idl2, hidden

  return, !false

  if (getenv('VSCODE_PID') ne '') then return, !true

  ps = '/'
  idlDir = (!dir).replace(path_sep(), ps)
  case !version.OS_FAMILY of
    'Windows': begin
      check = idlDir + ps + 'bin' + ps + 'bin.' + !version.arch + ps + 'jre' + ps + 'bin'
      search = (getenv('PATH')).replace(path_sep(), ps)
    end
    else: begin
      check = idlDir + ps + 'idlde' + ps + 'bin.' + !version.os + '.' + !version.arch + ps + 'jre' + ps + 'lib'
      search = getenv('LD_LIBRARY_PATH')
    end
  endcase

  return, strpos(strlowcase(search), strlowcase(check)) ne -1
end
