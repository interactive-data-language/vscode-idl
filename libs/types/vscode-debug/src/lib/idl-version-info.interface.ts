/**
 * Structure variable containing information about the version of IDL in use.
 * Corresponds to the !VERSION system variable.
 */
export interface IDLVersionInfo {
  /** CPU hardware architecture of the system (e.g., 'x86_64', 'arm64') */
  arch: string;
  /** The date and build identifier when the IDL executable was compiled, in the format "MMM DD YYYY (REVISION)" */
  build_date: string;
  /** The value of !dir for the IDL install */
  dir: string;
  /** The number of bits used to position file offsets (typically 64) */
  file_offset_bits: string;
  /** The number of bits used to address memory (typically 64) */
  memory_bits: string;
  /** The vendor name of the operating system (e.g., 'linux', 'darwin', 'Win32') */
  os: string;
  /** The generic name of the operating system (e.g., 'UNIX', 'Windows') */
  os_family: string;
  /** The vendor's name for the operating system environment */
  os_name: string;
  /** IDL version number */
  release: string;
}
