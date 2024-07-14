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
;   unresolved: in, optional, Hash<any>
;     Track unresolved routines
;   skip: in, optional, Hash<any>
;     A hash that tracks the routines we should skip (internal or not found)
;     to limit recursion.
;
;-
pro vscode_BuildWorkspace_resolve, bdg, routines, processed, unresolved, skip
  compile_opt idl2, hidden

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
      unresolved[routine] = !null
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
    vscode_BuildWorkspace_resolve, bdg, toProcess, processed, unresolved, skip
  endif
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
  extensions = strlowcase(files[idxCheck].substring(dot))

  ; make hash of allowed types
  okExtensions = hash(types, replicate(!true, n_elements(types)))

  ; get extensions we keep
  idxOk = where(okExtensions.hasKey(extensions), countKeep)

  ; make sure that we have files
  if (countKeep eq 0) then $
    message, 'No files found to build', level = -1

  ; copy files
  file_copy, files[idxCheck[idxOk]], destination
end

;+
; :Description:
;   Compiles all code in a workspace and resolves all dependencies!
;
;   This routine expects that you have a folder called `src` at the root level of
;   a workspace with all code and content that needs to be packaged.
;
;   This routine copies the `src` folder into another directory called `dist` which
;   is deleted and re-created every time you build.
;
;   Dependency resolution is done using IDL's search path through VSCode with the workspace
;   preprended so it is always discovered first.
;
;   This means that, if your path is incorrect, not all dependencies will be properly
;   bundled as source code.
;
; :Arguments:
;   workspace: in, required, String
;     Fully-qualified path to the workspace that we want to build/compile
;
; :Keywords:
;   condense_to: in, optional, String
;     If set, represents the name of a single SAVE file that will hold all resolved
;     routines. By default, all routines are stored in separate SAVE files so this
;     option allows you to change that behavior, if desired.
;   description: in, optional, String
;     When `condense_to` is set, optionally specify a description for the file
;     that gets saved
;
; :Examples:
;
;   Here's a simple example showing how to run this procedure:
;
;   ```idl
;   vscode_BuildWorkspace, 'C:\Users\awesome-user\my-workspace'
;   ```
;
;   It does expect that all source code for the workspace is in a `src` folder
;   found within the workspace.
;
;-
pro vscode_BuildWorkspace, workspace, condense_to = condense_to, description = description
  compile_opt idl2, hidden
  on_error, 2

  ; make sure we have a workspace to build
  if (workspace eq !null) then $
    message, 'Workspace not specified, required!', level = -1

  ; make sure the folder exists
  if ~file_test(workspace, /directory) then $
    message, 'Workspace specified, but folder does not exist!', level = -1

  ;+ specify the folder where our source code lives
  srcDir = workspace + path_sep() + 'src'
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
  depDir = workspace + path_sep() + 'dist' + path_sep() + 'deps'
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
  newPath = strjoin(['+' + workspace, !path, '<IDL_DEFAULT>'], path_sep(/search_path))

  ; create process to build files
  bdg = IDL_IDLBridge()
  bdg.setVar, 'path', byte(newPath) ; goofy to avoid strings that are too long
  bdg.execute, 'path = string(path)'
  bdg.execute, 'pref_set, "IDL_PATH", path, /commit & path_cache, /rebuild'

  ; compile and save all of our PRO files
  foreach file, files do begin
    bdg.execute, '.reset'
    bdg.execute, '.compile "' + file + '"'
    bdg.execute, 'save, /routines, /compress, filename = "' + file.replace('.pro', '.sav') + '", /compress'
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

  ;+ track unresolved datasets
  unresolved = hash(/fold_case)

  ; recurse
  vscode_BuildWorkspace_resolve, bdg, toProcess, processed, unresolved

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
    bdg.execute, 'resolve_routine, "' + routine + '", /compile_full_file, /either'

    ; dont catch
    catch, /cancel

    ; we found it, so save
    bdg.execute, 'save, /routines, /compress, filename="' + depDir + path_sep() + strlowcase(routine) + '.sav"'
  endforeach

  ;+
  ; Check if we need to save all routines to a single file or not
  ;-
  if isa(condense_to, /string) then begin
    ;+ find SAVE files that we need to combine
    files = file_search(outDir, '*.sav', count = nFiles)

    ; verify that we have files
    if (nFiles gt 0) then begin
      ; reset bridge
      bdg.execute, '.reset'

      ; restore each file
      foreach file, files do bdg.execute, 'restore, "' + file + '"'

      ; clean up
      file_delete, files

      ; check if we have a description we need to pass through
      if isa(description, /string) then bdg.setVar, 'description', description

      ; save all routines back to disk
      bdg.execute, 'save, /routines, /compress, description=description, filename="' + strjoin([outDir, condense_to], path_sep()) + '"'
    endif

    ;+ find folders that we might need to remove if empty
    folders = file_search(outDir, '*', /test_directory, count = nDirs)
    if (nDirs gt 0) then begin
      ; check each sub-dir
      foreach folder, folders do begin
        !null = file_search(folder, '*', count = nSub)
        if (nSub eq 0) then file_delete, folder
      endforeach
    endif
  endif

  ; clean up
  obj_destroy, bdg

  ; get unresolved names
  unresolvedNames = (unresolved.keys()).sort()

  ; check if we have unresolved
  if (n_elements(unresolvedNames) gt 0) then begin
    ; alert user
    print, 'Detected unresolved routines, see "dist/unresolved.json"'
    print, '  to make sure critical dependencies are not missing. It is'
    print, '  normal to see "ENVI" routines in this list'

    ;+ file we write unresolved routines to
    uresolvedUri = outDir + path_sep() + 'unresolved.json'

    ; write to disk
    openw, lun, uresolvedUri, /get_lun
    printf, lun, json_serialize(unresolvedNames, /pretty)
    free_lun, lun
  endif
end