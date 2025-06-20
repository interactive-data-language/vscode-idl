;+
; :Arguments:
;   taskJSON: in, required, String
;     JSON string of task parameters to run.
;
;     See MCPToolParams_RunENVITask for details
;
;-
pro vscode_runENVITask, taskJSON
  compile_opt idl2, hidden
  ; on_error, 2

  ; get the current session of ENVI
  e = envi(/current)
  if (e eq !null) then begin
    vscode_reportENVIFailure, 'envi-not-started', 'ENVI has not started yet and should be. If ENVI was started, you may need to reset your IDL session'
    return
  endif

  ;+ parse task parameters
  parsed = json_parse(taskJSON)

  ;+ make the task
  task = ENVITask(parsed['taskName'], error = err)

  ; check for problem
  if keyword_set(err) then begin
    vscode_reportENVIFailure, 'task-error', err
    return
  endif

  ; process each parameter
  foreach val, parsed['inputParameters'], name do begin
    param = task.parameter(name, err = err)

    ; check for problem
    if keyword_set(err) then begin
      vscode_reportENVIFailure, 'task-param-error', err
      return
    endif

    ;+
    ; Listen for errors trying to set task parameters
    ;-
    catch, err
    if (err ne 0) then begin
      catch, /cancel
      vscode_reportENVIFailure, 'task-param-error', err
      return
    endif

    ;+
    ; Handle variations of parameters
    ;-
    case (!true) of
      ;+ dehydrate overrides
      strcmp(param.type, 'list', /fold_case): param.value = val
      strcmp(param.type, 'hash', /fold_case): param.value = val
      strcmp(param.type, 'orderedhash', /fold_case): param.value = param.value = val
      strcmp(param.type, 'dictionary', /fold_case): param.value = json_parse(json_serialize(val), /dictionary)

      ; encrypt password
      strcmp(param.type, 'ENVISecureString', /fold_case): param.value = ENVISecureString(plaintext = val, task.public_key)

      ; default to just set the value
      else: param.value = val
    endcase
  end

  ;+
  ; make sure we have files on disk, no virtual raster stuff
  ;-
  params = task.parameterNames()
  foreach name, params do begin
    param = task.parameter(name)

    ; set filepaths on disk
    if (param.type eq 'ENVIVIRTUALIZABLEURI') then param.value = e.getTemporaryFilename(/cleanup_on_exit)
  endforeach

  ; run the task
  task.execute, error = err

  ; check for problem
  if keyword_set(err) then begin
    vscode_reportENVIFailure, 'task-execute-error', err
    return
  endif

  ; init result
  outputParameters = hash()

  ;+
  ; Get output parameters
  ;-
  names = task.parameterNames()

  ; process each parameter
  foreach name, names do begin
    ; get task parameter
    param = task.parameter(name)

    ; skip input parameters
    if (param.direction eq 'INPUT') then continue

    ; save dehydrated value
    outputParameters[name.toLower()] = param.value.dehydrate()
  endforeach

  ; report that we win!
  vscode_reportENVISuccess, outputParameters
end

compile_opt idl2

e = envi(/headless)

; Open an input file
File = Filepath('qb_boulder_msi', subdir = ['data'], $
  root_dir = e.root_dir)
Raster = e.openRaster(File)

params = hash('taskName', 'QuerySpectralIndices', 'inputParameters', hash('input_raster', Raster.dehydrate()))

stringy = json_serialize(params)

vscode_RunENVITask, stringy

end
