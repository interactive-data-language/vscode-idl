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
pro vscode_BuildWorkspace_resolve, bdg, routines, processed, skip
  compile_opt idl2, hidden

  ; track routines that we have processed
  if ~keyword_set(processed) then processed = hash(/fold_case)
  if ~keyword_set(skip) then skip = hash(/fold_case)

  ; flag if we have changes and need to recurse
  changes = !false

  ; reset bridge
  bdg.Execute, '.reset'

  ; reset path in child process - weird thing with resolving objects called as functions
  ; when they are on your path
  ; bdg.execute, 'pref_set, "IDL_PATH", /DEFAULT, /COMMIT & path_cache, /REBUILD'

  ; compile all routines that we are aware of
  foreach routine, routines do begin
    ; skip if we have processed a routine or not
    if skip.HasKey(routine) or processed.HasKey(routine) or strtrim(routine, 2) eq '' then continue

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
    bdg.Execute, 'resolve_routine, "' + routine + '", /COMPILE_FULL_FILE, /EITHER'
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
      bdg.Execute, 'info = json_serialize(routine_info("' + routine + '", /source, /function))'
    endif else begin
      bdg.Execute, 'info = json_serialize(routine_info("' + routine + '", /source))'
      catch, /cancel
    endelse

    ; get and parse the source struct
    src = json_parse(bdg.GetVar('info'), /fold_case)

    ; skip internal routines
    if src['path'].StartsWith(!dir) or ~keyword_set(src['path']) then begin
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
    bdg.Execute, 'info = json_serialize(orderedhash("procedures", routine_info(/UNRESOLVED), "functions", routine_info(/FUNCTIONS, /UNRESOLVED)))'
    allRoutines = json_parse(bdg.GetVar('info'))

    ; concat together
    toProcess = list()
    if isa(allRoutines['procedures'], 'list') then toProcess.Add, allRoutines['procedures'], /extract
    if isa(allRoutines['functions'], 'list') then toProcess.Add, allRoutines['functions'], /extract

    ; recurse
    vscode_BuildWorkspace_resolve, bdg, toProcess, processed, skip
  endif

  s = {myProp: 5, otherProp: 6}
end

