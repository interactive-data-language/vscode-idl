/**
 * Data structure for IDL directories by OS
 */
export interface IDLDirs {
  // index signature
  [key: string]: string[];
  darwin: string[];
  linux: string[];
  win32: string[];
  aix: string[];
  freebsd: string[];
  openbsd: string[];
  sunos: string[];
}

/**
 * IDL installation directories by OS
 */
export const IDL_DIRS: IDLDirs = {
  /**
   * Don't forget to add arm for future versions
   */
  darwin: [
    '/Applications/NV5/envi61/idl91/bin/bin.darwin.x86_64',
    '/Applications/NV5/idl91/bin/bin.darwin.x86_64',
    '/Applications/NV5/idl91/bin/bin.darwin.arm64',
    '/Applications/NV5/envi60/idl90/bin/bin.darwin.x86_64',
    '/Applications/NV5/idl90/bin/bin.darwin.x86_64',
    '/Applications/NV5/idl90/bin/bin.darwin.arm64',
    '/Applications/harris/envi57/idl89/bin/bin.darwin.x86_64',
    '/Applications/harris/idl89/bin/bin.darwin.x86_64',
    '/Applications/harris/envi56/idl88/bin/bin.darwin.x86_64',
    '/Applications/harris/idl88/bin/bin.darwin.x86_64',
    '/Applications/harris/envi55/idl87/bin/bin.darwin.x86_64',
    '/Applications/harris/idl87/bin/bin.darwin.x86_64',
    '/Applications/harris/envi54/idl86/bin/bin.darwin.x86_64',
    '/Applications/harris/idl86/bin/bin.darwin.x86_64',
  ],
  linux: [
    '/usr/local/nv5/envi61/idl91/bin/bin.linux.x86_64',
    '/usr/local/nv5/idl91/bin/bin.linux.x86_64',
    '/usr/local/nv5/envi60/idl90/bin/bin.linux.x86_64',
    '/usr/local/nv5/idl90/bin/bin.linux.x86_64',
    '/usr/local/harris/envi57/idl89/bin/bin.linux.x86_64',
    '/usr/local/harris/idl89/bin/bin.linux.x86_64',
    '/usr/local/harris/envi56/idl88/bin/bin.linux.x86_64',
    '/usr/local/harris/idl88/bin/bin.linux.x86_64',
    '/usr/local/harris/envi55/idl87/bin/bin.linux.x86_64',
    '/usr/local/harris/idl87/bin/bin.linux.x86_64',
    '/usr/local/harris/envi54/idl86/bin/bin.linux.x86_64',
    '/usr/local/harris/idl86/bin/bin.linux.x86_64',
  ],
  win32: [
    'C:\\Program Files\\NV5\\ENVI61\\IDL91\\bin\\bin.x86_64',
    'C:\\Program Files\\NV5\\IDL91\\bin\\bin.x86_64',
    'C:\\Program Files\\NV5\\ENVI60\\IDL90\\bin\\bin.x86_64',
    'C:\\Program Files\\NV5\\IDL90\\bin\\bin.x86_64',
    'C:\\Program Files\\Harris\\ENVI57\\IDL89\\bin\\bin.x86_64',
    'C:\\Program Files\\Harris\\IDL89\\bin\\bin.x86_64',
    'C:\\Program Files\\Harris\\ENVI56\\IDL88\\bin\\bin.x86_64',
    'C:\\Program Files\\Harris\\IDL88\\bin\\bin.x86_64',
    'C:\\Program Files\\Harris\\ENVI55\\IDL87\\bin\\bin.x86_64',
    'C:\\Program Files\\Harris\\IDL87\\bin\\bin.x86_64',
    'C:\\Program Files\\Harris\\ENVI54\\IDL86\\bin\\bin.x86_64',
    'C:\\Program Files\\Harris\\IDL86\\bin\\bin.x86_64',
  ],

  // other OS values, just in case we come across them
  aix: [],
  freebsd: [],
  openbsd: [],
  sunos: [],
};
