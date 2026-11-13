;+
; :Arguments:
;   type: in, required, 'idl_tool_workflows' | 'envi_tool_workflows'
;     Type of tool workflows we are saving
;   dir: in, required, String
;     Package directory
;   metadata: in, required, Hash<any>
;     Package metadata
;   toolWorkfows: in, required, List<Hash<any>>
;     The tool workflows that we need to register
;
;-
pro vscode_createManifest_manageToolWorkflows, type, dir, metadata, toolWorkfows
  compile_opt idl2, hidden
  on_error, 2

  ; return if nothing to save
  if (n_elements(toolWorkfows) eq 0) then return

  ;+ create prompt metadata
  workflowMeta = orderedhash()

  ; process each configured tool workflow
  foreach workflow, toolWorkfows do begin
    ;+ get path
    workflowUri = strjoin([dir, workflow['source']], path_sep())

    ; make sure it exists
    if ~file_test(workflowUri) then message, `Declared tool workflow file doesn't exist: ${workflow}`

    ;+ strings of workflow file
    strings = strarr(file_lines(workflowUri))
    openr, lun, workflowUri, /get_lun
    readf, lun, strings
    free_lun, lun

    ; save task definition
    workflowMeta[workflow['name']] = strjoin(strings, `\n`)
  endforeach

  ; save metadata
  metadata[type] = workflowMeta
end
