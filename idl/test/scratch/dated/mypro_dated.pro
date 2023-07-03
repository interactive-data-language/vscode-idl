;+
; :Arguments:
;   arg1: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;   arg2: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;   arg3: bidirectional, required, any
;     Placeholder docs for argument, keyword, or property
;   arg4: bidirectional, required, ENVIRaster
;     Placeholder docs for argument, keyword, or property
;
; :Keywords:
;   KW1: bidirectional, optional, any
;     Placeholder docs for argument, keyword, or property
;   KW2: bidirectional, optional, any
;     Placeholder docs for argument, keyword, or property
;
;-
PRO mypro_dated, arg1, arg2, arg3, arg4, KW1 = kw1, KW2 = kw2
  COMPILE_OPT IDL2, HIDDEN

  ;+ reference to our super cool and awesome plot
  a = PLOT(/TEST)

  ; sample if statement
  IF !TRUE THEN BEGIN
    print, 42
  ENDIF ELSE BEGIN
    print, 84
  ENDELSE

  ; sample for loop
  FOREACH val, var, key DO BEGIN

  ENDFOREACH

  ; sample ENVI routine
  e = ENVI()
  r = ENVIRASTER(METADATA = meta) ; formatting matches whatever you type as a user

  task = ENVITask("subsetraster")

  a = imsl_quadprog()

  st = {NYStruct, PROP1: 5, PROP2: 6}

  st.

  !NULL = st.PROP1

  !NULL = st.PROP2

END