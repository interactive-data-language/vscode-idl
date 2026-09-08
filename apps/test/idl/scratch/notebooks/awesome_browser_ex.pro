; Copyright (c) Harris Geospatial Solutions, Inc. All rights reserved.
;
; -------------------------------------
;+
; :Arguments:
;   ev: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;
;-
pro awesome_browser_ex_event, ev
  compile_opt idl2, hidden

  widget_control, ev.top, get_uvalue = state

  case tag_names(ev, /structure_name) of
    'WIDGET_BROWSER': begin
      ; An event came in from JavaScript
      if (ev.type eq 9) then begin
        json = json_parse(ev.value)
        if (json.HasKey('jsReady')) then begin
          ; The Google table is ready, send the initial data
          h = hash()
          h['names'] = state.names
          h['data'] = (state.data)[*, 0]
          ; Notify the browser with the new data
          widget_control, state.wbrowser, browser_notify = json_serialize(h)
        endif
        if (json.HasKey('rowSelect')) then begin
          ; A row was selected in the table
          rowname = json['rowSelect']
          pArr = state.parr
          for i = 0, 4 do begin
            ; Update the plotline thickness highlighting the selected row
            pArr[i].SetProperty, thick = (rowname eq state.names[i] ? 3 : 1)
          endfor
        endif
      endif
    end
    'WIDGET_SLIDER': begin
      widget_control, ev.top, get_uvalue = state
      h = hash()
      h['data'] = (state.data)[*, ev.value - 2010]
      ; Notify the browser with the new data
      widget_control, state.wbrowser, browser_notify = json_serialize(h)
      ; Update vertical plot line
      state.p.setData, [ev.value, ev.value], [-4000, 6000]
    end
    else:
  endcase
end

; --------------------------------------------------------------------
;+
;-
pro awesome_browser_ex
  compile_opt idl2, hidden

  export = IDLNotebook.ExportItems()
  if (n_elements(export) eq 0) then message, 'Nothing to embed'

  asString = json_serialize(export[0], /lowercase)

  ; dataFile = file_dirname(routine_filepath(), /mark_directory) + 'payload.js'
  ; openw, lun, dataFile, /get_lun
  ; printf, lun, 'const payload = ' + asString + ';'
  ; free_lun, lun

  ; Set up initial data
  xsize = 600
  ysize = 750
  htmlfile = 'file:///' + $
    file_dirname(routine_filepath(), /mark_directory) + 'awesome_browser_ex.html'

  state = orderedhash()

  ; Create widgets
  wTLB = widget_base(/column, xsize = xsize, uvalue = state)
  wBrowser = widget_browser(wTLB, value = htmlfile, xsize = xsize, ysize = ysize)
  state['wBrowser'] = wBrowser
  widget_control, wTLB, /realize
  xmanager, 'awesome_browser_ex', wTLB, /no_block

  ; need to stop here so the interpreter gets a chance to catch up
  ; something weird with evet order in the browser
  stop

  ; send data
  widget_control, wBrowser, browser_notify = asString
end