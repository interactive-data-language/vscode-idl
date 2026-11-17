;+
; :Arguments:
;   packageDir: in, required, String
;     Package folder we create a manifest for
;
; :Keywords:
;   debug: in, optional, Boolean
;     If set, errors are stopped on
;   output_manifest_uri: in, optional, String
;     Fully-qualified path to where the manifest file should be written
;
;-
pro vscode_createManifest, packageDir, debug = debug, $
  output_manifest_uri = output_manifest_uri
  compile_opt idl2, hidden
  if ~keyword_set(debug) then on_error, 2

  ;+ normalize directory to not include paths
  dir = file_dirname(packageDir) + path_sep() + file_basename(packageDir)

  ;+ get the package file
  packageFile = strjoin([dir, 'idlpackage.json'], path_sep())

  ; parse the package
  package = json_parse(packageFile)

  ; create the manifest JSON
  manifest = orderedhash()

  ; populate
  manifest['uid'] = string(randomu(!null, 4, /ulong), format = '(4z8.8)')
  manifest['type'] = 'IPM'
  manifest['name'] = package['name']
  manifest['display_name'] = package.hasKey('display_name') ? package['display_name'] : manifest['name']
  manifest['version'] = package.hasKey('version') ? package['version'] : '1.0.0'
  manifest['author'] = package.hasKey('author') ? package['author'] : ''
  manifest['date'] = package.hasKey('date') ? package['date'] : ''
  manifest['description'] = package.hasKey('description') ? package['description'] : ''
  manifest['tags'] = package.hasKey('tags') ? list(strlowcase(package['tags'].toarray()), /extract) : list()

  ;+ track metadata for the package
  metadata = orderedhash()

  ; save metadata
  manifest['metadata'] = metadata

  ;+
  ; Process contribution points
  ;-
  if package.hasKey('declarations') then begin
    ; process each declaration
    foreach value, package['declarations'], key do begin
      case (!true) of
        ;+
        ; Check for instructions
        ;-
        strcmp(key, 'agent_instructions', /fold_case): begin
          vscode_createManifest_manageInstructions, dir, metadata, value
          vscode_createManifest_addTag, manifest['tags'], 'Agent Instructions'
        end

        ;+
        ; Check for skills
        ;-
        strcmp(key, 'agent_skills', /fold_case): begin
          vscode_createManifest_manageSkills, dir, metadata, value
          vscode_createManifest_addTag, manifest['tags'], 'Agent Skill'
        end

        ;+
        ; Check for ENVI extension
        ;-
        strcmp(key, 'envi_extensions', /fold_case): begin
          vscode_createManifest_manageENVIExtensions, dir, metadata, value
          vscode_createManifest_addTag, manifest['tags'], 'ENVI Extension'
        end

        ;+
        ; Check for ENVI Machine Learning Models
        ;-
        strcmp(key, 'envi_machine_learning_models', /fold_case): begin
          vscode_createManifest_manageENVIMachineLearningModels, dir, metadata, value
          vscode_createManifest_addTag, manifest['tags'], 'ENVI Machine Learning Model'
        end

        ;+
        ; Check for ENVI Modeler Workflows
        ;-
        strcmp(key, 'envi_modeler_workflows', /fold_case): begin
          vscode_createManifest_addTag, manifest['tags'], 'ENVI Modeler Workflow'
        end

        ;+
        ; Check for ENVI ONNX mdoels
        ;-
        strcmp(key, 'envi_onnx_models', /fold_case): begin
          vscode_createManifest_manageENVIONNXModels, dir, metadata, value
          vscode_createManifest_addTag, manifest['tags'], 'ENVI ONNX Model'
        end

        ;+
        ; Check for ENVI tasks
        ;-
        strcmp(key, 'envi_tasks', /fold_case): begin
          vscode_createManifest_manageTasks, 'envi_tasks', dir, metadata, value
          vscode_createManifest_addTag, manifest['tags'], 'ENVI Task'
        end

        ;+
        ; Check for ENVI Tool Workflows
        ;-
        strcmp(key, 'envi_tool_workflows', /fold_case): begin
          vscode_createManifest_manageToolWorkflows, 'envi_tool_workflows', dir, metadata, value
          vscode_createManifest_addTag, manifest['tags'], 'ENVI Tool Workflow'
        end

        ;+
        ; Check for IDL tasks
        ;-
        strcmp(key, 'idl_tasks', /fold_case): begin
          vscode_createManifest_manageTasks, 'idl_tasks', dir, metadata, value
          vscode_createManifest_addTag, manifest['tags'], 'IDL Task'
        end

        ;+
        ; Check for IDL tool workflows
        ;-
        strcmp(key, 'idl_tool_workflows', /fold_case): begin
          vscode_createManifest_manageToolWorkflows, 'idl_tool_workflows', dir, metadata, value
          vscode_createManifest_addTag, manifest['tags'], 'IDL Tool Workflow'
        end

        else: begin
          ; do nothing
        end
      endcase
    endforeach
  endif

  ;+ URI for manifest file
  manifestUri = keyword_set(output_manifest_uri) ? $
    output_manifest_uri : $
    strjoin([dir, 'manifest.json'], path_sep())

  ; write to disk
  openw, lun, manifestUri, /get_lun
  printf, lun, json_serialize(manifest, pretty = 2)
  free_lun, lun
end
