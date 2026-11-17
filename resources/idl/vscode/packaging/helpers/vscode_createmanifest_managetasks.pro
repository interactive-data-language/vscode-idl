;+
; :Arguments:
;   type: in, required, 'idlTask<_>s' | 'enviTask<_>s'
;     Type of task we are saving
;   dir: in, required, String
;     Package directory
;   metadata: in, required, Hash<any>
;     Package metadata
;   tasks: in, required, List<String>
;     The declared tasks
;
;-
pro vscode_createManifest_manageTasks, type, dir, metadata, tasks
  compile_opt idl2, hidden
  on_error, 2

  ; return if nothing to save
  if (n_elements(tasks) eq 0) then return

  ;+ create prompt metadata
  taskMeta = orderedhash()

  ; process each configured task
  foreach task, tasks do begin
    ;+ get path
    taskUri = strjoin([dir, task], path_sep())

    ; make sure it exists
    if ~file_test(taskUri) then message, `Declared task file doesn't exist: ${taskUri}`

    ; save task definition
    taskMeta[task] = json_parse(taskUri)
  endforeach

  ; save metadata
  metadata[type] = taskMeta
end
