import {
  GLOBAL_TOKEN_TYPES,
  GlobalStructureToken,
  GlobalTokens,
  IDL_TYPE_LOOKUP,
  IGlobalIndexedToken,
} from '@idl/types/core';

/**
 * Structure definitions for types
 */
export const GLOBALS_FOR_TYPES: IGlobalIndexedToken<GlobalStructureToken>[] =
  [];

/**
 * Number types that inherit from IDL_Number
 */
const NUMBER_INHERITANCE: string[] = [
  IDL_TYPE_LOOKUP.NUMBER,
  IDL_TYPE_LOOKUP.COMPLEX_NUMBER,
  IDL_TYPE_LOOKUP.COMPLEX_DOUBLE,
  IDL_TYPE_LOOKUP.COMPLEX_FLOAT,
  IDL_TYPE_LOOKUP.DOUBLE,
  IDL_TYPE_LOOKUP.FLOAT,
];

for (let i = 0; i < NUMBER_INHERITANCE.length; i++) {
  GLOBALS_FOR_TYPES.push({
    type: GLOBAL_TOKEN_TYPES.STRUCTURE,
    name: NUMBER_INHERITANCE[i].toLowerCase(),
    pos: [0, 0, 0],
    meta: {
      display: NUMBER_INHERITANCE[i],
      docs: '',
      source: 'internal',
      props: {},
      inherits: ['idl_number'],
    },
  });
}

/**
 * Number types that inherit from IDL_Integer
 */
const INTEGER_INHERITANCE: string[] = [
  IDL_TYPE_LOOKUP.BYTE,
  IDL_TYPE_LOOKUP.INTEGER,
  IDL_TYPE_LOOKUP.LONG,
  IDL_TYPE_LOOKUP.LONG64,
  IDL_TYPE_LOOKUP.UNSIGNED_INTEGER,
  IDL_TYPE_LOOKUP.UNSIGNED_LONG,
  IDL_TYPE_LOOKUP.UNSIGNED_LONG64,
];

for (let i = 0; i < INTEGER_INHERITANCE.length; i++) {
  GLOBALS_FOR_TYPES.push({
    type: GLOBAL_TOKEN_TYPES.STRUCTURE,
    name: INTEGER_INHERITANCE[i].toLowerCase(),
    pos: [0, 0, 0],
    meta: {
      display: INTEGER_INHERITANCE[i],
      docs: '',
      source: 'internal',
      props: {},
      inherits: ['idl_integer'],
    },
  });
}

GLOBALS_FOR_TYPES.push({
  type: GLOBAL_TOKEN_TYPES.STRUCTURE,
  name: IDL_TYPE_LOOKUP.STRING.toLowerCase(),
  pos: [0, 0, 0],
  meta: {
    display: IDL_TYPE_LOOKUP.STRING,
    docs: '',
    source: 'internal',
    props: {},
    inherits: ['idl_string'],
  },
});

GLOBALS_FOR_TYPES.push({
  type: GLOBAL_TOKEN_TYPES.STRUCTURE,
  name: IDL_TYPE_LOOKUP.POINTER.toLowerCase(),
  pos: [0, 0, 0],
  meta: {
    display: IDL_TYPE_LOOKUP.POINTER,
    docs: '',
    source: 'internal',
    props: {},
    inherits: ['idl_pointer'],
  },
});

/**
 * Merges our manual type overrides for numbers and other entities
 * with the global types from the docs
 */
export function MergeGlobalsForTypes(global: GlobalTokens) {
  for (let i = 0; i < GLOBALS_FOR_TYPES.length; i++) {
    global.push(GLOBALS_FOR_TYPES[i]);
  }
}
