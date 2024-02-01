import {
  IDL_ANY_TYPE,
  IDL_BOOLEAN_TYPE,
  IDL_NUMBER_TYPE,
  IDL_STRING_TYPE,
  IDL_STRUCTURE_TYPE,
  ParseIDLType,
} from '@idl/types/core';

import { IFunctionMethodOverride } from '../detail.interface';
import { ENVI_ERROR_KEYWORD } from '../shared/envi-error.interface';
import {
  HTTP_REQUEST_ARGS,
  HTTP_REQUEST_BASE_KEYWORDS,
  HTTP_REQUEST_KEYWORDS,
} from '../shared/http-request.interface';
import { INTERLEAVE_IN_ARG_KW } from '../shared/interleave.interface';
import { SPATIALREF_TYPE } from '../shared/spatialref.interface';
import { URI_ARG_KW } from '../shared/uri.interface';

/**
 * Overrides for function method metadata when generating internal docs
 */
export const FUNCTION_METHOD_OVERRIDE: IFunctionMethodOverride = {
  'dictionary::count': {
    returns: IDL_NUMBER_TYPE,
    args: {
      value: {
        direction: 'in',
        req: false,
      },
    },
    kws: {},
  },
  'dictionary::filter': {
    returns: ParseIDLType('dictionary<any>'),
    args: {
      function: {
        direction: 'in',
        type: ParseIDLType('String | Lambda'),
      },
    },
    kws: {},
  },
  'dictionary::haskey': {
    returns: ParseIDLType('ArrayPromotion<Boolean>'),
    args: {
      keys: {
        direction: 'in',
        type: ParseIDLType('String | Array<String>'),
      },
    },
    kws: {},
  },
  'dictionary::isempty': {
    returns: IDL_BOOLEAN_TYPE,
    args: {},
    kws: {},
  },
  'dictionary::isfoldcase': {
    returns: IDL_BOOLEAN_TYPE,
    args: {},
    kws: {},
  },
  'dictionary::keys': {
    returns: ParseIDLType('List<any>'),
    args: {},
    kws: {},
  },
  'dictionary::map': {
    returns: ParseIDLType('dictionary<any>'),
    args: {
      function: {
        direction: 'in',
        type: ParseIDLType('String | Lambda'),
      },
    },
    kws: {},
  },
  'dictionary::reduce': {
    returns: IDL_ANY_TYPE,
    args: {
      function: {
        direction: 'in',
        type: ParseIDLType('String | Lambda'),
      },
    },
    kws: {
      value: {
        direction: 'in',
        type: IDL_ANY_TYPE,
      },
    },
  },
  'dictionary::tostruct': {
    returns: IDL_STRUCTURE_TYPE,
    args: {},
    kws: {
      missing: {
        direction: 'in',
        type: IDL_ANY_TYPE,
      },
      no_copy: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      recursive: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      skipped: {
        direction: 'out',
        type: ParseIDLType('List<any>'),
      },
    },
  },
  'dictionary::values': {
    returns: ParseIDLType('List<any>'),
    args: {},
    kws: {},
  },
  'dictionary::where': {
    returns: ParseIDLType('Array<Number>'),
    args: {
      value: {
        direction: 'in',
        type: IDL_ANY_TYPE,
      },
    },
    kws: {
      complement: {
        direction: 'out',
        type: ParseIDLType('Array<Number>'),
      },
      count: {
        direction: 'out',
        type: IDL_NUMBER_TYPE,
      },
      ncomplement: {
        direction: 'out',
        type: IDL_NUMBER_TYPE,
      },
    },
  },
  'envi::getbroadcastchannel': {
    returns: ParseIDLType('ENVIBroadcastChannel'),
    args: {},
    kws: {
      error: ENVI_ERROR_KEYWORD,
    },
  },
  'envi::gettemporaryfilename': {
    returns: ParseIDLType('String | Array<String>'),
    args: {},
    kws: {
      cleanup_on_exit: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      nfiles: {
        direction: 'in',
        type: IDL_NUMBER_TYPE,
      },
      error: ENVI_ERROR_KEYWORD,
    },
  },
  'envi::getview': {
    returns: ParseIDLType('ENVIView | Array<ENVIView>'),
    args: {},
    kws: {
      all: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      error: ENVI_ERROR_KEYWORD,
    },
  },
  'envi::openannotation': {
    returns: ParseIDLType('ENVIAnnotation'),
    args: {
      uri: {
        direction: 'in',
        type: ParseIDLType('String | Array<String>'),
      },
    },
    kws: {
      close_previous: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      error: ENVI_ERROR_KEYWORD,
      project_uri: {
        direction: 'in',
        type: IDL_STRING_TYPE,
      },
      rebuild_project: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      spatialref: {
        direction: 'in',
        type: ParseIDLType('ENVIPointCloudSpatialRef'),
      },
      txt_format: {
        direction: 'in',
        type: ParseIDLType('Array<String>'),
      },
      txt_skip_header_lines: {
        direction: 'in',
        type: IDL_NUMBER_TYPE,
      },
    },
  },
  'envi::openpointcloud': {
    returns: ParseIDLType('ENVIPointCloud'),
    args: {
      uri: URI_ARG_KW,
    },
    kws: {
      error: ENVI_ERROR_KEYWORD,
    },
  },
  'envi::openraster': {
    returns: ParseIDLType('ENVIRaster | Array<ENVIRaster>'),
    args: {
      uri: URI_ARG_KW,
    },
    kws: {
      custom_type: {
        direction: 'in',
        type: IDL_STRING_TYPE,
      },
      data_ignore_value: {
        direction: 'in',
        type: IDL_NUMBER_TYPE,
      },
      dataset_index: {
        direction: 'in',
        type: IDL_NUMBER_TYPE,
      },
      dataset_name: {
        direction: 'in',
        type: IDL_STRING_TYPE,
      },
      error: ENVI_ERROR_KEYWORD,
      external_type: {
        direction: 'in',
        type: IDL_STRING_TYPE,
      },
      interleave: INTERLEAVE_IN_ARG_KW,
      metadata_override: {
        direction: 'in',
        type: ParseIDLType('ENVIRasterMetadata'),
      },
      password: {
        direction: 'in',
        type: IDL_STRING_TYPE,
      },
      prompt_user: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      sensor_model: {
        direction: 'in',
        type: IDL_STRING_TYPE,
      },
      spatialref_override: {
        direction: 'in',
        type: SPATIALREF_TYPE,
      },
      template: {
        direction: 'in',
        type: IDL_STRING_TYPE,
      },
      terrain_source: {
        direction: 'in',
        type: IDL_STRING_TYPE,
      },
      time_override: {
        direction: 'in',
        type: ParseIDLType('ENVITime'),
      },
      user_height: {
        direction: 'in',
        type: IDL_STRING_TYPE,
      },
      username: {
        direction: 'in',
        type: IDL_STRING_TYPE,
      },
      uvalue: {
        direction: 'in',
        type: IDL_ANY_TYPE,
      },
    },
  },
  'envi::openroi': {
    returns: ParseIDLType('ENVIROI | Array<ENVIROI>'),
    args: {},
    kws: {
      error: ENVI_ERROR_KEYWORD,
      parent_raster: {
        direction: 'in',
        type: ParseIDLType('ENVIRaster'),
      },
    },
  },
  'envi::openvector': {
    returns: ParseIDLType('ENVIVector'),
    args: {
      uri: URI_ARG_KW,
    },
    kws: {
      error: ENVI_ERROR_KEYWORD,
      password: {
        direction: 'in',
        type: IDL_STRING_TYPE,
      },
      stanag_4676: {
        direction: 'in',
        type: ParseIDLType('String | Array<String>'),
      },
      username: {
        direction: 'in',
        type: IDL_STRING_TYPE,
      },
    },
  },
  'enviraster::getdata': {
    returns: ParseIDLType('Array<Number>'),
    args: {},
    kws: {
      bands: {
        direction: 'in',
        type: ParseIDLType('Array<Number>'),
      },
      complex_function: {
        direction: 'in',
      },
      interleave: {
        direction: 'in',
        type: ParseIDLType("'bil' | 'bip' | 'bsq'"),
      },
      interpolation: {
        direction: 'in',
        type: ParseIDLType("'nearest neighbor' | 'pixel aggregate'"),
      },
      pixel_state: {
        direction: 'out',
        type: ParseIDLType('Array<Number>'),
      },
      sub_rect: {
        direction: 'out',
        type: ParseIDLType('Array<Number>'),
      },
    },
  },
  'enviview::createlayer': {
    returns: ParseIDLType(
      'ENVIAnnotationLayer | ENVIRasterLayer | ENVIRasterSeriesLayer | ENVIVectorLayer'
    ),
    args: {
      data: {
        direction: 'in',
        type: ParseIDLType(
          'ENVIAnnotationSet | ENVIRaster | ENVIRasterSeries | ENVIVector'
        ),
      },
    },
    kws: {
      all: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      error: ENVI_ERROR_KEYWORD,
    },
  },
  'hash::count': {
    returns: IDL_NUMBER_TYPE,
    args: {
      value: {
        direction: 'in',
        req: false,
      },
    },
    kws: {},
  },
  'hash::filter': {
    returns: ParseIDLType('Hash<any>'),
    args: {
      function: {
        direction: 'in',
        type: ParseIDLType('String | Lambda'),
      },
    },
    kws: {},
  },
  'hash::haskey': {
    returns: ParseIDLType('ArrayPromotion<Boolean>'),
    args: {
      keys: {
        direction: 'in',
        type: ParseIDLType('String | Array<String>'),
      },
    },
    kws: {},
  },
  'hash::isempty': {
    returns: IDL_BOOLEAN_TYPE,
    args: {},
    kws: {},
  },
  'hash::isfoldcase': {
    returns: IDL_BOOLEAN_TYPE,
    args: {},
    kws: {},
  },
  'hash::keys': {
    returns: ParseIDLType('List<any>'),
    args: {},
    kws: {},
  },
  'hash::map': {
    returns: ParseIDLType('Hash<any>'),
    args: {
      function: {
        direction: 'in',
        type: ParseIDLType('String | Lambda'),
      },
    },
    kws: {},
  },
  'hash::reduce': {
    returns: IDL_ANY_TYPE,
    args: {
      function: {
        direction: 'in',
        type: ParseIDLType('String | Lambda'),
      },
    },
    kws: {
      value: {
        direction: 'in',
        type: IDL_ANY_TYPE,
      },
    },
  },
  'hash::tostruct': {
    returns: IDL_STRUCTURE_TYPE,
    args: {},
    kws: {
      missing: {
        direction: 'in',
        type: IDL_ANY_TYPE,
      },
      no_copy: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      recursive: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      skipped: {
        direction: 'out',
        type: ParseIDLType('List<any>'),
      },
    },
  },
  'hash::values': {
    returns: ParseIDLType('List<any>'),
    args: {},
    kws: {},
  },
  'hash::where': {
    returns: ParseIDLType('Array<Number>'),
    args: {
      value: {
        direction: 'in',
        type: IDL_ANY_TYPE,
      },
    },
    kws: {
      complement: {
        direction: 'out',
        type: ParseIDLType('Array<Number>'),
      },
      count: {
        direction: 'out',
        type: IDL_NUMBER_TYPE,
      },
      ncomplement: {
        direction: 'out',
        type: IDL_NUMBER_TYPE,
      },
    },
  },
  'httprequest::get': {
    returns: ParseIDLType('HttpRequest'),
    args: {
      ...HTTP_REQUEST_ARGS,
    },
    kws: {
      ...HTTP_REQUEST_KEYWORDS,
    },
  },
  'httprequest::delete': {
    returns: ParseIDLType('HttpRequest'),
    args: {
      ...HTTP_REQUEST_ARGS,
    },
    kws: {
      ...HTTP_REQUEST_BASE_KEYWORDS,
    },
  },
  'httprequest::escape': {
    returns: ParseIDLType('HttpRequest'),
    args: {},
    kws: {},
  },
  'httprequest::post': {
    returns: ParseIDLType('HttpRequest'),
    args: {
      ...HTTP_REQUEST_ARGS,
    },
    kws: {
      ...HTTP_REQUEST_KEYWORDS,
      multipart: {
        display: 'multipart',
        direction: 'in',
        type: ParseIDLType('Hash<any>'),
      },
    },
  },
  'httprequest::put': {
    returns: ParseIDLType('HttpRequest'),
    args: {
      ...HTTP_REQUEST_ARGS,
    },
    kws: {
      ...HTTP_REQUEST_KEYWORDS,
      multipart: {
        display: 'multipart',
        direction: 'in',
        type: ParseIDLType('Hash<any>'),
      },
    },
  },
  'httprequest::unescape': {
    returns: ParseIDLType('HttpRequest'),
    args: {},
    kws: {},
  },
  'httprequest::json': {
    returns: ParseIDLType('any'),
    args: {},
    kws: {
      quiet: {
        type: IDL_BOOLEAN_TYPE,
      },
      dictionary: {
        type: IDL_BOOLEAN_TYPE,
      },
      fold_case: {
        type: IDL_BOOLEAN_TYPE,
      },
      toarray: {
        type: IDL_BOOLEAN_TYPE,
      },
      struct: {
        type: IDL_BOOLEAN_TYPE,
      },
    },
  },
  'list::count': {
    returns: IDL_NUMBER_TYPE,
    args: {
      value: {
        direction: 'in',
        req: false,
      },
    },
    kws: {},
  },
  'list::filter': {
    returns: ParseIDLType('List<any>'),
    args: {
      function: {
        direction: 'in',
        type: ParseIDLType('String | Lambda'),
      },
    },
    kws: {},
  },
  'list::isempty': {
    returns: IDL_BOOLEAN_TYPE,
    args: {},
    kws: {},
  },
  'list::map': {
    returns: ParseIDLType('List<any>'),
    args: {
      function: {
        direction: 'in',
        type: ParseIDLType('String | Lambda'),
      },
    },
    kws: {},
  },
  'list::nestedmap': {
    returns: ParseIDLType('List<any>'),
    args: {
      function: {
        direction: 'in',
        type: ParseIDLType('String | Lambda'),
      },
    },
    kws: {
      filter: {
        direction: 'in',
        type: ParseIDLType('String | Lambda'),
      },
    },
  },
  'list::reduce': {
    returns: IDL_ANY_TYPE,
    args: {
      function: {
        direction: 'in',
        type: ParseIDLType('String | Lambda'),
      },
    },
    kws: {
      cumulative: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      value: {
        direction: 'in',
        type: IDL_ANY_TYPE,
      },
    },
  },
  'list::reverse': {
    returns: ParseIDLType('List<any>'),
    args: {},
    kws: {},
  },
  'list::sort': {
    returns: ParseIDLType('List<any>'),
    args: {},
    kws: {
      compare_function: {
        direction: 'in',
        type: ParseIDLType('String | Lambda'),
      },
      count: {
        direction: 'in',
        type: IDL_NUMBER_TYPE,
      },
      indices: {
        direction: 'out',
        type: ParseIDLType('Array<Number>'),
      },
      overwrite: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
    },
  },
  'list::toarray': {
    returns: ParseIDLType('Array<any>'),
    args: {},
    kws: {
      dimension: {
        direction: 'in',
        type: IDL_NUMBER_TYPE,
      },
      missing: {
        direction: 'in',
        type: IDL_ANY_TYPE,
      },
      no_copy: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      promote_type: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      transpose: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      type: {
        direction: 'in',
        type: ParseIDLType('String | Number'),
      },
    },
  },
  'list::where': {
    returns: ParseIDLType('Array<Number>'),
    args: {
      value: {
        direction: 'in',
        type: IDL_ANY_TYPE,
      },
    },
    kws: {
      complement: {
        direction: 'out',
        type: ParseIDLType('Array<Number>'),
      },
      count: {
        direction: 'out',
        type: IDL_NUMBER_TYPE,
      },
      ncomplement: {
        direction: 'out',
        type: IDL_NUMBER_TYPE,
      },
    },
  },
  'orderedhash::count': {
    returns: IDL_NUMBER_TYPE,
    args: {
      value: {
        direction: 'in',
        req: false,
      },
    },
    kws: {},
  },
  'orderedhash::filter': {
    returns: ParseIDLType('orderedhash<any>'),
    args: {
      function: {
        direction: 'in',
        type: ParseIDLType('String | Lambda'),
      },
    },
    kws: {},
  },
  'orderedhash::haskey': {
    returns: ParseIDLType('ArrayPromotion<Boolean>'),
    args: {
      keys: {
        direction: 'in',
        type: ParseIDLType('String | Array<String>'),
      },
    },
    kws: {},
  },
  'orderedhash::isempty': {
    returns: IDL_BOOLEAN_TYPE,
    args: {},
    kws: {},
  },
  'orderedhash::isfoldcase': {
    returns: IDL_BOOLEAN_TYPE,
    args: {},
    kws: {},
  },
  'orderedhash::keys': {
    returns: ParseIDLType('List<any>'),
    args: {},
    kws: {},
  },
  'orderedhash::map': {
    returns: ParseIDLType('orderedhash<any>'),
    args: {
      function: {
        direction: 'in',
        type: ParseIDLType('String | Lambda'),
      },
    },
    kws: {},
  },
  'orderedhash::reduce': {
    returns: IDL_ANY_TYPE,
    args: {
      function: {
        direction: 'in',
        type: ParseIDLType('String | Lambda'),
      },
    },
    kws: {
      value: {
        direction: 'in',
        type: IDL_ANY_TYPE,
      },
    },
  },
  'orderedhash::tostruct': {
    returns: IDL_STRUCTURE_TYPE,
    args: {},
    kws: {
      missing: {
        direction: 'in',
        type: IDL_ANY_TYPE,
      },
      no_copy: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      recursive: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
      skipped: {
        direction: 'out',
        type: ParseIDLType('List<any>'),
      },
    },
  },
  'orderedhash::values': {
    returns: ParseIDLType('List<any>'),
    args: {},
    kws: {},
  },
  'orderedhash::where': {
    returns: ParseIDLType('Array<Number>'),
    args: {
      value: {
        direction: 'in',
        type: IDL_ANY_TYPE,
      },
    },
    kws: {
      complement: {
        direction: 'out',
        type: ParseIDLType('Array<Number>'),
      },
      count: {
        direction: 'out',
        type: IDL_NUMBER_TYPE,
      },
      ncomplement: {
        direction: 'out',
        type: IDL_NUMBER_TYPE,
      },
    },
  },
};
