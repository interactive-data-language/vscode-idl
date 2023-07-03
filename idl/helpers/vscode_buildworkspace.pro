;+
; :Description:
;   Procedure that recursively identifies routines that we need
;   to compile and include as dependencies given an initial list
;   of unresolved routines
;
; :Arguments:
;   bdg: in, required, IDL_IDLBridge
;     Specify the IDL-IDLBridge session to run our commands in
;     to keep our current process clean
;   routines: in, required, List<any>
;     A list of procedures and functions for us to resolve
;   processed: in, optional, Hash<any>
;     A hash that tracks the routines we have processed to limit recursion
;   skip: in, optional, Hash<any>
;     A hash that tracks the routines we should skip (internal or not found)
;     to limit recursion.
;
;-
pro build_recursive_resolve, bdg, routines, processed, skip
  compile_opt idl2

  ; track routines that we have processed
  if ~keyword_set(processed) then processed = hash(/fold_case)
  if ~keyword_set(skip) then skip = hash(/fold_case)

  ; flag if we have changes and need to recurse
  changes = !false

  ; reset bridge
  bdg.execute, '.reset'

  ; reset path in child process - weird thing with resolving objects called as functions
  ; when they are on your path
  ; bdg.execute, 'pref_set, "IDL_PATH", /DEFAULT, /COMMIT & path_cache, /REBUILD'

  ; compile all routines that we are aware of
  foreach routine, routines do begin
    ; skip if we have processed a routine or not
    if skip.hasKey(routine) or processed.hasKey(routine) or strtrim(routine, 2) eq '' then continue

    ; nicely handle errors
    catch, err
    if (err ne 0) then begin
      catch, /cancel
      ; help, /last_message
      message, /reset
      continue
    endif

    ; compile file
    ; bdg.execute, '.compile "' + routine + '"'
    bdg.execute, 'resolve_routine, "' + routine + '", /COMPILE_FULL_FILE, /EITHER'
    catch, /cancel

    ; check for source location
    catch, err
    if (err ne 0) then begin
      catch, /cancel

      catch, err
      if (err ne 0) then begin
        catch, /cancel
        continue
      endif
      bdg.execute, 'info = json_serialize(routine_info("' + routine + '", /source, /function))'
    endif else begin
      bdg.execute, 'info = json_serialize(routine_info("' + routine + '", /source))'
      catch, /cancel
    endelse

    ; get and parse the source struct
    src = json_parse(bdg.getVar('info'), /fold_case)

    ; skip internal routines
    if src['path'].startsWith(!dir) or ~keyword_set(src['path']) then begin
      skip[routine] = !true
      continue
    endif

    ; made it here, so indicate we have changes
    changes = !true
    processed[routine] = !true
  endforeach

  ; check if we have changes
  if changes then begin
    ; get the unresolved routines
    bdg.execute, 'info = json_serialize(orderedhash("procedures", routine_info(/UNRESOLVED), "functions", routine_info(/FUNCTIONS, /UNRESOLVED)))'
    allRoutines = json_parse(bdg.getVar('info'))

    ; concat together
    toProcess = list()
    if isa(allRoutines['procedures'], 'list') then toProcess.add, allRoutines['procedures'], /extract
    if isa(allRoutines['functions'], 'list') then toProcess.add, allRoutines['functions'], /extract

    ; recurse
    build_recursive_resolve, bdg, toProcess, processed, skip
  endif
end

