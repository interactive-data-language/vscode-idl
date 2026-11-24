;+
; Copyright (c) 2026 NV5 Geospatial Software, Inc.
;-

;+
; :Private:
;
; :Description:
;   Creates IDL-IDLBridge for running tests and sets
;   up logging for easy use
;
; :Returns: IDL_IDLBridge
;
;-
function luna_sol_base_obj::_GetBridgeProcess
  compile_opt idl2, hidden
  if ~self.debug then on_error, 2

  ; use the fixed debug log if specified, otherwise a temporary one
  if (self.bridge_debug_log ne '') then begin
    log = self.bridge_debug_log
  endif else begin
    ; make some random characters
    random = strtrim(floor(systime(/seconds)), 2) + strjoin(strtrim(floor(randomu(!null, 5) * 100), 2))
    log = filepath((isa(self, 'luna') ? 'luna.' : 'sol.') + random + '.log', /tmp)
  endelse

  ; start a child process
  obd = IDL_IDLBridge(output = log)

  ; update search path of child process to match ours
  obd.setVar, 'path', byte(!path)
  obd.execute, 'path = string(path)'
  obd.execute, 'pref_set, "IDL_PATH", path, /COMMIT & path_cache, /REBUILD'
  obd.execute, 'compile_opt idl2'

  ; check initial error state
  state = self._getBridgeErrorState(obd)

  ; alert user if there was an error
  if keyword_set(state.MSG) then begin
    print, state.MSG, /implied_print
    message, 'Error while creating child process. See above for more details', level = -1
  endif

  ; return bridge
  return, obd
end

;+
; :Private:
;
; :Description:
;   Check a child bridge process for error messages
;   by returning the !ERROR_STATE structure from
;   the child process.
;
; :Returns: any
;
; :Arguments:
;   bridge: in, required, IDL_IDLBridge
;     Specify the bridge to extract the information
;     from.
;
; :Keywords:
;   last_message: out, optional, Array<String>
;     Set to a named variable to retrieve the output of
;     `help, /LAST_MESSAGE` from the child process.
;
;-
function luna_sol_base_obj::_GetBridgeErrorState, bridge, last_message = last_message
  compile_opt idl2, hidden
  if ~self.debug then on_error, 2

  ; validate input
  sol_validate, hash('bridge', ['required', 'idl_idlbridge'])

  ; grab the error state in a way that we can interpret
  bridge.execute, 'json = json_serialize(!ERROR_STATE)'

  ; get struct
  struct = json_parse(bridge.getVar('json'), /tostruct, /toarray)

  ; clean up
  ; bridge.execute, 'delvar, json'

  ; get the last message
  if arg_present(last_message) then begin
    bridge.execute, 'help, /LAST_MESSAGE, OUTPUT = o'
    last_message = bridge.getVar('o')
    ; bridge.execute, 'delvar, o'
  endif

  ; return struct
  return, struct
end

