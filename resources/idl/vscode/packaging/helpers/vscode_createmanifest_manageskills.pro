;+
; :Arguments:
;   dir: in, required, String
;     Package directory
;   metadata: bidirectional, required, Hash<any>
;     Package metadata
;   config: in, required, List<String>
;     Skill folders, relative to the package directory
;
;-
pro vscode_createManifest_manageSkills, dir, metadata, config
  compile_opt idl2, hidden
  on_error, 2

  ; return if nothing to save
  if (n_elements(config) eq 0) then return

  ;+ create skill metadata
  skillMeta = orderedhash()

  foreach skillFolder, config do begin
    ;+ folder containing the skill
    folder = strjoin([dir, skillFolder], path_sep())
    if ~file_test(folder, /directory) then message, `Declared skill folder doesn't exist: ${folder}`

    ;+ skill file
    skillFile = strjoin([folder, 'SKILL.md'], path_sep())
    if ~file_test(skillFile) then message, `Skill folder is missing a SKILL.md file: ${folder}`

    ;+ frontmatter
    frontmatter = vscode_createManifest_parseFrontmatter(skillFile)
    if ~frontmatter.hasKey('name') then message, `Skill is missing a "name" in its frontmatter: ${skillFile}`

    ;+ skill ID must match the folder name
    id = frontmatter['name']
    folderName = file_basename(folder)
    if ~strcmp(id, folderName) then $
      message, `Skill folder "${folderName}" does not match the skill ID "${id}": ${skillFile}`

    skillMeta[id] = strjoin(vscode_createManifest_readFile(skillFile), `\n`)
  endforeach

  ; save metadata
  metadata['agent_skills'] = skillMeta
end
