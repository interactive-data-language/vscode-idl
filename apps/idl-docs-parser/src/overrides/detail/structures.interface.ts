import {
  GlobalTokenSource,
  IDL_ANY_TYPE,
  IDL_INT_TYPE,
  IDL_LONG_TYPE,
  IDL_NUMBER_TYPE,
  IDL_STRING_TYPE,
  ParseIDLType,
} from '@idl/data-types/core';

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
