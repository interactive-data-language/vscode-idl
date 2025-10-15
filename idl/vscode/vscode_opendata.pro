;+
; :Private:
;
; :Description:
;   Opens data in ENVI
;
; :Arguments:
;   uri: in, required, String
;     Specify the URI of a dataset to attempt to open using ENVI
;
;-
pro vscode_openData, uri
  compile_opt idl2, hidden
  on_error, 2
  vscode_verifyPath

  ; handle errors accessing ENVI
  catch, err
  if (err ne 0) then begin
    catch, /cancel
    help, /last_message, output = o
    vscode_reportENVIFailure, 'envi-error', o
    return
  endif else begin
    ; get the current instance of ENVI
    e = envi(/current)

    ; attempt to start ENVI if it has not yet
    if (e eq !null) then begin
      e = envi()
    endif else begin
      if (e.widget_id eq 0) then begin
        vscode_reportENVIFailure, 'no-envi-ui', ''
        return
      endif
    endelse
  endelse
  catch, /cancel

  ; try to open our raster and make sure we always have an
  ; array of them
  rasters = [e.openRaster(uri, error = err)]

  ; check for problem
  if keyword_set(err) then begin
    vscode_reportENVIFailure, 'open-error', err
    return
  endif

  ; display our raster
  e.refresh, /disable
  view = e.getView()
  !null = view.createLayer(rasters[0]) ; default to first raster
  view.zoom, /full_extent
  e.refresh

  ; report success
  vscode_reportENVISuccess, 'Opened data!'
end
