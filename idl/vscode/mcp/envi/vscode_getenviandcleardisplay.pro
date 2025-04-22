;+
; :Description:
;   Starts ENVI if not already started and resets the ENVI session by clearing the data manager and display
;
; :Returns: any
;
;-
function vscode_getENVIAndClearDisplay
  compile_opt idl2, hidden
  on_error, 2

  ; get current ENVI
  e = envi(/current)

  ; if it has not started, start up the UI
  if (e eq !null) then begin
    e = envi()
  endif

  catch, err
  if (err ne 0) then begin
    catch, /cancel
    return, e
  endif

  ; clear the display
  if (e.widget_id ne 0) then begin
    e.refresh, /disable

    ; clean up all data
    foreach item, e.data.get() do begin
      if obj_valid(item) then item.close
    endforeach

    ; reset our views
    views = e.getView(/all)
    foreach view, views do view.close

    ; get the leftover view
    view = e.getView()
    view.reset

    ; refresh view
    e.refresh
  endif

  return, e
end
