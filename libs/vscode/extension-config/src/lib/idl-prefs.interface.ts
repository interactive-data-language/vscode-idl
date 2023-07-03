/** Boolean values for IDL */
export type IDLBoolean = 0 | 1;

/**
 * IDL's preferences, by environment variable, with how they can be configured
 */
export interface IDLPreferences {
  IDL_CUSTOM_COLORS: string;
  IDL_DATAFILE_USER_COMMENTS: IDLBoolean; // 1
  IDL_DEVICE: string;
  IDL_EDIT_INPUT: IDLBoolean; // 1
  IDL_EXCEPT: number; // 1
  // IDL_MORE: IDLBoolean; // 1
  // IDL_MESSAGE_PREFIX: string;
  // IDL_PROMPT: string; // 'IDL>'
  // IDL_RBUF_PERSIST: IDLBoolean; // 1
  // IDL_RBUF_SIZE: number; // 0
  // IDL_UPDATE_CHECK: IDLBoolean;

  // internal update preferences
  IDL_UPDATE_DOWNLOAD: string;
  IDL_UPDATE_LASTCHECK: number;
  IDL_UPDATE_URL: string;
  IDL_UPDATE_VERSION: string;

  // preferences
  IDL_DIR: string;
  IDL_DLM_PATH: string; // '<IDL_DEFAULT>'
  // IDL_PATH: string;
  IDL_START_DIR: string;
  IDL_MAKE_DLL_COMPILE_DIRECTORY: string;
  IDL_PACKAGE_PATH: string; // '<IDL_DEFAULT>'
  IDL_PATH_CACHE_DISABLE: IDLBoolean;
  IDL_PREF_DIR: string;
  IDL_STARTUP: string;
  IDL_TMPDIR: string;

  // hidden path preferences
  IDL_HELP_PATH: string;

  // CPU settings
  IDL_CPU_TPOOL_MIN_ELTS: number; // 0
  IDL_CPU_TPOOL_MAX_ELTS: number; // 100000
  IDL_CPU_TPOOL_NTHREADS: number; // 0
  IDL_CPU_VECTOR_ENABLE: IDLBoolean; // 1

  // graphics
  IDL_GR_TILECACHESIZE: number; // 0
  IDL_GR_TTCACHESIZE: number; // 256

  // linux preferences
  IDL_GR_X_COLORS: number;
  IDL_GR_X_DEPTH: number;
  IDL_GR_X_WIDTH: number; // 640
  IDL_GR_X_HEIGHT: number; // 512
  IDL_GR_X_ONTOP: IDLBoolean; // 1
  IDL_GR_X_QSCREEN: IDLBoolean; // 1
  IDL_GR_X_RENDERER: IDLBoolean; // 0
  IDL_GR_X_RETAIN: IDLBoolean; // 1
  IDL_GR_X_VISUAL: number;

  // windows preferences
  IDL_GR_WIN_WIDTH: number; // 640
  IDL_GR_WIN_HEIGHT: number; // 512
  IDL_GR_WIN_LAYOUT: IDLBoolean; // 0
  IDL_GR_WIN_ONTOP: IDLBoolean; // 1
  IDL_GR_WIN_QSCREEN: IDLBoolean; // 1
  IDL_GR_WIN_RENDERER: IDLBoolean; // 0
  IDL_GR_WIN_RETAIN: IDLBoolean; // 1
}
