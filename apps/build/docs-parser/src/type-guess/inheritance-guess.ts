import { INHERITANCE_OVERRIDE } from '../overrides/detail/inheritance-override.interface';

/**
 * Merge inheritance data and ignore existing values
 */
export function SmartMerge(ref: string[], add: string[]) {
  for (let i = 0; i < add.length; i++) {
    if (ref.indexOf(add[i]) === -1) {
      ref.push(add[i]);
    }
  }
}

/**
 * based on the name of a structure, determines things that we
 * inherit from
 */
export function InheritanceGuess(name: string): string[] {
  // get starting point for inheritance
  const res: string[] =
    name in INHERITANCE_OVERRIDE ? INHERITANCE_OVERRIDE[name] : [];

  switch (true) {
    // raster
    case name.startsWith('envi') &&
      name.endsWith('raster') &&
      name !== 'enviraster':
      SmartMerge(res, ['enviraster']);
      break;
    // envi task
    case name.startsWith('envi') &&
      name.endsWith('task') &&
      name !== 'envitask':
      SmartMerge(res, ['envitask']);
      break;
    case name.startsWith('envi') &&
      name.endsWith('pointcloud') &&
      name !== 'envipointcloud':
      SmartMerge(res, ['envipointcloud']);
      break;
    // idl task
    case name.startsWith('idl') && name.endsWith('task') && name !== 'idltask':
      SmartMerge(res, ['idltask']);
      break;
    // raster
    case name.startsWith('envi') && name.endsWith('job'):
      SmartMerge(res, [`idl${name.substring(4)}`]);
      break;
    // by default, nothing
    default:
  }

  return res;
}