;+
; :Arguments:
;   workspace: in, required, String
;     Workspace we are searching for files
;   destination: in, required, String
;     Location we copy to
;   types: in, required, Array<String>
;     File extensions that we copy as part of the build
;
;-
pro vscode_BuildWorkspace_CopyFiles, workspace, destination, types
  compile_opt idl2, hidden

  ; search for files
  files = file_search(workspace, '*', count = nfiles, /test_regular)

  ; make sure we found files
  if (nfiles eq 0) then $
    message, 'No files found to build', level = -1

  ; get locations of file extensions
  dot = strpos(files, '.')

  ; get files with extensions to check
  idxCheck = where(dot ne -1, countCheck)

  ; make sure we have file extensions to check
  if (countCheck eq 0) then $
    message, 'No files found to build', level = -1

  ; pluck the file extensions
  extensions = strlowcase(files[idxCheck].Substring(dot))

  ; make hash of allowed types
  okExtensions = hash(types, replicate(!true, n_elements(types)))

  ; get extensions we keep
  idxOk = where(okExtensions.HasKey(extensions), countKeep)

  ; make sure that we have files
  if (countKeep eq 0) then $
    message, 'No files found to build', level = -1

  ; copy files
  file_copy, files[idxCheck[idxOk]], destination
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
; :Arguments:
;   workspace: in, required, String
;     Fully-qualified path to the workspace that we want to build/compile
;
;-
pro vscode_BuildWorkspace, workspace
  compile_opt idl2, hidden
  on_error, 2

  ; make sure we have a workspace to build
  if (workspace eq !null) then $
    message, 'Workspace not specified, required!', level = -1

  ; make sure the folder exists
  if ~file_test(workspace, /directory) then $
    message, 'Workspace specified, but folder does not exist!', level = -1

  ;+ get current folder
  thisDir = file_dirname(routine_filepath())

  ;+ specify the folder where our soruce code lives
  srcDir = thisDir + path_sep() + 'src'
  if ~file_test(srcDir, /directory) then message, 'Source folder not found where expected'

  ;+ specify the output folder
  outDir = workspace + path_sep() + 'dist'

  ; clean up if the output folder exists already
  if file_test(outDir, /directory) then file_delete, outDir, /recursive

  ; make our output folder
  file_mkdir, outDir

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

  ;+ Track files to delete and not include in the builds
  delete = hash()
  delete['atcorrectimagery.pro'] = !true
  delete['atcorrectimagerywithflaash.task'] = !true
  delete['atcorrectimagerywithquac.task'] = !true

  ; delete excess or unwanted task files
  files = file_search(outDir, '*.task', count = nCleanup)
  if (nCleanup gt 0) then begin
    foreach file, files do begin
      case (!true) of
        delete.HasKey(file_basename(file)): file_delete, file
        else: ; do nothing
      endcase
    endforeach
  endif

  ; delete excess files
  files = file_search(outDir, '*.pro*', count = nCleanup)
  if (nCleanup gt 0) then begin
    foreach file, files do begin
      case (!true) of
        file.EndsWith('.spec.pro'): file_delete, file
        file.EndsWith('.spec.pro.log'): file_delete, file
        delete.HasKey(file_basename(file)): file_delete, file
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
  bdg.SetVar, 'path', byte(newPath) ; goofy to avoid strings that are too long
  bdg.Execute, 'path = string(path)'
  bdg.Execute, 'pref_set, "IDL_PATH", path, /commit & path_cache, /rebuild'

  ; compile and save all of our PRO files
  foreach file, files do begin
    bdg.Execute, '.reset'
    bdg.Execute, '.compile "' + file + '"'
    bdg.Execute, 'save, /routines, filename = "' + file.Replace('.pro', '.sav') + '", /compress'
  endforeach

  ; reset bridge
  bdg.Execute, '.reset'

  ; compile all routines that we are aware of
  foreach file, files do begin
    ; compile file
    bdg.Execute, '.compile "' + file + '"'

    ; clean up PRO file
    file_delete, file
  endforeach

  ; get the routines in our files
  bdg.Execute, 'info = json_serialize(orderedhash("procedures", routine_info(/UNRESOLVED), "functions", routine_info(/FUNCTIONS, /UNRESOLVED)))'
  allRoutines = json_parse(bdg.GetVar('info'))

  ; reset bridge
  bdg.Execute, '.reset'

  ; initialize routines that we have processed
  processed = hash(/fold_case)

  ; concat unresolved functions and procedures ttogether
  toProcess = list()
  if isa(allRoutines['procedures'], 'list') then toProcess.Add, allRoutines['procedures'], /extract
  if isa(allRoutines['functions'], 'list') then toProcess.Add, allRoutines['functions'], /extract

  ; recurse
  vscode_BuildWorkspace_resolve, bdg, toProcess, processed

  ; add object classes for resolving
  processed['awesomeenviprogress__define'] = !true

  ; process each dependency
  foreach routine, processed.Keys() do begin
    ; return if we should be skipping
    if skipThese.HasKey(routine) then continue

    ; reset bridge
    bdg.Execute, '.reset'

    ; nicely handle errors
    catch, err
    if (err ne 0) then begin
      catch, /cancel
      message, /reset
      continue
    endif

    ; attempt to resolve our routine
    bdg.Execute, 'resolve_routine, "' + routine + '", /compile_full_file, /either'

    ; dont catch
    catch, /cancel

    ; we found it, so save
    bdg.Execute, 'save, /routines, filename="' + depDir + path_sep() + strlowcase(routine) + '.sav"'
  endforeach

  ; clean up
  obj_destroy, bdg
end