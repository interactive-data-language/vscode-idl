;+
; :Arguments:
;   dir: in, required, String
;     Package directory
;   metadata: bidirectional, required, Hash<any>
;     Package metadata
;   config: in, required, List<String>
;     Instruction files, relative to the package directory
;
;-
pro vscode_createManifest_manageInstructions, dir, metadata, config
  compile_opt idl2, hidden
  on_error, 2

  ; return if nothing to save
  if (n_elements(config) eq 0) then return

  ;+ create instruction metadata
  instructionMeta = orderedhash()

  foreach instruction, config do begin
    ;+ instruction file
    file = strjoin([dir, instruction], path_sep())
    if ~file_test(file) then message, `Declared instruction file doesn't exist: ${file}`

    ;+ frontmatter
    frontmatter = vscode_createManifest_parseFrontmatter(file)
    if ~frontmatter.hasKey('id') then message, `Instruction is missing an "id" in its frontmatter: ${file}`

    ;+ instruction ID must match the file name (without the .instructions.md suffix)
    id = frontmatter['id']
    fileName = file_basename(file)
    expected = id + '.instructions.md'
    if ~strcmp(fileName, expected, /fold_case) then $
      message, `Instruction file "${fileName}" does not match the instruction ID "${id}" (expected "${expected}"): ${file}`

    instructionMeta[id] = strjoin(vscode_createManifest_readFile(file), `\n`)
  endforeach

  ; save metadata
  metadata['agent_instructions'] = instructionMeta
end
