;+
; :Arguments:
;   dataset: in, required, String
;     Dehydrated version of a dataset that we try to open
;
;-
pro vscode_queryDataset, dataset
  compile_opt idl2, hidden
  on_error, 2

  ; get the current session of ENVI
  e = envi(/current)
  if (e eq !null) then begin
    vscode_reportENVIFailure, /machine, 'envi-not-started', 'ENVI has not started yet and should be. If ENVI was started, you may need to reset your IDL session'
    return
  endif

  ; attempt to parse JSON
  catch, err
  if (err ne 0) then begin
    catch, /cancel
    vscode_reportENVIFailure, /machine, 'envi-error', 'Invalid JSON description of dataset, cannot query'
    return
  endif else begin
    ;+ parse task parameters
    parsed = json_parse(dataset)
  endelse
  catch, /cancel

  ;+
  ; Attempt to hydrate the dataset
  ;-
  catch, err
  if (err ne 0) then begin
    catch, /cancel
    help, /last_message, output = o
    vscode_reportENVIFailure, /machine, 'envi-error', `Unable to hydrate, ${strjoin(o, `\n`)}`
    return
  endif else begin
    ;+ hydrate
    hydrated = ENVIHydrate(parsed)
  endelse
  catch, /cancel

  ; report that we win!
  catch, err
  if (err ne 0) then begin
    catch, /cancel
    vscode_reportENVISuccess, /machine, '{}'
  endif else begin
    vscode_reportENVISuccess, /machine, hydrated.describe()
  endelse
  catch, /cancel
end