;+
; :Private:
;
; :Description:
;   Updates the code coverage for what lines were and were not
;   executed as we ran our tests.
;
; :Keywords:
;   only_update_stats: in, optional, Boolean
;     Set this keyword to only recalculate the coverage statistics
;     without querying the code coverage of the routines.
;   update: in, optional, Boolean
;     Set this keyword to have the code coverage be updated
;     for all routines that we are aware of for this luna test
;     suite.
;
;-
pro luna_sol_base_obj::_GetCodeCoverage, update = update, only_update_stats = only_update_stats
  compile_opt idl2, hidden
  if ~self.debug then on_error, 2

  ; init counters
  nExec = 0
  nNotExec = 0

  ; check if we have anything to check for coverage
  if ~self.coverage.isEmpty() then begin
    ; process each file
    foreach routineHash, self.coverage, file do begin
      ; init file counters
      nExecFile = 0
      nNotExecFile = 0

      ; process each routine in each file
      foreach coverageInfo, routineHash, routineName do begin
        ; skip if our coverage info
        if (routineName eq '$coverage') then continue

        ; only extract code coverage if we are not just updating the statistics
        if ~keyword_set(only_update_stats) then begin
          ; update code coverage
          notExec = code_coverage(routineName, executed = exec)
          ; notExec = code_coverage(routineName.replace('()', ''), EXECUTED = exec, FUNCTION = routineName.endswith('()'))

          ; check if we actually had lines that were not executed
          ; skip if we are updating
          if ~((n_elements(notExec) eq 1) and (notExec[0] eq 0)) and ~keyword_set(update) then begin
            foreach line, notExec do coverageInfo['not-executed'].add, line
          endif

          ; check if we had lines that were executed
          if ~((n_elements(exec) eq 1) and (exec[0] eq 0)) then begin
            ; check if we are updating values or not or just initializing
            if keyword_set(update) then begin
              ; save list of indices to remove
              remove = list()

              ; process each line we have covered
              foreach line, exec, idx do begin
                ; check if we already have our line (should always be true
                rIdx = coverageInfo['not-executed'].where(line)
                if (rIdx ne !null) then remove.add, rIdx

                ; save this line as being executed if we didnt add it already
                if (coverageInfo['executed'].where(line) eq !null) then coverageInfo['executed'].add, line
              endforeach

              ; check if we have anything to remove
              if (n_elements(remove) gt 0) then begin
                coverageInfo['not-executed'].remove, remove.toArray()
              endif
            endif else begin
              ; initializing, so save all of our lines. should only hit
              ; this when testing ourself
              foreach line, exec do coverageInfo['executed'].add, line
            endelse
          endif
        endif

        ; get numbers
        nExecRoutine = n_elements(coverageInfo['executed'])
        nNotExecRoutine = n_elements(coverageInfo['not-executed'])

        ; increment counters
        nExecFile += nExecRoutine
        nNotExecFile += nNotExecRoutine
        nExec += nExecRoutine
        nNotExec += nNotExecRoutine

        ; calculate initial total coverage
        coverageInfo['coverage'] = (nExecFile + nNotExecFile) gt 0 ? 100 * float(nExecRoutine) / (nExecRoutine + nNotExecRoutine) : 0
      endforeach

      ; save coverage for our file
      self.coverage[file, '$coverage'] = orderedhash('coverage', (nExecFile + nNotExecFile) gt 0 ? 100 * float(nExecFile) / (nExecFile + nNotExecFile) : 0, $
        'total', nExecFile + nNotExecFile, $
        'executed', nExecFile, $
        'not-executed', nNotExecFile)
    endforeach
  endif

  ; save information about overall coverage
  self.coverageStats = orderedhash('coverage', (nExec + nNotExec) gt 0 ? 100 * float(nExec) / (nExec + nNotExec) : 0, $
    'total', nExec + nNotExec, $
    'executed', nExec, $
    'not-executed', nNotExec)
end

;+
; :Private:
;
; :Description:
;   Function method that generates a detailed summary
;   of the tests for printing to the log file. The content
;   of the summary depends on whether profiling was enabled
;   or not when this objct was initialized.
;
; :Returns: Array<String>
;
; :Arguments:
;   dir: in, optional, String
;     Optionally specify the folder that the files are from for
;     relative printing instead of fully-qualified paths.
;
; :Keywords:
;   no_profiler: in, optional, Boolean
;     Set this keyword to skip extracting profiler information.
;   no_update: in, optional, Boolean
;     Set this keyword to skip updating the code coverage.
;
;-
function luna_sol_base_obj::_GetTestAnalysis, dir, no_update = no_update, no_profiler = no_profiler
  compile_opt idl2, hidden
  if ~self.debug then on_error, 2

  ; update code coverage as we should be at the end of our tests
  if ~keyword_set(no_update) then self._getCodeCoverage, /update

  ; get global code coverage stats
  coverage = self.coverageStats

  ; check if we are profiling and get our results
  if (self.profile) and ~keyword_set(no_profiler) then begin
    ; extract info and clear our profiler
    profiler, /report, data = dat

    ; TODO: figure out why we have times when the information from the profiler is
    ; empty, but we have coverage information. related to the code not being in a
    ; separate file, but the same as where the test comes from.
    if (dat ne !null) then begin
      ; get the names of our routines that have been profiles
      names = strlowcase(dat.NAME)

      ; associate profile data with our coverage data
      ; check if we have anything to check for coverage
      if ~self.coverage.isEmpty() then begin
        ; process each file
        foreach routineHash, self.coverage, file do begin
          ; process each routine in each file
          foreach coverageInfo, routineHash, routineName do begin
            if (routineName eq '$coverage') then continue

            ; check if we have a routine that has been profiled
            idxMatch = where(names eq routineName, countMatch)

            ; not called if no match (I think?)
            if (countMatch eq 0) then begin
              coverageInfo['hits'] = 0l
              coverageInfo['time'] = 0d
              coverageInfo['time/hit'] = 0d
              coverageInfo['time+sub'] = 0d
              coverageInfo['time+sub/hit'] = 0d
              continue
            endif

            ; get our stats!
            info = dat[idxMatch[0]]

            ; save our stats!
            coverageInfo['hits'] = info.COUNT
            coverageInfo['time'] = info.ONLY_TIME
            coverageInfo['time/hit'] = (info.COUNT gt 0) ? info.ONLY_TIME / info.COUNT : 0d
            coverageInfo['time+sub'] = info.TIME
            coverageInfo['time+sub/hit'] = (info.COUNT gt 0) ? info.TIME / info.COUNT : 0d
          endforeach
        endforeach
      endif
    endif
  endif

  ; init list of strings to store our output
  strings = list('', $
    '---------------------------', $
    '--------------------------------------------------------', $
    'Test analysis', $
    '--------------------------------------------------------', $
    '---------------------------', $
    '')

  ; create basic information about our code coverage
  strings.add, 'Overall code coverage (%) : ' + strtrim(coverage['coverage'], 2)
  strings.add, 'Lines executed            : ' + strtrim(coverage['executed'], 2)
  strings.add, 'Lines not executed        : ' + strtrim(coverage['not-executed'], 2)
  strings.add, 'Total lines               : ' + strtrim(coverage['total'], 2)
  strings.add, ''

  ; make sure our table looks nice
  strings.add, ''

  ; get all the files we compiled for high level code coverage
  files = self.coverage.keys()

  ; lets make a table with number of tests passed/failed in each file
  ; first, get longest filename relative to self.dir
  len = 0
  foreach file, files do len >= strlen(keyword_set(dir) ? file.replace(dir, '') : file)

  ; make sure the length is at least 4 characters
  len >= 4

  ; specify the number of spaces between our columns
  nspaces = 5
  spaces = strtrim(nspaces, 2) + 'X'

  ; make a buffer for our filename
  buffer = (len gt 4) ? string(replicate(32b, len - 4)) : ''

  ; make the printing format
  format = strjoin(['(A' + strtrim(len, 2), ', I10', ', I10', ', F8.2)'], ', ' + spaces)
  formatHeader = strjoin(['(A' + strtrim(len, 2), ', A10', ', A10', ', A8)'], ', ' + spaces)

  ; populate with values!
  strings.add, 'High level code coverage information by file:'
  strings.add, ''
  strings.add, string('File' + buffer, 'Lines', 'Executed', 'Coverage', format = formatHeader)
  foreach routineHash, self.coverage, file do begin
    ; get the name of the file that we want to print
    pName = (keyword_set(dir) ? file.replace(dir + path_sep(), '') : file).replace(path_sep(), '/')

    ; add a buffer so that it lines up with the left
    nameBuffer = strlen(pName) ne len ? string(replicate(32b, len - strlen(pName))) : ''

    ; add the string!
    strings.add, string(pName + nameBuffer, routineHash['$coverage', 'total'], routineHash['$coverage', 'executed'], routineHash['$coverage', 'coverage'], format = format)
  endforeach

  ; add an extra space
  strings.add, ''

  ; init placeholder for getting the longest routine name that we have
  len = 0

  ; get the longest routine name
  foreach routineHash, self.coverage, file do begin
    ; process each routine in each file
    foreach coverageInfo, routineHash, routineName do begin
      ; extrace information about what we have present
      len >= strlen(routineName)
    endforeach
  endforeach

  ; build format information for the specific routine code coverage

  ; build our format string (routine name, spaces, coverage, spaces, lines run, total lines
  format = '(A' + strtrim(len > 4, 2) + ', ' + spaces + ', F8.2, ' + spaces + ', I10, ' + spaces + ', I11'
  formatHeader = '(A' + strtrim(len > 4, 2) + ', ' + spaces + ', A8, ' + spaces + ', A10, ' + spaces + ', A11'

  ; check if we have profiler information or not to also include
  if (self.profile) and ~keyword_set(no_profiler) then begin
    ; add stats on our time (spaces, hits, spaces, time, spaces, time/hit, spaces, time+sub, spaces, time+sub/hit)
    format += ', ' + spaces + ', I9, ' + spaces + ', F16.10, ' + spaces + ', F16.10, ' + spaces + ', F16.10, ' + spaces + ', F16.10)'
    formatHeader += ', ' + spaces + ', A9, ' + spaces + ', A16, ' + spaces + ', A16, ' + spaces + ', A16, ' + spaces + ', A16)'
  endif else begin
    ; close expression
    format += ')'
    formatHeader += ')'
  endelse

  ; create a buffer for the name
  buffer = (len gt 4) ? string(replicate(32b, len - 4)) : ''

  ; process each file
  foreach routineHash, self.coverage, file do begin
    ; print information about which file we are procesing
    strings.add, '######################################################'
    strings.add, ''
    strings.add, file
    strings.add, ''

    ; print information about how we did
    strings.add, 'Overall code coverage (%) : ' + strtrim(routineHash['$coverage', 'coverage'], 2)
    strings.add, 'Lines executed            : ' + strtrim(routineHash['$coverage', 'executed'], 2)
    strings.add, 'Lines not executed        : ' + strtrim(routineHash['$coverage', 'not-executed'], 2)
    strings.add, 'Total lines               : ' + strtrim(routineHash['$coverage', 'total'], 2)
    strings.add, ''

    ; print the header information
    if (self.profile) then begin
      strings.add, string('Routine' + buffer, 'Coverage', 'Lines run', 'Total lines', 'Hits', 'Time', 'Time/hit', 'Time+sub', 'Time+sub/hit', format = formatHeader)
    endif else begin
      strings.add, string('Routine' + buffer, 'Coverage', 'Lines run', 'Total lines', format = formatHeader)
    endelse

    ; process each routine in each file
    foreach coverageInfo, routineHash, routineName do begin
      ; skip if not really a routine
      if (routineName eq '$coverage') then continue

      ; pad the routine name
      useName = routineName
      if ((len - strlen(routineName)) gt 0) then useName += string(replicate(32b, len - strlen(routineName)))

      ; get all the basic info we will need
      coverage = coverageInfo['coverage']
      linesRun = n_elements(coverageInfo['executed'])
      totalLines = linesRun + n_elements(coverageInfo['not-executed'])

      ; check if we have profiler info or not - same as above some issues at times
      if (self.profile and coverageInfo.hasKey('hits')) then begin
        hits = coverageInfo['hits']
        time = coverageInfo['time']
        timePerHit = coverageInfo['time/hit']
        timeSub = coverageInfo['time+sub']
        timeSubPerHit = coverageInfo['time+sub/hit']

        ; print to the screen
        strings.add, string(useName, coverage, linesRun, totalLines, hits, time, timePerHit, timeSub, timeSubPerHit, format = format)
      endif else begin
        strings.add, string(useName, coverage, linesRun, totalLines, format = format)
      endelse
    endforeach

    strings.add, ''
  endforeach

  ; clear profiler if we started it
  if (self.profile) then begin
    profiler, /reset
    profiler, /clear
  endif

  ; return our strings (alwasys will have elements)
  return, strings.toArray()
end

;+
; :Private:
;
; :Description:
;   Cleanup method.
;
;-
pro luna_sol_base_obj::Cleanup
  compile_opt idl2, hidden
end

;+
; :Description:
;   Static method that reads a text file from disk.
;
;   If the file is empty, a null string is returned.
;
; :Returns: String | Array<String>
;
; :Arguments:
;   file: in, required, String
;     Filepath to a file on disk to read.
;
; :Examples:
;   Read a file from IDL's installation directory:
;
;   ```idl
;   strings = luna_sol_base_obj.read_file(file_which('plot.pro'))
;   ```
;
;-
function luna_sol_base_obj::read_file, file
  compile_opt idl2, hidden, static
  on_error, 2
  sol_validate, hash('file', ['string', 'required'])
  if ~file_test(file) then message, 'File does not exist, cannot read.'
  nLines = file_lines(file)
  if (nLines eq 0) then return, ''
  strings = strarr(nLines)
  openr, lun, file, /get_lun
  readf, lun, strings
  free_lun, lun
  return, strings
end

;+
; :Description:
;   Static method that writes string content to disk. The folder
;   for the file is created if needed.
;
; :Arguments:
;   file: in, required, String
;     Filepath to the file that is written.
;   strings: in, required, String | Array<String>
;     Content to write to the file.
;
;-
pro luna_sol_base_obj::write_file, file, strings
  compile_opt idl2, hidden, static
  on_error, 2
  sol_validate, hash('file', ['string', 'required'], 'strings', ['required'])
  dir = file_dirname(file)
  if ~file_test(dir) then file_mkdir, dir
  openw, lun, file, /get_lun
  printf, lun, strings, /implied_print
  free_lun, lun
end

;+
; :Private:
;
; :Description:
;   Get property method that works with the dot notation.
;
; :Keywords:
;   _ref_extra: out, optional, any
;     Any property in the object definition.
;
;-
pro luna_sol_base_obj::GetProperty, _ref_extra = extra
  compile_opt idl2, hidden
  if ~self.debug then on_error, 2

  if (extra ne !null) then begin
    ; get self tag names, first three are related to IDL_Object and not needed
    properties = (tag_names(self))[3 : *]

    foreach property, strupcase(extra) do begin
      prop_idx = (where(property eq properties, is_prop))[0]
      if (is_prop eq 1) then begin
        currentvalue = self.(3 + prop_idx)

        case (1) of
          isa(currentvalue, 'list') or isa(currentvalue, 'hash'): begin
            (scope_varfetch(property, /ref_extra)) = currentvalue
          end

          (currentvalue eq !null): begin
            (scope_varfetch(property, /ref_extra)) = !null
          end

          else: begin
            (scope_varfetch(property, /ref_extra)) = currentvalue
          end
        endcase
      endif else begin
        message, 'Property "' + property + '" is not a valid object property!', level = -1
      endelse
    endforeach
  endif
end

;+
; :Private:
;
; :Description:
;   Set property method that works with the dot notation.
;
; :Keywords:
;   _ref_extra: in, optional, any
;     Any property in the object definition.
;
;-
pro luna_sol_base_obj::SetProperty, _ref_extra = extra
  compile_opt idl2, hidden
  on_error, 2

  if (extra ne !null) then begin
    ; get self tag names, first three are related to IDL_Object and not needed
    properties = (tag_names(self))[3 : *]

    foreach property, strupcase(extra) do begin
      prop_idx = (where(property eq properties, is_prop))[0]
      if (is_prop eq 1) then begin
        new_value = scope_varfetch(property, /ref_extra)
        self._setProperty, property, prop_idx, new_value
      endif else begin
        message, 'Property "' + property + '" is not a valid object property!', level = -1
      endelse
    endforeach
  endif
end

;+
; :Private:
;
; :Description:
;   Underlying set property method. Setting a property to `!NULL` is
;   only supported for strings and objects.
;
; :Arguments:
;   property: in, required, String
;     Name of the property.
;   prop_idx: in, required, Long
;     Index of the property in the structure, not counting the
;     first three tags of IDL_Object.
;   new_value: in, required, any
;     New value for the property.
;
;-
pro luna_sol_base_obj::_SetProperty, property, prop_idx, new_value
  compile_opt idl2, hidden
  if isa(new_value, /null) then begin
    old_value = self.(3 + prop_idx)
    case 1 of
      (old_value.typecode eq 7): self.(3 + prop_idx) = ''
      (old_value.typecode eq 11): self.(3 + prop_idx) = obj_new()
      else: begin
        message, 'Cannot set property "' + property + '" to !NULL because the datatype (' + typename(old_value) + ') will not allow it!', level = -1
      end
    endcase
  endif else begin
    self.(3 + prop_idx) = new_value
  endelse
end

;+
; :Private:
;
; :Description:
;   Wrapper that makes implied print use the same output as `_OverloadPrint`.
;
; :Returns: String
;
; :Arguments:
;   varname: in, required, String
;     Name of the variable being printed.
;
;-
function luna_sol_base_obj::_OverloadImpliedPrint, varname
  compile_opt idl2, hidden
  return, self.luna_sol_base_obj::_overloadPrint()
end

;+
; :Private:
;
; :Description:
;   Overloads printing to show the object properties. If the object is
;   printed from within another routine, only the name of the class is shown.
;
; :Returns: String
;
;-
function luna_sol_base_obj::_OverloadPrint
  compile_opt idl2, hidden
  tags = tag_names(self)
  sorted = sort(tags[3 : *])
  output = list()

  output.add, strupcase(tag_names(self, /structure_name))

  ; only show the details when printing from the command line
  if (n_elements(scope_traceback()) gt 3) then return, output[0]

  ; determine the number of white spaces we need to add
  maxlen = max(strlen(tags)) + 6

  for k = 0, n_elements(sorted) - 1 do begin
    i = 3 + sorted[k]

    help, self.(i), output = o
    split = strsplit(o, /extract)
    type = split[1]
    add = ''
    for j = 0, maxlen - strlen(tags[i]) do add += ' '
    output.add, string(9b) + strupcase(tags[i]) + add + type

    case 1 of
      isa(self.(i), 'LIST') or isa(self.(i), 'HASH'): begin
        help, self.(i), output = o
        type = strjoin((strsplit(o, /extract))[1 : *], ' ')
        output.add, string(9b) + string(9b) + type
      end
      (self.(i) eq !null): begin
        output.add, string(9b) + string(9b) + '!NULL'
      end
      isa(self.(i), 'OBJREF'): begin
        ; only get typename so that we dont have infinite recursion
        output.add, string(9b) + string(9b) + typename(self.(i))
      end
      else: begin
        output.add, string(9b) + string(9b) + strjoin(strtrim(string(self.(i), /implied_print), 2), '     ')
      end
    endcase
  endfor

  return, strjoin(output.toArray(), string(10b))
end

;+
; :Description:
;   Prints text to the console and, optionally, to a log file. All messages
;   respect the `quiet` and `verbose` properties:
;
;   - quiet = 0 -> all prints, warnings, and verbose messages when `verbose` is set
;   - quiet = 1 -> only warnings
;   - quiet = 2 -> no messages
;
; :Arguments:
;   msg: in, required, String | Array<String>
;     The message to print.
;
; :Keywords:
;   clear_log: in, optional, Boolean
;     If set, the log file is truncated before the message is written.
;   implied_print: in, optional, Boolean
;     If set, the message is printed as if the variable name was typed
;     at the IDL console.
;   log_only: in, optional, Boolean
;     If set, the message is only written to `LOGFILE`.
;   logfile: in, optional, String
;     File that the message is also printed to. The file is created if it
;     does not exist.
;   space_after: in, optional, Boolean
;     Print an empty line after the message.
;   space_before: in, optional, Boolean
;     Print an empty line before the message.
;   verbose: in, optional, Boolean
;     Set if the message is only printed when `verbose` is set.
;   warning: in, optional, Boolean
;     Set if the message is a warning.
;
;-
pro luna_sol_base_obj::_print, msg, $
  clear_log = clear_log, $
  implied_print = implied_print, $
  logfile = logfile, $
  log_only = log_only, $
  space_after = space_after, $
  space_before = space_before, $
  verbose = verbose, $
  warning = warning
  compile_opt idl2, hidden
  if ~self.debug then on_error, 2

  sol_validate, hash('msg', ['required', 'string'])

  case (1) of
    ; no verbose print if self.verbose is not set or quiet is nonzero
    keyword_set(verbose) and ~keyword_set(self.verbose): ; skip
    keyword_set(verbose) and (self.quiet gt 0): ; skip

    ; no print if warning and quiet is 2
    keyword_set(warning) and (self.quiet eq 2): ; skip

    ; skip print if quiet is nonzero and no keywords set
    ~keyword_set(warning) and ~keyword_set(verbose) and (self.quiet gt 0): ; skip

    ; default print if quiet eq 0
    else: begin
      if keyword_set(space_before) and ~keyword_set(log_only) then print
      if ~keyword_set(log_only) then print, msg, implied_print = implied_print
      if keyword_set(space_after) and ~keyword_set(log_only) then print

      if keyword_set(logfile) then begin
        if ~file_test(logfile) or keyword_set(clear_log) then begin
          openw, lun, logfile, /get_lun
        endif else begin
          openu, lun, logfile, /get_lun, /append
        endelse
        if keyword_set(space_before) then printf, lun, '', /implied_print
        printf, lun, msg, /implied_print
        if keyword_set(space_after) then printf, lun, '', /implied_print
        free_lun, lun
      endif
    end
  endcase
end

;+
; :Luna_Sol_Base_Obj:
;   bridge_debug_log: String
;     Fully-qualified path to a file that the child process output
;     is written to. Empty to use a temporary file.
;   coverage: Hash<any>
;     Code coverage information by file and routine
;   coverageStats: Hash<any>
;     Overall code coverage statistics
;   debug: Int
;     Non-zero to stop on errors instead of returning to the caller.
;   profile: Long
;     Non-zero if the IDL profiler is used while running tests
;   quiet: Int
;     Message level: 0 for all messages, 1 for warnings only, 2 for none.
;   verbose: Int
;     Non-zero to also print verbose messages.
;
;-
pro luna_sol_base_obj__define
  compile_opt idl2, hidden
  struct = {Luna_Sol_Base_Obj, $
    inherits IDL_Object, $
    quiet: 0, $
    verbose: 0, $
    debug: 0, $
    bridge_debug_log: '', $
    profile: 0l, $
    coverage: orderedhash(), $
    coverageStats: orderedhash() $
    }
end
