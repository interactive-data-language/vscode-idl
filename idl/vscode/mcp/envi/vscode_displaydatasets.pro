;+
; :Description:
;   Displays an array of dehydrated dataset in ENVI
;
;   Limited to ENVI::CreateLayer data types.
;
; :Arguments:
;   datasets: bidirectional, required, any
;     Dehydrated version of a dataset that we try to open
;
; :Keywords:
;   reset: in, optional, Boolean
;     If set, then we clear ENVI's display first
;
;-
pro vscode_displayDatasets, datasets, reset = reset
  compile_opt idl2, hidden
  on_error, 2

  ; handle errors accessing ENVI
  catch, err
  if (err ne 0) then begin
    catch, /cancel
    help, /last_message, output = o
    vscode_reportENVIFailure, /machine, 'envi-error', o
    return
  endif else begin
    ; get the current instance of ENVI
    e = envi(/current)

    ; attempt to start ENVI if it has not yet
    if (e eq !null) then begin
      e = envi()
    endif else begin
      if (e.widget_id eq 0) then begin
        vscode_reportENVIFailure, /machine, 'no-envi-ui', ''
        return
      endif
    endelse
  endelse
  catch, /cancel

  ; check if we should reset the display
  if keyword_set(reset) then e = vscode_getENVIAndClearDisplay()

  ;+ track the items to display
  toDisplay = list()

  ;+ parse so we can loop over all images
  parsed = json_parse(datasets)

  ; process each dataset
  foreach dataset, parsed do begin
    ;+ hydrate the dataset
    hydrated = vscode_hydrateDataset(json_serialize(dataset))

    ; return if we didnt hydrate - error reporting happens in that routine
    if (hydrated eq !null) then return

    ; if array, display the first dataset
    if isa(hydrated, /array) then hydrated = hydrated[0]

    ;+ track to display
    toDisplay.add, hydrated
  endforeach

  ; display our raster
  e.refresh, /disable
  view = e.getView()

  ;+ flag if we did it or not
  success = !true

  ; process each dataset
  foreach hydrated, toDisplay do begin
    ;+
    ; Deteremine how to try and open dataset
    ;-
    case (!true) of
      ; annotations
      isa(hydrated, 'ENVIAnnotationSet'): !null = view.createLayer(hydrated)

      ; raster
      isa(hydrated, 'ENVIRaster'): !null = view.createLayer(hydrated)

      ; raster series
      isa(hydrated, 'ENVIRasterSeries'): !null = view.createLayer(hydrated)

      ; vector
      isa(hydrated, 'ENVIVector'): !null = view.createLayer(hydrated)

      ; unhandled so we failed
      else: success = !false
    endcase

    ; quit if we had problems
    if ~success then break
  endforeach

  ; update display
  view.zoom, /full_extent
  e.refresh

  ; report progress
  if success then begin
    vscode_reportENVISuccess, /machine, 'Datasets are open in ENVI'
  endif else begin
    vscode_reportENVIFailure, /machine, 'envi-error', 'Only annotations, raster, raster series, and vector datasets are supported'
  endelse
end

compile_opt idl2

e = envi()

; Open an ENVI file and display it
file = filepath('qb_boulder_msi', root_dir = e.root_dir, $
  subdir = ['data'])
raster = e.openRaster(file)

vscode_displayDataset, json_serialize(list(raster.dehydrate()))
end
