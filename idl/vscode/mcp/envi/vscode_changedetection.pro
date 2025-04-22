;+
; :Description:
;   Runs change detection in ENVI and creates a visual product
;   that shows changes.
;
;   "Resets" ENVI's before running and sets up ENVI's
;   display after results are generated
;
; :Arguments:
;   time1_uri: in, required, String
;     URI for raster 1
;   time2_uri: in, required, String
;     URI for raster 2
;
;-
pro vscode_changeDetection, time1_uri, time2_uri
  compile_opt idl2, hidden
  on_error, 2

  ; handle errors
  catch, err
  if (err ne 0) then begin
    catch, /cancel
    help, /last_message, output = o
    vscode_reportENVISuccess, !false, 'envi-error', o
    return
  endif

  ; start ENVI and clear display
  e = vscode_getENVIAndClearDisplay()

  ;+ time 1
  t1 = e.openRaster(time1_uri)

  ;+ time 2
  t2 = e.openRaster(time2_uri)

  ; run change detection
  atChangeDetection, $
    debug = !true, $
    input_raster1 = t1, $
    input_raster2 = t2, $
    output_raster_uri = output_raster_uri

  ; open results
  results = e.openRaster(output_raster_uri)

  ; display the results
  e.refresh, /disable

  ; create view
  View1 = e.getView()
  Layer11 = View1.createLayer(t1, /clear_display)
  Layer12 = View1.createLayer(t2)

  ; create second view
  View2 = e.createView()
  Layer2 = View2.createLayer(results)

  ; link all the views together
  View2.geolink, /link_all, /zoom_link

  ; maximize zoom
  View1.zoom, /full_extent
  e.refresh

  ; report success
  vscode_reportENVISuccess, !true, '', ''
end
