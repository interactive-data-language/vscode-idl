;+
; :Description:
;   Simple routine that can be used to perform input validation
;   for any routine to ensure that parameters are present or a
;   certain type. You can specify each possible type that the
;   data value can represent and optionally require that the value have
;   all of the types. Here are the generic types that can be used:
;
;   - required : If set, the value must be present and defined.
;
;   - array    : If set, value supplied must be an array.
;
;   - number   : If set, value supplied must be a number.
;
;   - file     : If set, value must be a file on disk.
;
;   - directory: If set, value must be a folder on disk.
;
;   This routine uses IDL's `isa` function to make the comparison so,
;   in addition to the types above, you can specify anything else that
;   can pass as an argument. Some exampled are: byte, int, long, float,
;   hash, orderedhash, enviraster. They can be any IDL-specific data
;   type and it can also be the type of object such as idlgrwindow or
;   any named, custom object type.
;
; :Arguments:
;   requirements: in, optional, required
;     Hash type object with key/value pair representing the variable
;     name and a string/atring array representing the different types
;     that must be present.
;
;     This argument is optional only if the `CALLED_FROM` keyword is set.
;
; :Keywords:
;   called_from: in, optional, String
;     If present, the validator makes sure that the routine was called from
;     the specified function or procedure. The string comparison is case insensitive.
;   level: in, optional, UInt
;     Specify the scope level (with reference to where this was called, and not
;     in this scope) for which you want the prefix of the error message to appear.
;     For example, if you specify -1, then the prefix will be from the parent of the
;     routine that calls this procedure.
;   print_name: in, optional, String
;     If specified, then this value will be printed in place of the variable names
;     in the requirements hash. This is meant for use with one variable at a time.
;   print_prefix: in, optional, String
;     Set this to a string that you will want printed before any error messages. The
;     default value is "Variable". This is provided if you are trying to validate
;     an existing variable from something like a hash so you can print the term
;     "Key" which is the correct term.
;
; :Examples:
;   See ![FILE:./README.md] for examples of how to use this routine.
;
; :Author:
;   Zachary Norman - GitHub : [znorman-harris](https://github.com/znorman-harris)
;
;-
pro inputValidator, requirements, $
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
    if (n_elements(requirements) eq 0) then begin
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
      case (1) of
        ; isa(value, 'hash'): isNull = n_elements(value) eq 0
        else: ; do nothing
      endcase
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
      if ~file_test(value) then begin
        message, pName + ' "' + varPrint + '" is not a file on disk, required!', level = scopeLevel
      endif
    endif

    ; check for directory
    if (directory) then begin
      if ~file_test(value, /directory) then begin
        message, pName + ' "' + varPrint + '" is not a directory on disk, required!', level = scopeLevel
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