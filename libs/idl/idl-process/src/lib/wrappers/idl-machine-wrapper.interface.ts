export const IDL_DATA_TYPE_MAP = {
  '0': 'Undefined',
  '1': 'byte',
  '2': 'int',
  '12': 'unit',
  '3': 'long',
  '13': 'ulong',
  '14': 'long64',
  '15': 'ulong64',
  '4': 'float',
  '5': 'double',
  '6': 'complex',
  '9': 'dcomplex',
  '7': 'string',
  '8': 'struct',
  '10': 'pointer',
  '11': 'object',
};

export const OBJ_CLASS_REGEX = /<ObjHeapVar[0-9]+\(([a-z0-9_$!]+)\)>/gim;
