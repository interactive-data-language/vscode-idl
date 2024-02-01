import {
  GlobalTokenSource,
  IDL_ANY_TYPE,
  IDL_INT_TYPE,
  IDL_LONG_TYPE,
  IDL_NUMBER_TYPE,
  IDL_STRING_TYPE,
  ParseIDLType,
} from '@idl/types/core';

import { IStructureOverride } from '../detail.interface';
import { RECORD_TYPE } from '../shared/entities.interface';

/**
 * Track additional structures that we should populate if we don't pick
 * them up. This comes from places where we might have a method, but not a
 * structure definition.
 *
 * And, anything not captured in the docs, but specified in STRUCTURE_OVERRIDE, should be added to the
 */
export const ADD_STRUCTURES: {
  [key: string]: { display: string; source: GlobalTokenSource };
} = {
  idl_shape_entity: {
    display: 'idl_shape_entity',
    source: 'idl',
  },
};

/**
 * Overrides for structure metadata
 */
export const STRUCTURE_OVERRIDE: IStructureOverride = {
  envi: {
    display: 'ENVI',
    properties: {
      api_version: {
        type: IDL_STRING_TYPE,
      },
      data: {
        type: ParseIDLType('ENVIDataCollection'),
      },
      preferences: {
        type: ParseIDLType('ENVIPreferences'),
      },
      root_direction: {
        type: IDL_STRING_TYPE,
      },
      task_names: {
        type: ParseIDLType('Array<String>'),
      },
      ui: {
        type: ParseIDLType('ENVIUI | Null'),
      },
      uvalue: {
        type: IDL_ANY_TYPE,
      },
      version: {
        type: IDL_STRING_TYPE,
      },
      widget_id: {
        type: IDL_NUMBER_TYPE,
      },
    },
  },
  httprequest: {
    display: 'HttpRequest',
    properties: {
      appconnect_time: {
        display: 'appconnect_time',
        direction: 'out',
        type: ParseIDLType('Int'),
        docs: 'An integer giving the total time in microseconds until SSL/SSH handshaking was completed.',
      },
      certinfo: {
        display: 'certinfo',
        direction: 'out',
        type: ParseIDLType('Array<String>'),
        docs: 'A string array containing the certificate information used during the SSL connection. If there is no certificate information or it was a non-secure connection, then a null string is returned. To retrieve this value you must pass options={CERTINFO:1} in your request.',
      },
      connect_time: {
        display: 'connect_time',
        direction: 'out',
        type: ParseIDLType('Int'),
        docs: 'An integer giving the total time in microseconds until the connection to the remote host (or proxy) was completed.',
      },
      content: {
        display: 'content',
        direction: 'out',
        type: ParseIDLType('Array<Byte> | Byte'),
        docs: 'A byte array containing the raw data from the response body. If a CURL error occurred then CONTENT will be a scalar 0.',
      },
      content_length_download: {
        display: 'content_length_download',
        direction: 'out',
        type: ParseIDLType('Int'),
        docs: 'An integer giving the value from the Content-Length: field from a download, or -1 if the length is unknown.',
      },
      content_length_upload: {
        display: 'content_length_upload',
        direction: 'out',
        type: ParseIDLType('Int'),
        docs: 'An integer giving the specified size of the upload, or -1 if the length is unknown.',
      },
      content_type: {
        display: 'content_type',
        direction: 'out',
        type: ParseIDLType('String'),
        docs: 'A string giving the value of the Content-Type: header, or an empty string if unknown.',
      },
      cookielist: {
        display: 'cookielist',
        direction: 'out',
        type: ParseIDLType('Array<String>'),
        docs: 'A string array giving the cookies returned from the server, or an empty string if there are no cookies. To retrieve this value you must pass either COOKIEFILE, COOKIEJAR, or COOKIELIST as options in your request.',
      },
      effective_method: {
        display: 'effective_method',
        direction: 'out',
        type: ParseIDLType('String'),
        docs: 'A string giving the final method (GET, POST, PUT, etc) used for the request, including any redirects.',
      },
      filetime: {
        display: 'filetime',
        direction: 'out',
        type: ParseIDLType('Int'),
        docs: 'An integer giving the remote time of the retrieved file, in seconds since 1-1-1970 GMT. To retrieve this value you must pass options={FILETIME:1} in your request. Returns –1 if unable to retrieve the filetime.',
      },
      headers: {
        display: 'headers',
        direction: 'out',
        type: ParseIDLType('OrderedHash<any>'),
        docs: 'An OrderedHash containing the response headers as key/value pairs. If a CURL error occurred then HEADERS will be an empty OrderedHash.',
      },
      header_size: {
        display: 'header_size',
        direction: 'out',
        type: ParseIDLType('Int'),
        docs: 'An integer giving the total size in bytes of all headers received.',
      },
      http_connectcode: {
        display: 'http_connectcode',
        direction: 'out',
        type: ParseIDLType('Int'),
        docs: 'An integer containing the status code for the last received HTTP proxy response.',
      },
      http_version: {
        display: 'http_version',
        direction: 'out',
        type: ParseIDLType('Int'),
        docs: 'An integer giving the HTTP protocol version that was used. 1=HTTP/1.0, 2=HTTP/1.1, 3=HTTP/2, 4=HTTP/2 TLS (1.1 fallback), 5=HTTP/2 (no 1.1 fallback), 30=HTTP/3, 31=HTTP/3 (no fallback)',
      },
      httpauth_avail: {
        display: 'httpauth_avail',
        direction: 'out',
        type: ParseIDLType('Int'),
        docs: 'An integer containing a bitmask indicating which authentication methods are available on the server. See HttpRequest Options for the bitmask values.',
      },
      local_ip: {
        display: 'local_ip',
        direction: 'out',
        type: ParseIDLType('String'),
        docs: 'A string giving the local IP address.',
      },
      local_port: {
        display: 'local_port',
        direction: 'out',
        type: ParseIDLType('Int'),
        docs: 'An integer giving the local port number.',
      },
      namelookup_time: {
        display: 'namelookup_time',
        direction: 'out',
        type: ParseIDLType('Int'),
        docs: 'An integer giving the total time in microseconds for name resolving to be complete.',
      },
      num_connects: {
        display: 'num_connects',
        direction: 'out',
        type: ParseIDLType('Int'),
        docs: 'An integer giving the number of new connections that were needed for the transfer.',
      },
      ok: {
        display: 'ok',
        direction: 'out',
        type: ParseIDLType('Boolean'),
        docs: 'A boolean (true/false) that indicates whether the request was successful (status code ≥ 100 and < 400).',
      },
      pretransfer_time: {
        display: 'pretransfer_time',
        direction: 'out',
        type: ParseIDLType('Int'),
        docs: 'An integer giving the total time in microseconds from the start until just before transfer begins.',
      },
      primary_ip: {
        display: 'primary_ip',
        direction: 'out',
        type: ParseIDLType('String'),
        docs: 'A string giving the server IP address.',
      },
      primary_port: {
        display: 'primary_port',
        direction: 'out',
        type: ParseIDLType('Int'),
        docs: 'An integer giving the server port number.',
      },
      proxy_error: {
        display: 'proxy_error',
        direction: 'out',
        type: ParseIDLType('Int'),
        docs: 'An integer giving the detailed error code for any proxy errors. Consult the libcurl documentation for a list of CURLproxycode errors.',
      },
      proxyauth_avail: {
        display: 'proxyauth_avail',
        direction: 'out',
        type: ParseIDLType('Int'),
        docs: 'An integer containing a bitmask indicating which authentication methods are available on the proxy server. See HttpRequest Options for the bitmask values.',
      },
      redirect_count: {
        display: 'redirect_count',
        direction: 'out',
        type: ParseIDLType('Int'),
        docs: 'An integer giving the total number of redirects that were followed.',
      },
      redirect_time: {
        display: 'redirect_time',
        direction: 'out',
        type: ParseIDLType('Int'),
        docs: 'An integer giving the total time in microseconds taken for all redirect steps before the final transfer.',
      },
      redirect_url: {
        display: 'redirect_url',
        direction: 'out',
        type: ParseIDLType('String'),
        docs: 'A string giving the URL that would have been followed for a redirect. Since redirects are enabled by default, this will normally be empty. To disable redirects, set options={FOLLOWLOCATION:0} in your request.',
      },
      referer: {
        display: 'referer',
        direction: 'out',
        type: ParseIDLType('String'),
        docs: 'A string giving the URL in the Referer: header.',
      },
      request_size: {
        display: 'request_size',
        direction: 'out',
        type: ParseIDLType('Int'),
        docs: 'An integer giving the total number of bytes sent in the HTTP requests.',
      },
      retry_after: {
        display: 'retry_after',
        direction: 'out',
        type: ParseIDLType('Int'),
        docs: 'An integer giving the value of the Retry-After: header, which is the number of seconds that the client should wait until the next request is issued.',
      },
      scheme: {
        display: 'scheme',
        direction: 'out',
        type: ParseIDLType('String'),
        docs: 'A string giving the URL scheme used for the connection, such as HTTP or HTTPS.',
      },
      size_download: {
        display: 'size_download',
        direction: 'out',
        type: ParseIDLType('Int'),
        docs: 'An integer giving the number of bytes downloaded.',
      },
      size_upload: {
        display: 'size_upload',
        direction: 'out',
        type: ParseIDLType('Int'),
        docs: 'An integer giving the number of bytes uploaded.',
      },
      speed_download: {
        display: 'speed_download',
        direction: 'out',
        type: ParseIDLType('Int'),
        docs: 'An integer giving the average download speed in bytes/second.',
      },
      speed_upload: {
        display: 'speed_upload',
        direction: 'out',
        type: ParseIDLType('Int'),
        docs: 'An integer giving the average upload speed in bytes/second.',
      },
      starttransfer_time: {
        display: 'starttransfer_time',
        direction: 'out',
        type: ParseIDLType('Int'),
        docs: 'An integer giving the total time in microseconds from the start until just when the first byte is received.',
      },
      status_code: {
        display: 'status_code',
        direction: 'out',
        type: ParseIDLType('Int'),
        docs: 'An integer containing the HTTP status code, such as 200, 302, 401, etc. If a CURL error occurred then STATUS_CODE will be less than 100.',
      },
      text: {
        display: 'text',
        direction: 'out',
        type: ParseIDLType('String'),
        docs: 'A scalar string containing the request result. If STATUS_CODE ≥ 100 then TEXT will contain the server response body. If STATUS_CODE < 100 then TEXT will contain the CURL error message.',
      },
      total_time: {
        display: 'total_time',
        direction: 'out',
        type: ParseIDLType('Int'),
        docs: 'An integer giving the total time in microseconds for the transfer, including name resolving, TCP connect, and any redirects.',
      },
      url: {
        display: 'url',
        direction: 'out',
        type: ParseIDLType('String'),
        docs: 'A scalar string containing the final URL, including any parameters or possible redirects.',
      },
    },
  },
  idl_shape_entity: {
    display: 'IDL_Shape_Entity',
    properties: {
      attributes: {
        display: 'attributes',
        direction: 'bidirectional',
        type: ParseIDLType('Pointer<any>'),
        docs: 'If the attributes for an entity were requested, this field contains an IDL pointer that contains a structure of attributes for the entity. For more information on this structure, see Attributes.',
      },
      bounds: {
        display: 'bounds',
        direction: 'bidirectional',
        type: ParseIDLType('Array<Double>'),
        docs: 'A bounding box that specifies the range limits of the entity. This eight element array contains the following information:\n\nIndex 0: X minimum value\n\nIndex 1: Y minimum value\n\nIndex 2: Z minimum value (if Z is supported by type)\n\nIndex 3: Measure minimum value (if measure is supported by entity type)\n\nIndex4: X maximum value\n\nIndex5: Y maximum value\n\nIndex6: Z maximum value (if Z is supported by the entity type)\n\nIndex7: Measure maximum value (if measure is supported by entity type)\n\nIf the entity is a point type, the values contained in the bounds array are also the values of the entity.',
      },
      ishape: {
        display: 'ishape',
        direction: 'out',
        type: IDL_LONG_TYPE,
        docs: 'A read-only field containing the index of the specific entity within the shape object. This value is set automatically when the shape file is written.',
      },
      measure: {
        display: 'measure',
        direction: 'bidirectional',
        type: ParseIDLType('Pointer<any>'),
        docs: 'If the entity has a measure value (this is dependent on the entity type), this IDL pointer will contain a vector array of measure values. The length of this vector is N_VERTICES.\n\nThis pointer will be null if the entity is of type POINTM, with the values contained in the BOUNDS array.',
      },
      n_parts: {
        display: 'n_parts',
        direction: 'bidirectional',
        type: IDL_LONG_TYPE,
        docs: 'If the values of the entity are separated into parts, the break points are enumerated in the parts array. This field lists the number of parts in this entity. If this value is 0, the entity is one part and the PARTS pointer will be NULL.',
      },
      n_vertices: {
        display: 'n_vertices',
        direction: 'bidirectional',
        type: IDL_LONG_TYPE,
        docs: 'The number of vertices in the entity. If this value is one and the entity is a POINT type (POINT, POINTM, POINTZ), the vertices pointer will be set to NULL and the entity value will be maintained in the BOUNDS field.',
      },
      parts: {
        display: 'parts',
        direction: 'bidirectional',
        type: ParseIDLType('Pointer<Array<Long>>'),
        docs: 'An IDL pointer that contains an array of indices into the vertex/measure arrays. These values represent the start of each part of the entity. The index range of each entity part is defined by the following:\n\nStart = Parts[I]\n\nEnd = Parts[I+1]-1 or the end of the array',
      },
      part_types: {
        display: 'part_types',
        direction: 'bidirectional',
        type: ParseIDLType('Pointer<any>'),
        docs: 'This IDL pointer is only valid for entities of type MultiPatch and defines the type of the particular part. If the entity type is not MultiPatch, part types are assumed to be type RING (SHPP_RING).\n\nThis pointer is NULL if the entity is not type MultiPatch.',
      },
      shape_type: {
        display: 'shape_type',
        direction: 'bidirectional',
        type: IDL_LONG_TYPE,
        docs: 'The entity type',
      },
      vertices: {
        display: 'vertices',
        direction: 'bidirectional',
        type: ParseIDLType('Pointer<Array<Double>>'),
        docs: 'An IDL pointer that contains the vertices of the entity. This pointer contains a double array that has one of the following formats:\n\n[2, N]: If Z data is not present\n\n[3, N]: If Z data is present\n\nwhere N is the number of vertices. These array formats can be passed to the polygon and polyline objects of IDL Object Graphics.\n\nThis pointer will be null if the entity is a point type, with the values maintained in the BOUNDS array.',
      },
    },
  },
  idl_variable: {
    properties: {
      dim: {
        display: 'dim',
        direction: 'out',
        type: ParseIDLType('Array<Number>'),
        docs: 'An array giving the dimensions (0 for scalars).',
      },
      length: {
        display: 'length',
        direction: 'out',
        type: IDL_NUMBER_TYPE,
        docs: 'The number of elements in the variable.',
      },
      ndim: {
        display: 'ndim',
        direction: 'out',
        type: IDL_INT_TYPE,
        docs: 'An integer giving the number of dimensions (0 for scalars).',
      },
      tname: {
        display: 'tname',
        direction: 'out',
        type: IDL_STRING_TYPE,
        docs: 'A string giving the raw IDL type name. For structures this returns "STRUCT", while for objects this returns "OBJREF".',
      },
      typecode: {
        display: 'typecode',
        direction: 'out',
        type: IDL_INT_TYPE,
        docs: 'An integer giving the IDL type code.',
      },
      typename: {
        display: 'typename',
        direction: 'out',
        type: IDL_STRING_TYPE,
        docs: 'A string giving the IDL type name. For structures and objects this returns the actual structure or class name.',
      },
    },
  },
  idlitcomponent: {
    display: 'IDLitComponent',
  },
  envivector: {
    display: 'ENVIVector',
    properties: {
      auxiliary_uri: {
        type: IDL_STRING_TYPE,
      },
      coord_sys: {
        type: ParseIDLType('ENVICoordSys'),
      },
      data_range: {
        type: ParseIDLType('Array<Double>'),
      },
      record_type: {
        type: RECORD_TYPE,
      },
      uri: {
        type: IDL_STRING_TYPE,
      },
    },
  },
};
