;+
; :Description:
;   Hydrates a dataset for use in ENVI.
;
;   Returns a scalar or array of a hydrated dataset. If
;   we have a raster without the dataset_index property, then
;   we return all opened rasters (hence array).
;
; :Returns: any
;
; :Arguments:
;   dataset: in, required, String
;     Dehydrated version of a dataset that we try to open
;
;-
function vscode_hydrateDataset, dataset
  compile_opt idl2, hidden
  on_error, 2

  ; get the current session of ENVI
  e = envi(/current)
  if (e eq !null) then begin
    vscode_reportENVIFailure, /machine, 'envi-not-started', 'ENVI has not started yet and should be. If ENVI was started, you may need to reset your IDL session'
    return, !null
  endif

  ; attempt to parse JSON
  catch, err
  if (err ne 0) then begin
    catch, /cancel
    vscode_reportENVIFailure, /machine, 'envi-error', 'Invalid JSON description of dataset, cannot query'
    return, !null
  endif else begin
    ;+ parse task parameters
    parsed = json_parse(dataset)
  endelse
  catch, /cancel

  ;+ track if we have a raster
  isRaster = strcmp(parsed['factory'], 'urlraster', /fold_case)

  ;+
  ; Attempt to hydrate the dataset
  ;-
  catch, err
  if (err ne 0) then begin
    catch, /cancel
    help, /last_message, output = o
    vscode_reportENVIFailure, /machine, 'envi-error', `Unable to hydrate, ${strjoin(o, `\n`)}`
    return, !null
  endif else begin
    ;+
    ; Special cases for raster data because ENVI apparently can't handle hydrating
    ; multi-raster datasets but you can call ENVI:OpenRaster
    ;-
    case (!true) of
      ~parsed.hasKey('dataset_index') && isRaster: begin
        hydrated = e.openRaster(parsed['url'])
      end
      else: begin
        hydrated = ENVIHydrate(parsed)
      end
    endcase
  endelse
  catch, /cancel

  ; return result
  return, hydrated
end
