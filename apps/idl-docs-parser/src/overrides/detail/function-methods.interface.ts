import { IDLTypeHelper } from '@idl/parsing/type-parser';
import {
  IDL_ANY_TYPE,
  IDL_BOOLEAN_TYPE,
  IDL_NUMBER_TYPE,
  IDL_STRING_TYPE,
  IDL_STRUCTURE_TYPE,
} from '@idl/types/idl-data-types';

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
    returns: IDLTypeHelper.parseIDLType('dictionary<any>'),
    args: {
      function: {
        direction: 'in',
        type: IDLTypeHelper.parseIDLType('String | Lambda'),
      },
    },
    kws: {},
  },
  'dictionary::haskey': {
    returns: IDLTypeHelper.parseIDLType('ArrayPromotion<Boolean>'),
    args: {
      keys: {
        direction: 'in',
        type: IDLTypeHelper.parseIDLType('String | Array<String>'),
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
    returns: IDLTypeHelper.parseIDLType('List<any>'),
    args: {},
    kws: {},
  },
  'dictionary::map': {
    returns: IDLTypeHelper.parseIDLType('dictionary<any>'),
    args: {
      function: {
        direction: 'in',
        type: IDLTypeHelper.parseIDLType('String | Lambda'),
      },
    },
    kws: {},
  },
  'dictionary::reduce': {
    returns: IDL_ANY_TYPE,
    args: {
      function: {
        direction: 'in',
        type: IDLTypeHelper.parseIDLType('String | Lambda'),
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
        type: IDLTypeHelper.parseIDLType('List<any>'),
      },
    },
  },
  'dictionary::values': {
    returns: IDLTypeHelper.parseIDLType('List<any>'),
    args: {},
    kws: {},
  },
  'dictionary::where': {
    returns: IDLTypeHelper.parseIDLType('Array<Number>'),
    args: {
      value: {
        direction: 'in',
        type: IDL_ANY_TYPE,
      },
    },
    kws: {
      complement: {
        direction: 'out',
        type: IDLTypeHelper.parseIDLType('Array<Number>'),
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
    returns: IDLTypeHelper.parseIDLType('ENVIBroadcastChannel'),
    args: {},
    kws: {
      error: ENVI_ERROR_KEYWORD,
    },
  },
  'envi::gettemporaryfilename': {
    returns: IDLTypeHelper.parseIDLType('String | Array<String>'),
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
    returns: IDLTypeHelper.parseIDLType('ENVIView | Array<ENVIView>'),
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
    returns: IDLTypeHelper.parseIDLType('ENVIAnnotation'),
    args: {
      uri: {
        direction: 'in',
        type: IDLTypeHelper.parseIDLType('String | Array<String>'),
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
        type: IDLTypeHelper.parseIDLType('ENVIPointCloudSpatialRef'),
      },
      txt_format: {
        direction: 'in',
        type: IDLTypeHelper.parseIDLType('Array<String>'),
      },
      txt_skip_header_lines: {
        direction: 'in',
        type: IDL_NUMBER_TYPE,
      },
    },
  },
  'envi::openpointcloud': {
    returns: IDLTypeHelper.parseIDLType('ENVIPointCloud'),
    args: {
      uri: URI_ARG_KW,
    },
    kws: {
      error: ENVI_ERROR_KEYWORD,
    },
  },
  'envi::openraster': {
    returns: IDLTypeHelper.parseIDLType('ENVIRaster | Array<ENVIRaster>'),
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
        type: IDLTypeHelper.parseIDLType('ENVIRasterMetadata'),
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
        type: IDLTypeHelper.parseIDLType('ENVITime'),
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
    returns: IDLTypeHelper.parseIDLType('ENVIROI | Array<ENVIROI>'),
    args: {},
    kws: {
      error: ENVI_ERROR_KEYWORD,
      parent_raster: {
        direction: 'in',
        type: IDLTypeHelper.parseIDLType('ENVIRaster'),
      },
    },
  },
  'envi::openvector': {
    returns: IDLTypeHelper.parseIDLType('ENVIVector'),
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
        type: IDLTypeHelper.parseIDLType('String | Array<String>'),
      },
      username: {
        direction: 'in',
        type: IDL_STRING_TYPE,
      },
    },
  },
  'enviraster::getdata': {
    returns: IDLTypeHelper.parseIDLType('Array<Number>'),
    args: {},
    kws: {
      bands: {
        direction: 'in',
        type: IDLTypeHelper.parseIDLType('Array<Number>'),
      },
      complex_function: {
        direction: 'in',
      },
      interleave: {
        direction: 'in',
        type: IDLTypeHelper.parseIDLType("'bil' | 'bip' | 'bsq'"),
      },
      interpolation: {
        direction: 'in',
        type: IDLTypeHelper.parseIDLType(
          "'nearest neighbor' | 'pixel aggregate'"
        ),
      },
      pixel_state: {
        direction: 'out',
        type: IDLTypeHelper.parseIDLType('Array<Number>'),
      },
      sub_rect: {
        direction: 'out',
        type: IDLTypeHelper.parseIDLType('Array<Number>'),
      },
    },
  },
  'enviview::createlayer': {
    returns: IDLTypeHelper.parseIDLType(
      'ENVIAnnotationLayer | ENVIRasterLayer | ENVIRasterSeriesLayer | ENVIVectorLayer'
    ),
    args: {
      data: {
        direction: 'in',
        type: IDLTypeHelper.parseIDLType(
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
    returns: IDLTypeHelper.parseIDLType('Hash<any>'),
    args: {
      function: {
        direction: 'in',
        type: IDLTypeHelper.parseIDLType('String | Lambda'),
      },
    },
    kws: {},
  },
  'hash::haskey': {
    returns: IDLTypeHelper.parseIDLType('ArrayPromotion<Boolean>'),
    args: {
      keys: {
        direction: 'in',
        type: IDLTypeHelper.parseIDLType('String | Array<String>'),
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
    returns: IDLTypeHelper.parseIDLType('List<any>'),
    args: {},
    kws: {},
  },
  'hash::map': {
    returns: IDLTypeHelper.parseIDLType('Hash<any>'),
    args: {
      function: {
        direction: 'in',
        type: IDLTypeHelper.parseIDLType('String | Lambda'),
      },
    },
    kws: {},
  },
  'hash::reduce': {
    returns: IDL_ANY_TYPE,
    args: {
      function: {
        direction: 'in',
        type: IDLTypeHelper.parseIDLType('String | Lambda'),
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
        type: IDLTypeHelper.parseIDLType('List<any>'),
      },
    },
  },
  'hash::values': {
    returns: IDLTypeHelper.parseIDLType('List<any>'),
    args: {},
    kws: {},
  },
  'hash::where': {
    returns: IDLTypeHelper.parseIDLType('Array<Number>'),
    args: {
      value: {
        direction: 'in',
        type: IDL_ANY_TYPE,
      },
    },
    kws: {
      complement: {
        direction: 'out',
        type: IDLTypeHelper.parseIDLType('Array<Number>'),
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
    returns: IDLTypeHelper.parseIDLType('HttpRequest'),
    args: {
      ...HTTP_REQUEST_ARGS,
    },
    kws: {
      ...HTTP_REQUEST_KEYWORDS,
    },
  },
  'httprequest::delete': {
    returns: IDLTypeHelper.parseIDLType('HttpRequest'),
    args: {
      ...HTTP_REQUEST_ARGS,
    },
    kws: {
      ...HTTP_REQUEST_BASE_KEYWORDS,
    },
  },
  'httprequest::escape': {
    returns: IDLTypeHelper.parseIDLType('HttpRequest'),
    args: {},
    kws: {},
  },
  'httprequest::post': {
    returns: IDLTypeHelper.parseIDLType('HttpRequest'),
    args: {
      ...HTTP_REQUEST_ARGS,
    },
    kws: {
      ...HTTP_REQUEST_KEYWORDS,
      multipart: {
        display: 'multipart',
        direction: 'in',
        type: IDLTypeHelper.parseIDLType('Hash<any>'),
      },
    },
  },
  'httprequest::put': {
    returns: IDLTypeHelper.parseIDLType('HttpRequest'),
    args: {
      ...HTTP_REQUEST_ARGS,
    },
    kws: {
      ...HTTP_REQUEST_KEYWORDS,
      multipart: {
        display: 'multipart',
        direction: 'in',
        type: IDLTypeHelper.parseIDLType('Hash<any>'),
      },
    },
  },
  'httprequest::unescape': {
    returns: IDLTypeHelper.parseIDLType('HttpRequest'),
    args: {},
    kws: {},
  },
  'httprequest::json': {
    returns: IDLTypeHelper.parseIDLType('any'),
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
    returns: IDLTypeHelper.parseIDLType('List<any>'),
    args: {
      function: {
        direction: 'in',
        type: IDLTypeHelper.parseIDLType('String | Lambda'),
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
    returns: IDLTypeHelper.parseIDLType('List<any>'),
    args: {
      function: {
        direction: 'in',
        type: IDLTypeHelper.parseIDLType('String | Lambda'),
      },
    },
    kws: {},
  },
  'list::nestedmap': {
    returns: IDLTypeHelper.parseIDLType('List<any>'),
    args: {
      function: {
        direction: 'in',
        type: IDLTypeHelper.parseIDLType('String | Lambda'),
      },
    },
    kws: {
      filter: {
        direction: 'in',
        type: IDLTypeHelper.parseIDLType('String | Lambda'),
      },
    },
  },
  'list::reduce': {
    returns: IDL_ANY_TYPE,
    args: {
      function: {
        direction: 'in',
        type: IDLTypeHelper.parseIDLType('String | Lambda'),
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
    returns: IDLTypeHelper.parseIDLType('List<any>'),
    args: {},
    kws: {},
  },
  'list::sort': {
    returns: IDLTypeHelper.parseIDLType('List<any>'),
    args: {},
    kws: {
      compare_function: {
        direction: 'in',
        type: IDLTypeHelper.parseIDLType('String | Lambda'),
      },
      count: {
        direction: 'in',
        type: IDL_NUMBER_TYPE,
      },
      indices: {
        direction: 'out',
        type: IDLTypeHelper.parseIDLType('Array<Number>'),
      },
      overwrite: {
        direction: 'in',
        type: IDL_BOOLEAN_TYPE,
      },
    },
  },
  'list::toarray': {
    returns: IDLTypeHelper.parseIDLType('Array<any>'),
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
        type: IDLTypeHelper.parseIDLType('String | Number'),
      },
    },
  },
  'list::where': {
    returns: IDLTypeHelper.parseIDLType('Array<Number>'),
    args: {
      value: {
        direction: 'in',
        type: IDL_ANY_TYPE,
      },
    },
    kws: {
      complement: {
        direction: 'out',
        type: IDLTypeHelper.parseIDLType('Array<Number>'),
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
    returns: IDLTypeHelper.parseIDLType('orderedhash<any>'),
    args: {
      function: {
        direction: 'in',
        type: IDLTypeHelper.parseIDLType('String | Lambda'),
      },
    },
    kws: {},
  },
  'orderedhash::haskey': {
    returns: IDLTypeHelper.parseIDLType('ArrayPromotion<Boolean>'),
    args: {
      keys: {
        direction: 'in',
        type: IDLTypeHelper.parseIDLType('String | Array<String>'),
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
    returns: IDLTypeHelper.parseIDLType('List<any>'),
    args: {},
    kws: {},
  },
  'orderedhash::map': {
    returns: IDLTypeHelper.parseIDLType('orderedhash<any>'),
    args: {
      function: {
        direction: 'in',
        type: IDLTypeHelper.parseIDLType('String | Lambda'),
      },
    },
    kws: {},
  },
  'orderedhash::reduce': {
    returns: IDL_ANY_TYPE,
    args: {
      function: {
        direction: 'in',
        type: IDLTypeHelper.parseIDLType('String | Lambda'),
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
        type: IDLTypeHelper.parseIDLType('List<any>'),
      },
    },
  },
  'orderedhash::values': {
    returns: IDLTypeHelper.parseIDLType('List<any>'),
    args: {},
    kws: {},
  },
  'orderedhash::where': {
    returns: IDLTypeHelper.parseIDLType('Array<Number>'),
    args: {
      value: {
        direction: 'in',
        type: IDL_ANY_TYPE,
      },
    },
    kws: {
      complement: {
        direction: 'out',
        type: IDLTypeHelper.parseIDLType('Array<Number>'),
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
