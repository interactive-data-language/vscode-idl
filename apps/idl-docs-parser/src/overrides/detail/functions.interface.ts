import {
  IDL_ANY_TYPE,
  IDL_ARRAY_TYPE,
  IDL_BOOLEAN_TYPE,
  IDL_INT_TYPE,
  IDL_LONG_TYPE,
  IDL_NUMBER_TYPE,
  IDL_STRING_TYPE,
  IDL_TYPE_CODE_TYPE,
  ParseIDLType,
} from '@idl/types/core';

import { IFunctionOverride } from '../detail.interface';
import { TYPE_FUNCTION_ARGS } from '../shared/dimension-args.interface';
import { ENVI_ERROR_KEYWORD } from '../shared/envi-error.interface';
import { SHARED_OVERRIDES } from '../shared/shared-types.interface';
import {
  BASIC_ARRAY_CREATION,
  INDGEN_KEYWORDS,
  THREAD_POOL_KEYWORDS,
} from '../shared/thread-pool.interface';

/**
 * Overrides for function metadata when generating internal docs
 */
export const FUNCTION_OVERRIDE: IFunctionOverride = {
  arg_present: {
    returns: IDL_BOOLEAN_TYPE,
    args: {},
    kws: {},
  },
  bandpass_filter: {
    args: {},
    kws: {
      reject: {
        type: IDL_BOOLEAN_TYPE,
        direction: 'in',
      },
    },
  },
  bindgen: {
    returns: ParseIDLType('Array<Byte>'),
    args: {},
    kws: INDGEN_KEYWORDS,
  },
  boolarr: {
    returns: ParseIDLType('Array<Boolean>'),
    args: {},
    kws: {},
  },
  byte: {
    returns: ParseIDLType('ArrayPromotion<Byte>'),
    args: TYPE_FUNCTION_ARGS,
    kws: THREAD_POOL_KEYWORDS,
  },
  bytarr: {
    returns: ParseIDLType('Array<Byte>'),
    args: {},
    kws: BASIC_ARRAY_CREATION,
  },
  ceil: {
    returns: ParseIDLType('ArrayPromotion<Long | Long64>'),
    args: {
      x: {
        direction: 'in',
        req: true,
      },
    },
    kws: {
      l64: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
        req: false,
      },
      ...THREAD_POOL_KEYWORDS,
    },
  },
  cindgen: {
    returns: ParseIDLType('Array<ComplexFloat>'),
    args: {},
    kws: INDGEN_KEYWORDS,
  },
  complex: {
    returns: ParseIDLType('ArrayPromotion<ComplexFloat>'),
    args: TYPE_FUNCTION_ARGS,
    kws: THREAD_POOL_KEYWORDS,
  },
  complexarr: {
    returns: ParseIDLType('Array<ComplexFloat>'),
    args: {},
    kws: BASIC_ARRAY_CREATION,
  },
  convol: {
    returns: ParseIDLType('Array<Number>'),
    args: {
      array: {
        direction: 'in',
        type: ParseIDLType('Array<Number>'),
      },
      kernel: {
        direction: 'in',
        type: ParseIDLType('Array<Number>'),
      },
      scale_factor: {
        direction: 'in',
        type: ParseIDLType('Array<Number>'),
      },
    },
    kws: {
      bias: {
        direction: 'in',
        type: IDL_NUMBER_TYPE,
      },
      center: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      edge_constant: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      edge_mirror: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      edge_reflect: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      edge_truncate: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      edge_wrap: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      edge_zero: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      invalid: {
        direction: 'in',
        type: IDL_NUMBER_TYPE,
      },
      missing: {
        direction: 'out',
        type: ParseIDLType('Array<Number>'),
      },
      nan: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      normalize: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
    },
  },
  dblarr: {
    returns: ParseIDLType('Array<Double>'),
    args: {},
    kws: BASIC_ARRAY_CREATION,
  },
  dcindgen: {
    returns: ParseIDLType('Array<DoubleComplex>'),
    args: {},
    kws: INDGEN_KEYWORDS,
  },
  dcomplex: {
    returns: ParseIDLType('ArrayPromotion<DoubleComplex>'),
    args: TYPE_FUNCTION_ARGS,
    kws: THREAD_POOL_KEYWORDS,
  },
  dcomplexarr: {
    returns: ParseIDLType('Array<DoubleComplex>'),
    args: {},
    kws: BASIC_ARRAY_CREATION,
  },
  dialog_colorpicker: {
    args: {},
    kws: {
      callback: {
        direction: 'in',
        type: IDL_STRING_TYPE,
      },
    },
  },
  dictionary: {
    args: {},
    kws: {
      extract: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      no_copy: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
    },
  },
  dindgen: {
    returns: ParseIDLType('Array<Double>'),
    args: {},
    kws: INDGEN_KEYWORDS,
  },
  double: {
    returns: ParseIDLType('ArrayPromotion<Double>'),
    args: TYPE_FUNCTION_ARGS,
    kws: THREAD_POOL_KEYWORDS,
  },
  envi: {
    args: {},
    kws: {
      current: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
        display: 'current',
        private: false,
        code: true,
        source: 'internal',
        docs: 'Set this keyword to get a reference to a currently running instance of ENVI. If this keyword is set and ENVI is not already running, the application will not be launched..',
      },
      error: ENVI_ERROR_KEYWORD,
      headless: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      language: {
        direction: 'in',
        type: IDL_STRING_TYPE,
      },
      layout: {
        direction: 'in',
        type: ParseIDLType('Array<Number>'),
      },
      log_file: {
        direction: 'in',
        type: IDL_STRING_TYPE,
      },
    },
  },
  enviraster: {
    args: {},
    kws: {
      auxiliary_spatialref: { ...SHARED_OVERRIDES.SPATIALREF, direction: 'in' },
      auxiliary_uri: { type: ParseIDLType(`Array<String>`), direction: 'in' },
      coord_sys: { type: ParseIDLType(`ENVICoordSys`), direction: 'in' },
      data_type: { type: IDL_NUMBER_TYPE, direction: 'in' },
      interleave: { ...SHARED_OVERRIDES.INTERLEAVE, direction: 'in' },
      metadata: { type: ParseIDLType(`ENVIRasterMetadata`), direction: 'in' },
      nbands: { type: IDL_NUMBER_TYPE, direction: 'in' },
      ncolumns: { type: IDL_NUMBER_TYPE, direction: 'in' },
      nrows: { type: IDL_NUMBER_TYPE, direction: 'in' },
      pyramid_exists: { type: IDL_BOOLEAN_TYPE, direction: 'out' },
      read_only: { type: IDL_BOOLEAN_TYPE, direction: 'out' },
      spatialref: { ...SHARED_OVERRIDES.SPATIALREF, direction: 'in' },
      time: { type: ParseIDLType(`ENVITime`), direction: 'in' },
      uri: { type: IDL_STRING_TYPE, direction: 'in' },
    },
  },
  execute: {
    returns: IDL_BOOLEAN_TYPE,
    args: {
      string: {
        type: IDL_STRING_TYPE,
      },
      compileflags: {
        type: IDL_NUMBER_TYPE,
      },
      quietexecution: {
        type: IDL_BOOLEAN_TYPE,
      },
    },
    kws: {},
  },
  factorial: {
    returns: IDL_NUMBER_TYPE,
    args: {
      n: {
        direction: 'in',
        type: IDL_ANY_TYPE,
      },
    },
    kws: {
      stirling: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      ul64: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
    },
  },
  findgen: {
    returns: ParseIDLType('Array<Float>'),
    args: TYPE_FUNCTION_ARGS,
    kws: INDGEN_KEYWORDS,
  },
  file_basename: {
    returns: ParseIDLType('ArrayPromotion<String>'),
    args: {
      path: {
        direction: 'in',
        type: ParseIDLType('String | Array<String>'),
      },
      remove_suffix: {
        direction: 'in',
        type: IDL_STRING_TYPE,
      },
    },
    kws: {
      mark_directory: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
    },
  },
  file_dirname: {
    returns: ParseIDLType('ArrayPromotion<String>'),
    args: {
      path: {
        direction: 'in',
        type: ParseIDLType('String | Array<String>'),
      },
    },
    kws: {
      mark_directory: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
    },
  },
  file_expand_path: {
    returns: ParseIDLType('ArrayPromotion<String>'),
    args: {
      path: {
        direction: 'in',
        type: ParseIDLType('String | Array<String>'),
      },
    },
    kws: {},
  },
  file_search: {
    returns: ParseIDLType('Array<String>'),
    args: {
      path_specification: {
        direction: 'in',
      },
      dir_specification: {
        direction: 'in',
      },
      recur_pattern: {
        direction: 'in',
      },
    },
    kws: {
      count: {
        direction: 'out',
        type: IDL_NUMBER_TYPE,
      },
    },
  },
  file_test: {
    returns: ParseIDLType('ArrayPromotion<Boolean>'),
    args: {
      file: {
        direction: 'in',
        type: ParseIDLType('String | Array<String>'),
      },
    },
    kws: {
      block_special: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      character_special: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      dangling_symlink: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      directory: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      executable: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      group: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      named_pipe: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      read: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      regular: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      setgid: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      setuid: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      socket: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      sticky_bin: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      symlink: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      user: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      write: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      zero_length: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      get_mode: {
        direction: 'out',
        type: IDL_ANY_TYPE,
      },
    },
  },
  filepath: {
    returns: IDL_STRING_TYPE,
    args: {
      filename: {
        direction: 'in',
        type: IDL_STRING_TYPE,
      },
    },
    kws: {
      terminal: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      tmp: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
    },
  },
  fix: {
    returns: ParseIDLType('ArrayPromotion<Int>'),
    args: TYPE_FUNCTION_ARGS,
    kws: THREAD_POOL_KEYWORDS,
  },
  float: {
    returns: ParseIDLType('ArrayPromotion<Float>'),
    args: TYPE_FUNCTION_ARGS,
    kws: THREAD_POOL_KEYWORDS,
  },
  floor: {
    returns: ParseIDLType('ArrayPromotion<Long | Long64>'),
    args: {
      x: {
        direction: 'in',
        req: true,
      },
    },
    kws: {
      l64: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
        req: false,
      },
      ...THREAD_POOL_KEYWORDS,
    },
  },
  fltarr: {
    returns: ParseIDLType('Array<Float>'),
    args: {},
    kws: BASIC_ARRAY_CREATION,
  },
  hash: {
    args: {},
    kws: {
      extract: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      fold_case: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      lowercase: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      no_copy: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
    },
  },
  histogram: {
    returns: ParseIDLType('Array<Number>'),
    args: {
      filename: {
        direction: 'in',
        type: ParseIDLType('Array<any>'),
      },
    },
    kws: {
      binsize: {
        direction: 'in',
        type: IDL_NUMBER_TYPE,
      },
      input: {
        direction: 'in',
        type: ParseIDLType('Array<Number>'),
      },
      locations: {
        direction: 'out',
        type: ParseIDLType('Array<Number>'),
      },
      l64: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      max: {
        direction: 'in',
        type: IDL_NUMBER_TYPE,
      },
      min: {
        direction: 'in',
        type: IDL_NUMBER_TYPE,
      },
      nan: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      nbins: {
        direction: 'in',
        type: IDL_NUMBER_TYPE,
      },
      omax: {
        direction: 'out',
        type: IDL_NUMBER_TYPE,
      },
      omin: {
        direction: 'out',
        type: IDL_NUMBER_TYPE,
      },
      reverse_indices: {
        direction: 'out',
        type: ParseIDLType('Array<Number>'),
      },
    },
  },
  identity: {
    returns: ParseIDLType('Array<Float>'),
    args: {},
    kws: {
      double: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
    },
  },
  idl_base64: {
    returns: ParseIDLType('String | Array<Byte>'),
    args: {
      input: {
        direction: 'in',
        type: ParseIDLType('Array<Byte> | String'),
      },
    },
    kws: {},
  },
  idlffshape: {
    args: {
      filename: {
        display: 'file',
        direction: 'in',
        type: IDL_STRING_TYPE,
        docs: 'Fully qualified path to the shapefile that you want to create, open, or update',
      },
    },
    kws: {},
  },
  indgen: {
    returns: ParseIDLType('Array<any>'),
    args: {},
    kws: {
      byte: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      complex: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      dcomplex: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      double: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      float: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      l64: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      long: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      string: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      uint: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      ul64: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      ulong: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      type: {
        direction: 'in',
        type: IDL_TYPE_CODE_TYPE,
      },
      ...INDGEN_KEYWORDS,
    },
  },
  intarr: {
    returns: ParseIDLType('Array<Int>'),
    args: {},
    kws: BASIC_ARRAY_CREATION,
  },
  isa: {
    returns: IDL_BOOLEAN_TYPE,
    args: {
      typename: {
        direction: 'in',
        type: IDL_STRING_TYPE,
      },
    },
    kws: {
      array: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      boolean: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      complex: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      file: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      float: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      integer: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      null: {
        direction: 'in',
        type: IDL_NUMBER_TYPE,
      },
      number: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      scalar: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      string: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
    },
  },
  json_parse: {
    returns: ParseIDLType('Hash<any> | Dictionary<any> | Structure'),
    args: {
      string: {
        direction: 'in',
        type: IDL_STRING_TYPE,
      },
    },
    kws: {
      dictionary: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      fold_case: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      toarray: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      tostruct: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
    },
  },
  json_serialize: {
    returns: ParseIDLType('String'),
    args: {
      value: {
        direction: 'in',
        type: ParseIDLType(
          'Hash | OrderedHash | Dictionary | List | Structure'
        ),
      },
    },
    kws: {
      lowercase: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      precision: {
        direction: 'in',
        type: IDL_NUMBER_TYPE,
      },
      pretty: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
    },
  },
  julday: {
    args: {},
    kws: {
      proleptic: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
    },
  },
  keyword_set: {
    returns: IDL_BOOLEAN_TYPE,
    args: {
      expression: {
        direction: 'in',
        type: IDL_ANY_TYPE,
      },
    },
    kws: {},
  },
  l64indgen: {
    returns: ParseIDLType('Array<Long64>'),
    args: {},
    kws: INDGEN_KEYWORDS,
  },
  long: {
    returns: ParseIDLType('ArrayPromotion<Long>'),
    args: TYPE_FUNCTION_ARGS,
    kws: THREAD_POOL_KEYWORDS,
  },
  long64: {
    returns: ParseIDLType('ArrayPromotion<Long64>'),
    args: TYPE_FUNCTION_ARGS,
    kws: THREAD_POOL_KEYWORDS,
  },
  lindgen: {
    returns: ParseIDLType('Array<Long>'),
    args: {},
    kws: INDGEN_KEYWORDS,
  },
  linfit: {
    returns: ParseIDLType('Array<Number>'),
    args: {
      x: {
        direction: 'in',
        type: ParseIDLType('Array<Number>'),
      },
      y: {
        direction: 'in',
        type: ParseIDLType('Array<Number>'),
      },
    },
    kws: {
      chisq: {
        direction: 'out',
        type: ParseIDLType('Array<Number>'),
      },
      covar: {
        direction: 'out',
        type: ParseIDLType('Array<Number>'),
      },
      double: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      measure_errors: {
        direction: 'in',
        type: ParseIDLType('Array<Number>'),
      },
      prob: {
        direction: 'out',
        type: ParseIDLType('Array<Number>'),
      },
      sigma: {
        direction: 'out',
        type: ParseIDLType('Array<Number>'),
      },
      yfit: {
        direction: 'out',
        type: ParseIDLType('Array<Number>'),
      },
    },
  },
  list: {
    args: {},
    kws: {
      extract: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      length: {
        direction: 'in',
        type: IDL_INT_TYPE,
      },
      no_copy: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
    },
  },
  lmgr: {
    args: {},
    kws: {
      demo: {
        type: IDL_BOOLEAN_TYPE,
        direction: 'in',
      },
      version: {
        type: IDL_STRING_TYPE,
        direction: 'in',
      },
    },
  },
  lon64arr: {
    returns: ParseIDLType('Array<Long64>'),
    args: {},
    kws: BASIC_ARRAY_CREATION,
  },
  lonarr: {
    returns: ParseIDLType('Array<Long>'),
    args: {},
    kws: BASIC_ARRAY_CREATION,
  },
  make_array: {
    returns: ParseIDLType('Array<Any>'),
    args: {},
    kws: {
      boolean: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      byte: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      complex: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      dcomplex: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      dimension: {
        direction: 'in',
        type: ParseIDLType('Array<Number>'),
      },
      double: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      float: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      increment: {
        direction: 'in',
        type: IDL_NUMBER_TYPE,
      },
      index: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      integer: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      l64: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      long: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      nozero: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      obj: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      ptr: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      size: {
        direction: 'in',
        type: ParseIDLType('Array<Number>'),
      },
      start: {
        direction: 'in',
        type: IDL_NUMBER_TYPE,
      },
      string: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      type: {
        direction: 'in',
        type: IDL_TYPE_CODE_TYPE,
      },
      uint: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      ul64: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      ulong: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      value: {
        direction: 'in',
        type: IDL_ANY_TYPE,
      },
      ...THREAD_POOL_KEYWORDS,
    },
  },
  map_proj_init: {
    args: {},
    kws: {
      center_azimuth: {
        direction: 'in',
        type: ParseIDLType('number'),
      },
      center_latitude: {
        direction: 'in',
        type: ParseIDLType('number'),
      },
      center_longitude: {
        direction: 'in',
        type: ParseIDLType('number'),
      },
    },
  },
  max: {
    returns: IDL_NUMBER_TYPE,
    args: {
      max_subscript: {
        direction: 'out',
        type: IDL_NUMBER_TYPE,
      },
    },
    kws: {
      absolute: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      dimension: {
        direction: 'in',
        type: IDL_NUMBER_TYPE,
      },
      min: {
        direction: 'out',
        type: IDL_NUMBER_TYPE,
      },
      nan: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      subscript_min: {
        direction: 'out',
        type: IDL_NUMBER_TYPE,
      },
    },
  },
  min: {
    returns: IDL_NUMBER_TYPE,
    args: {
      min_subscript: {
        direction: 'out',
        type: IDL_NUMBER_TYPE,
      },
    },
    kws: {
      absolute: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      dimension: {
        direction: 'in',
        type: IDL_NUMBER_TYPE,
      },
      max: {
        direction: 'out',
        type: IDL_NUMBER_TYPE,
      },
      nan: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      subscript_max: {
        direction: 'out',
        type: IDL_NUMBER_TYPE,
      },
    },
  },
  n_elements: {
    returns: IDL_NUMBER_TYPE,
    args: {},
    kws: {},
  },
  objarr: {
    returns: IDL_ARRAY_TYPE,
    args: {},
    kws: {},
  },
  obj_class: {
    returns: IDL_BOOLEAN_TYPE,
    args: {},
    kws: {
      count: {
        direction: 'out',
        type: IDL_LONG_TYPE,
      },
      superclass: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
    },
  },
  obj_hasmethod: {
    returns: ParseIDLType('Boolean | Array<Boolean>'),
    args: {
      objref: {
        direction: 'in',
        type: ParseIDLType('any | Array<any>'),
      },
      method: {
        direction: 'in',
        type: ParseIDLType('String | Array<String>'),
      },
    },
    kws: {},
  },
  obj_isa: {
    returns: IDL_BOOLEAN_TYPE,
    args: {
      arg: {
        direction: 'in',
        type: IDL_ANY_TYPE,
      },
      classname: {
        direction: 'in',
        type: IDL_STRING_TYPE,
      },
    },
    kws: {},
  },
  obj_valid: {
    returns: IDL_BOOLEAN_TYPE,
    args: {
      arg: {
        direction: 'in',
      },
    },
    kws: {
      cast: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      count: {
        direction: 'out',
        type: IDL_LONG_TYPE,
      },
      get_heap_identifier: {
        direction: 'out',
        type: IDL_BOOLEAN_TYPE,
      },
    },
  },
  orderedhash: {
    args: {},
    kws: {
      extract: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      fold_case: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      lowercase: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      no_copy: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
    },
  },
  path_sep: {
    returns: IDL_STRING_TYPE,
    args: {},
    kws: {
      parent_directory: {
        direction: 'in',
      },
      search_path: {
        direction: 'in',
      },
    },
  },
  plot: {
    args: {},
    kws: {
      test: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
    },
  },
  ptrarr: {
    returns: ParseIDLType('Array<Pointer<any>>'),
    args: {},
    kws: {
      allocate_heap: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
    },
  },
  product: {
    returns: ParseIDLType('Number | Array<Number>'),
    args: {
      array: {
        direction: 'in',
        type: ParseIDLType('Array<Number>'),
      },
      dimension: {
        direction: 'in',
        type: IDL_NUMBER_TYPE,
        req: false,
      },
    },
    kws: {
      cumulative: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      integer: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      nan: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      preserve_type: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      ...THREAD_POOL_KEYWORDS,
    },
  },
  replicate: {
    returns: ParseIDLType('Array<any>'),
    args: {},
    kws: THREAD_POOL_KEYWORDS,
  },
  read_ascii: {
    args: {},
    kws: {
      csv: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
    },
  },
  reform: {
    returns: ParseIDLType('TypeOfArg<0>'),
    args: {
      array: {
        direction: 'in',
        req: true,
        type: ParseIDLType('Array<any>'),
      },
    },
    kws: {
      overwrite: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
        req: false,
      },
    },
  },
  reverse: {
    returns: ParseIDLType('TypeOfArg<0>'),
    args: {
      array: {
        direction: 'in',
        req: true,
        type: ParseIDLType('Array<Number>'),
      },
      subscript_index: {
        direction: 'in',
        type: IDL_INT_TYPE,
      },
    },
    kws: {
      overwrite: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
        req: false,
      },
    },
  },
  routine_filepath: {
    returns: IDL_STRING_TYPE,
    args: {
      routine: {
        direction: 'in',
      },
    },
    kws: {
      either: {
        type: IDL_BOOLEAN_TYPE,
        direction: 'in',
      },
      is_function: {
        type: IDL_BOOLEAN_TYPE,
        direction: 'in',
      },
    },
  },
  sindgen: {
    returns: ParseIDLType('Array<String>'),
    args: {},
    kws: INDGEN_KEYWORDS,
  },
  strjoin: {
    returns: ParseIDLType('String'),
    args: {
      string: {
        direction: 'in',
        type: ParseIDLType('String | Array<String>'),
      },
      delimiter: {
        direction: 'in',
        type: IDL_STRING_TYPE,
      },
    },
    kws: {
      single: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
    },
  },
  strmid: {
    returns: ParseIDLType('ArrayPromotion<String>'),
    args: {
      expression: {
        direction: 'in',
      },
      first_character: {
        direction: 'in',
      },
      length: {
        direction: 'in',
      },
    },
    kws: {
      reverse_offset: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
    },
  },
  size: {
    returns: ParseIDLType('Array<number>'),
    args: {},
    kws: {
      dimensions: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      file_lun: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      file_offset: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      l64: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      n_dimensions: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      n_elements: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      sname: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      structure: {
        direction: 'in',
        type: IDL_NUMBER_TYPE,
      },
      tname: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      type: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
    },
  },
  sort: {
    returns: ParseIDLType('ArrayPromotion<Long | Long64>'),
    args: {
      x: {
        direction: 'in',
        req: true,
        type: ParseIDLType('Array<Number>'),
      },
    },
    kws: {
      l64: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
        req: false,
      },
    },
  },
  string: {
    returns: ParseIDLType('String | Array<String>'),
    args: {},
    kws: THREAD_POOL_KEYWORDS,
  },
  strarr: {
    returns: ParseIDLType('Array<String>'),
    args: {},
    kws: {},
  },
  total: {
    returns: ParseIDLType('Number | Array<Number>'),
    args: {
      array: {
        direction: 'in',
        type: ParseIDLType('Array<Number>'),
      },
      dimension: {
        direction: 'in',
        type: IDL_NUMBER_TYPE,
        req: false,
      },
    },
    kws: {
      cumulative: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      double: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      integer: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      nan: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      preserve_type: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
    },
  },
  transpose: {
    returns: ParseIDLType('TypeOfArg<0>'),
    args: {},
    kws: {},
  },
  uindgen: {
    returns: ParseIDLType('Array<UInt>'),
    args: TYPE_FUNCTION_ARGS,
    kws: INDGEN_KEYWORDS,
  },
  uint: {
    returns: ParseIDLType('ArrayPromotion<UInt>'),
    args: TYPE_FUNCTION_ARGS,
    kws: THREAD_POOL_KEYWORDS,
  },
  uintarr: {
    returns: ParseIDLType('Array<UInt>'),
    args: {},
    kws: BASIC_ARRAY_CREATION,
  },
  ul64indgen: {
    returns: ParseIDLType('Array<ULong64>'),
    args: {},
    kws: INDGEN_KEYWORDS,
  },
  ulindgen: {
    returns: ParseIDLType('Array<ULong>'),
    args: {},
    kws: INDGEN_KEYWORDS,
  },
  ulong: {
    returns: ParseIDLType('ArrayPromotion<ULong>'),
    args: TYPE_FUNCTION_ARGS,
    kws: THREAD_POOL_KEYWORDS,
  },
  ulong64: {
    returns: ParseIDLType('ArrayPromotion<ULong64>'),
    args: TYPE_FUNCTION_ARGS,
    kws: THREAD_POOL_KEYWORDS,
  },
  ulong64arr: {
    returns: ParseIDLType('Array<ULong64>'),
    args: {},
    kws: BASIC_ARRAY_CREATION,
  },
  ulongarr: {
    returns: ParseIDLType('Array<ULong>'),
    args: {},
    kws: BASIC_ARRAY_CREATION,
  },
  where: {
    returns: ParseIDLType('Number | Array<Number>'),
    args: {
      expression: {
        direction: 'in',
        type: IDL_ANY_TYPE,
      },
      count: {
        direction: 'out',
        type: IDL_NUMBER_TYPE,
      },
    },
    kws: {
      complement: {
        direction: 'out',
        type: ParseIDLType('Array<Number>'),
      },
      l64: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      ncomplement: {
        direction: 'out',
        type: IDL_NUMBER_TYPE,
      },
      null: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
    },
  },
};
