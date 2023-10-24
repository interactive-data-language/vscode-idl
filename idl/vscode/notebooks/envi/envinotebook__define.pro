;+
; :Description:
;   Creates a visual product for a raster or raster series that we can display
;   within an IDL Notebook.
;
;   This routine is only meant to be used from within IDL Notebooks within VSCode.
;
; :Arguments:
;   dataset: in, required, ENVIRaster | ENVIRasterSeries
;     The dataset to display in a notebook
;
; :Keywords:
;   size: in, optional, Number
;     Specify the largest dimension of the thumbnail (columns or rows). The
;     input raster's aspect ratio will be retained.
;
;     The default value is 800
;
; :Examples:
;
;   Open an image in ENVI and display in a notebook:
;
;   ```idl
;   ; Start the application
;   e = envi(/headless)
;
;   ; Open an input file
;   file = filepath('qb_boulder_msi', subdir = ['data'], $
;     root_dir = e.root_dir)
;   raster = e.openRaster(File)
;
;   ; display in the current notebook cell
;   ; which requires this to be running in a notebook
;   ENVINotebook.display, raster
;   ```
;
;-
pro ENVINotebook::display, dataset, size = size
  compile_opt idl2, hidden, static
  on_error, 2

  ; get the current session of ENVI
  e = envi(/current)
  if (e eq !null) then begin
    message, 'ENVI has not started yet, required!'
  endif

  ; make sure we have system vars
  vscode_notebookInit

  ; determine how to proceed
  case (!true) of
    isa(dataset[0], 'enviraster'): begin
      ENVI.displayRasterInNotebook, dataset, size = size
    end
    isa(dataset, 'envirasterseries'): begin
      ENVI.displayRasterSeriesInNotebook, dataset, size = size
    end
    else: begin
      message, 'Input dataset is not an ENVI Raster or raster series'
    end
  endcase
end

;+
; :Description:
;   Intercepts progress messages from ENVI Tasks and embeds them as output
;   in notebooks
;
; :Keywords:
;   stop: in, optional, Boolean
;     If set, and we are listening to events from ENVI, removes our event
;     listener and cleans up
;
;-
pro ENVINotebook::embedProgress, stop = stop
  compile_opt idl2, hidden, static
  on_error, 2

  ; make sure we have system vars
  vscode_notebookInit

  ; return if already registered
  if (obj_valid(!idlnotebookmagic.envilistener)) then begin
    ; stop listening to events
    if keyword_set(stop) then !idlnotebookmagic.envilistener.cleanup
    return
  endif

  ; create message interceptor and save
  !idlnotebookmagic.envilistener = VSCodeENVIMessageInterceptor()
end

;+
; :ENVINotebook:
;
;-
pro ENVINotebook__define
  compile_opt idl2, hidden
  on_error, 2

  ; make sure to resolve IDL notebooks
  IDLNotebook__define

  ;+
  ; Dummy structure definition so our static methods work
  ;-
  !null = {ENVINotebook, inherits IDLNotebookMap}
end