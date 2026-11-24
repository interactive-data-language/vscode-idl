;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

;+
; :Private:
;
; :Description:
;   Input validation for Sol and Luna. Ensures that the variables
;   in the calling routine are present and/or have a certain type,
;   and raises an error from the perspective of the caller if not.
;
;   Each requirement is a string in the array for a variable name.
;   These generic requirements are supported:
;
;   - required : the value must be present and defined.
;   - array    : the value must be an array.
;   - number   : the value must be a number.
;   - file     : the value must be a file on disk.
;   - directory: the value must be a folder on disk.
;   - all      : the value must match every type listed, not just one.
;
;   Any other string is used as a type name for IDL's `isa` function,
;   for example `string`, `hash`, `orderedhash`, or the name of an
;   object class.
;
; :Arguments:
;   requirements: in, optional, Hash<Array<String> | String>
;     Keys are the names of variables in the calling routine and values
;     are the requirements for the variable.
;
;     This argument is optional only if `CALLED_FROM` is set.
;
; :Keywords:
;   called_from: in, optional, String
;     If present, the routine must have been called from the specified
;     routine (case-insensitive prefix comparison against the traceback).
;   level: in, optional, Long
;     Scope level, relative to the routine that calls this procedure, that
;     the error messages are reported from. For example, -1 reports the
;     error from the parent of the calling routine.
;   print_name: in, optional, String
;     If specified, this value is printed in place of the variable name in
;     error messages. Meant for validating one variable at a time.
;   print_prefix: in, optional, String
;     String printed before the variable name in error messages.
;
;-
pro sol_validate, requirements, $
  called_from = called_from, $
  level = level, $
  print_name = print_name, $
  print_prefix = print_prefix
  compile_opt idl2, hidden
  on_error, 2

  ; check if we have a scope level
  if (level ne !null) then begin
    scopeLevel = -1 + level
  endif else begin
    scopeLevel = -1
  endelse

  ; check our callback
  if keyword_set(called_from) then begin
    if ~isa(called_from, /string) then begin
      message, 'CALLED_FROM specified, but supplied value is not a string, required!'
    endif

    trace = scope_traceback()
    from = strlowcase(trace[-3])
    if (strpos(from, strlowcase(called_from)) ne 0) then begin
      message, 'Routine not called from expected source!', level = scopeLevel
    endif

    ; return if nothing else to do
    if (n_elements(requriements) eq 0) then begin
      return
    endif
  endif

  ; make sure we have something to check
  if (n_elements(requirements) eq 0) then begin
    message, 'requirements argument not provided or has no key/value pairs, required!'
  endif

  if ~isa(requirements, 'hash') then begin
    message, 'requirements argument provided, but it is not a hash or orderedhash, required!'
  endif

  ; get the prefix for printing
  if keyword_set(print_prefix) then begin
    pName = strtrim(print_prefix, 2)
  endif else begin
    pName = 'Variable'
  endelse

  ; get our scope level
  level = scope_level()

  ; loop over each element
  foreach initReqs, requirements, varName do begin
    ; trim extra strings
    reqs = strtrim(initReqs, 2)

    ; init all of our basic flags
    required = 0
    array = 0
    number = 0
    file = 0
    directory = 0

    ; flag for if we need all data types specified to be present
    ; otherwise just need one
    all = 0

    ; init array to hold data types
    ; use array bc overhead will be small
    dTypes = []
    typeTotal = 0

    ; get the name that we want to print
    if keyword_set(print_name) then begin
      varPrint = strtrim(print_name, 2)
    endif else begin
      varPrint = varName
    endelse

    ; loop over our requirements and make the proper flags
    foreach req, strlowcase(reqs) do begin
      case (req) of
        ; basic variable information
        'required': required = 1
        'array': array = 1
        'number': number = 1
        'file': file = 1
        'directory': directory = 1
        'all': all = 1

        else: begin
          dTypes = [dTypes, req]
        end
      endcase
    endforeach

    ; check if there are other types to check
    types = n_elements(dTypes) gt 0

    ; check to see if we have a null variable
    catch, err
    if (err ne 0) then begin
      isNull = 1
    endif else begin
      value = scope_varfetch(varName, level = level - 1)
      isNull = isa(value, /null)
    endelse
    catch, /cancel

    ; check if present and required
    if (required and isNull) then begin
      message, pName + ' "' + varPrint + '" has not been defined, required!', level = scopeLevel
    endif else begin
      if (isNull) then begin
        continue
      endif
    endelse

    ; check for array
    if (array) then begin
      if ~isa(value, /array) then begin
        message, pName + ' "' + varPrint + '" is not an array, required!', level = scopeLevel
      endif
    endif

    ; check for file
    if (file) then begin
      if (total(file_test(value)) ne n_elements(value)) then begin
        message, pName + ' "' + varPrint + '" is not a file on disk (or not all elements are files), required!', level = scopeLevel
      endif
    endif

    ; check for directory
    if (directory) then begin
      if (total(file_test(value, /directory)) ne n_elements(value)) then begin
        message, pName + ' "' + varPrint + '" is not a directory on disk (or not all elements are folders), required!', level = scopeLevel
      endif
    endif

    ; check for number
    if (number) then begin
      nflag = isa(value, /number)
      if (~nflag and ~types) then begin
        message, pName + ' "' + varPrint + '" is not a number, required!', level = scopeLevel
      endif
      typeTotal += nflag
    endif

    ; check all of the data types
    if (n_elements(dTypes) gt 0) then begin
      foreach type, dTypes do begin
        flag = isa(value, type)
        if (all and ~flag) then begin
          message, pName + ' "' + varPrint + '" is not a "' + type + '", required!', level = scopeLevel
        endif else begin
          typeTotal += flag
        endelse
      endforeach
    endif

    ; validate input
    if ((n_elements(dTypes) gt 0) or number) then begin
      case (1) of
        (all): nReq = n_elements(dTypes) + number
        else: nReq = 1
      endcase

      ; check if we were none of the potential data types
      if ~(typeTotal ge nReq) then begin
        message, pName + ' "' + varPrint + '" does not match any optional data types. Optional types are: ' + $
          string(10b) + strjoin(dTypes, string(10b)), level = scopeLevel
      endif
    endif
  endforeach
end