;+
; :Description:
;   Procedure that manages building a folder of code
;
;   Here's the process it follows:
;   1. Copied file to the "dist" folder
;   2. Cleans up files we don't need
;   3. Compiles direct source files into SAVE files
;   4. Gets first pass at unresolved routines
;   5. Recursively finds dependencies and their dependencies
;   6. Any dependency not located in the !dir folder we attempt to
;      compile and save
;
;-
pro build
  compile_opt idl2

  ;+ get current folder
  thisDir = file_dirname(routine_filepath())

  ;+ specify the folder where our soruce code lives
  srcDir = thisDir + path_sep() + 'src'
  if ~file_test(srcDir, /directory) then message, 'Source folder not found where expected'

  ;+ specify the output folder
  outDir = thisDir + path_sep() + 'dist'

  ; make folder if it doesnt exist
  if file_test(outDir, /directory) then file_delete, outDir, /recursive

  ; copy source to dist
  file_copy, srcDir, outDir, /recursive

  ;+ specify the folder for our dependencies
  depDir = thisDir + path_sep() + 'dist' + path_sep() + 'deps'
  if ~file_test(depDir, /directory) then file_mkdir, depDir

  ;+ Specify routines to skip
  skipThese = hash(/fold_case)
  skipThese['envi'] = !true
  skipThese['envi_doit'] = !true
  skipThese['envizoom'] = !true
  skipThese['tic'] = !true
  skipThese['toc'] = !true

  ;+ Track files to delete and not include int he builds
  delete = hash()
  delete['atcorrectimagery.pro'] = !true
  delete['atcorrectimagerywithflaash.task'] = !true
  delete['atcorrectimagerywithquac.task'] = !true

  ; delete excess or unwanted task files
  files = file_search(outDir, '*.task', count = nCleanup)
  if (nCleanup gt 0) then begin
    foreach file, files do begin
      case (!true) of
        delete.hasKey(file_basename(file)): file_delete, file
        else: ; do nothing
      endcase
    endforeach
  endif

  ; delete excess files
  files = file_search(outDir, '*.pro*', count = nCleanup)
  if (nCleanup gt 0) then begin
    foreach file, files do begin
      case (!true) of
        file.endsWith('.spec.pro'): file_delete, file
        file.endsWith('.spec.pro.log'): file_delete, file
        delete.hasKey(file_basename(file)): file_delete, file
        else: ; do nothing
      endcase
    endforeach
  endif

  ; find files again
  files = file_search(outDir, '*.pro', count = nProcess)
  if (nProcess eq 0) then message, 'No PRO code found after cleaning up excess files'

  ; get current path
  currentPath = !path

  ; update path to include just this folder
  newPath = '+' + thisDir + path_sep(/search_path) + '<IDL_DEFAULT>'

  ; create process to build files
  bdg = IDL_IDLBridge()
  bdg.setVar, 'path', byte(newPath) ; goofy to avoid strings that are too long
  bdg.execute, 'path = string(path)'
  bdg.execute, 'pref_set, "IDL_PATH", path, /COMMIT & path_cache, /REBUILD'

  ; compile and save all of our PRO files
  foreach file, files do begin
    bdg.execute, '.reset'
    bdg.execute, '.compile "' + file + '"'
    bdg.execute, 'save, /ROUTINES, FILENAME = "' + file.replace('.pro', '.sav') + '", /COMPRESS'
  endforeach

  ; reset bridge
  bdg.execute, '.reset'

  ; compile all routines that we are aware of
  foreach file, files do begin
    ; compile file
    bdg.execute, '.compile "' + file + '"'

    ; clean up PRO file
    file_delete, file
  endforeach

  ; get the routines in our files
  bdg.execute, 'info = json_serialize(orderedhash("procedures", routine_info(/UNRESOLVED), "functions", routine_info(/FUNCTIONS, /UNRESOLVED)))'
  allRoutines = json_parse(bdg.getVar('info'))

  ; reset bridge
  bdg.execute, '.reset'

  ; initialize routines that we have processed
  processed = hash(/fold_case)

  ; concat unresolved functions and procedures ttogether
  toProcess = list()
  if isa(allRoutines['procedures'], 'list') then toProcess.add, allRoutines['procedures'], /extract
  if isa(allRoutines['functions'], 'list') then toProcess.add, allRoutines['functions'], /extract

  ; recurse
  build_recursive_resolve, bdg, toProcess, processed

  ; add object classes for resolving
  processed['awesomeenviprogress__define'] = !true

  ; process each dependency
  foreach routine, processed.keys() do begin
    ; return if we should be skipping
    if skipThese.hasKey(routine) then continue

    ; reset bridge
    bdg.execute, '.reset'

    ; nicely handle errors
    catch, err
    if (err ne 0) then begin
      catch, /cancel
      message, /reset
      continue
    endif

    ; attempt to resolve our routine
    bdg.execute, 'resolve_routine, "' + routine + '", /COMPILE_FULL_FILE, /EITHER'

    ; dont catch
    catch, /cancel

    ; we found it, so save
    bdg.execute, 'save, /ROUTINES, FILENAME="' + depDir + path_sep() + strlowcase(routine) + '.sav"'
  endforeach

  ; clean up
  obj_destroy, bdg
end