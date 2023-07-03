import { IStructureOverrideDetail } from '../overrides/detail.interface';
import { STRUCTURE_DISPLAY_NAME_OVERRIDE } from '../overrides/detail/structure-display-names';

/**
 * Returns the display name for methods to that they are normalized
 * for all docs and look a bit nicer than the default
 */
export function MethodDisplayName(name: string) {
  const split = name.split('::');
  return `${split[0]}::${split[1][0].toLowerCase()}${split[1].substring(1)}`;
}

/**
 * Returns the display name for methods to that they are normalized
 * for all docs and look a bit nicer than the default
 */
export function StructureDisplayName(
  name: string,
  override: IStructureOverrideDetail
) {
  if (override.display !== undefined) {
    return override.display;
  } else {
    if (name in STRUCTURE_DISPLAY_NAME_OVERRIDE) {
      return STRUCTURE_DISPLAY_NAME_OVERRIDE[name];
    } else {
      return `${name[0].toUpperCase()}${name.substring(1)}`;
    }
  }
}

/**
 * Returns nicely formatted display names for classes. Custom docs parsing needs
 * this in several places
 */
export function ClassDisplayName(name: string) {
  if (name.toUpperCase() === name) {
    return `${name[0]}${name.substring(1).toLowerCase()}`;
  } else {
    return `${name[0].toUpperCase()}${name.substring(1)}`;
  }
}
