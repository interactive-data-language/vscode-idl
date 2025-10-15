/**
 * Map parsed type expressions (like "bytarr") to the proper type strings
 */
export const ARRAY_SHORTHAND_TYPES: { [key: string]: string } = {
  boolarr: 'Array<Boolean>',
  bytarr: 'Array<Byte>',
  complexarr: 'Array<Complex>',
  dblarr: 'Array<Double>',
  dcomplexarr: 'Array<DoubleComplex>',
  fltarr: 'Array<Float>',
  intarr: 'Array<Int>',
  lonarr: 'Array<Long>',
  lon64arr: 'Array<Long64>',
  strarr: 'Array<String>',
  uintarr: 'Array<UInt>',
  ulonarr: 'Array<ULong>',
  ulon64arr: 'Array<ULong64>',
};
