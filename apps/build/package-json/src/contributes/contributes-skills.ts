import { FindFiles, GetExtensionPath } from '@idl/idl/files';
import { basename, dirname } from 'path';

import { IPackageJSON, IPackageNLS } from '../package.interface';

/**
 * Searches for all SKILL.md (case-sensitive) files under resources/agents/skills/
 * and adds them to the package.json chatSkills contribution point.
 */
export async function ProcessSkills(
  packageJSON: IPackageJSON,
  nls: IPackageNLS,
) {
  // get all of our contribution points
  const contrib = packageJSON['contributes'];

  /** Root folder that skills are in */
  const skillPath = 'resources/agents/skills';

  /** Root skills folder relative to workspace */
  const skillsDir = GetExtensionPath(skillPath);

  // populate value
  contrib['chatSkills'] = (await FindFiles(skillsDir, '**/*SKILL.md'))
    .sort((a, b) => a.localeCompare(b))
    .map((file) => {
      return {
        path: `./${skillPath}/${basename(dirname(file))}/SKILL.md`,
      };
    });
}
