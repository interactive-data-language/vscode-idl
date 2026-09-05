;+
; :Private:
;
; :Description:
;   Helper routine that condenses logic for setting default
;   values for argument, keywords, or variables inside of IDL routines. This
;   procedure will reduce this code:
;
;   ```idl
;   if (someArg eq !NULL) then begin
;     someArg = 42
;   endif
;   if ~keyword_set(someKeyword) then begin
;     someKeyword = 'defaultString'
;   endif
;   ```
;
;   into this:
;
;   ```idl
;   inputDefaultor, hash('someArg', 42, 'someKeyword', 'defaultString')
;   ```
;
;   Because this uses a hash or orderedhash to contain the default values you can
;   specify any variable name which is case insensitive and any value you want for
;   what the default value should be.
;
;   Use this routine in combination with `inputValidator` to set defaults and make
;   sure that all variables are present and meet the expected requirements.
;
; :Arguments:
;   defaults: in, optional, required
;     Hash type object with key/value pair representing the variable
;     name and a string/atring array representing the different types
;     that must be present.
;
; :Examples:
;   #### Set a default value for an argument to be a scalar:
;
;       inputDefaultor, hash('nameOfArg', 42)
;
;   #### Set default value of an argument to an array of values:
;
;       inputDefaultor, hash('nameOfArg', [42, 42, 42])
;
;   #### Set default value of keyword to a plot reference
;
;       inputDefaultor, hash('nameOfKeyword', plot(/TEST, /BUFFER))
;
;   #### Set raster URI to a default tempoary filename in ENVI:
;
;       e = envi(/HEADLESS)
;       inputDefaultor, hash('output_raster_uri', e.getTemporaryFilename())
;
;   #### Set default and validate variable data type with inputValidator
;
;       e = envi(/HEADLESS)
;       inputDefaultor, hash('output_raster_uri', e.getTemporaryFilename())
;       inputValidator, hash('output_raster_uri', ['string', 'required']])
;
; :Author:
;   Zachary Norman - GitHub : [znorman-harris](https://github.com/znorman-harris)
;
;-
pro inputDefaultor, defaults
  compile_opt idl2, hidden
  on_error, 2

  ; make sure we have something to check
  if (n_elements(defaults) eq 0) then begin
    message, 'defaults argument not provided or has no key/value pairs, required!', level = -1
  endif

  if ~isa(defaults, 'hash') then begin
    message, 'defaults argument provided, but it is not a hash or orderedhash, required!', level = -1
  endif

  ; get our scope level
  level = scope_level()

  ; loop over each element
  foreach varValue, defaults, varName do begin
    ; check to see if we have an undefined variable
    catch, err
    if (err ne 0) then begin
      catch, /cancel
      ; hit this code if our variable is undefined in the parent scope, so lets
      ; set with a default value!
      (scope_varfetch(varName, level = level - 1, /enter)) = varValue
    endif else begin
      value = scope_varfetch(varName, level = level - 1)

      ; check if our variable is !NULL
      if isa(value, /null) then begin
        (scope_varfetch(varName, level = level - 1, /enter)) = varValue
      endif
    endelse
    catch, /cancel
  endforeach
end