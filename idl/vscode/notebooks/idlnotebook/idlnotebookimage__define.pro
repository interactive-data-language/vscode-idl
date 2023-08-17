;+
; :IDLNotebookImage_Base:
;   xsize: Number
;     The width of the PNG for display
;   ysize: Number
;     The height of the PNG for display
;
; :IDLNotebookImage_PNG:
;   data: String
;     Base64 encoded PNG as a string
;
; :IDLNotebookImage_FromUri:
;   uri: String
;     Fully-qualified filepath to an image on disk.
;
;     At this time, only PNGs are supported
;
; :IDLNotebookImage_AnimationFromUris:
;   uris: List<String>
;     Fully-qualified filepaths to images on disk that you want to create
;     an animation for.
;
;     At this time, only PNGs are supported.
;
;-
pro IDLNotebookImage__define
  compile_opt idl2, hidden
  on_error, 2

  ;+
  ; Base datas tructure for image
  ;-
  !null = {IDLNotebookImage_Base, $
    xsize: 0l, $
    ysize: 0l}

  ;+
  ; Data structure for embedding an image
  ;-
  !null = {IDLNotebookImage_PNG, $
    inherits IDLNotebookImage_Base, $
    data: 'base64'}

  ;+
  ; Data structure for embedding an image
  ;-
  !null = {IDLNotebookImage_FromUri, $
    inherits IDLNotebookImage_Base, $
    uri: ''}

  ;+
  ; Data structure for embedding a series of image as an animation
  ;-
  !null = {IDLNotebookImage_AnimationFromUris, $
    inherits IDLNotebookImage_Base, $
    uris: list()}
end