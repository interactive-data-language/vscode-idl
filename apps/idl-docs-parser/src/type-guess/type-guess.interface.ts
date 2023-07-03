import { IDL_TYPE_LOOKUP } from '@idl/data-types/core';

/**
 * By IDL data type, track regular expressions we can use to auto-populate the
 * types from parsing documentation.
 *
 * This automated process has the goal of dramatically simplifying manual
 * data entry.
 */
export const TYPE_GUESS: { [key: string]: RegExp[] } = {};

TYPE_GUESS['ENVIROI'] = [
  /^Specify the ROI/im,
  /^This is a reference to the output ROI/im,
];

TYPE_GUESS['ENVISpectralLibrary'] = [/^Specify the spectral library/im];

TYPE_GUESS['ENVIStretchParameters'] = [
  /^Specify an \[ENVIStretchParameters\]/im,
];

TYPE_GUESS['ENVIRaster'] = [
  /^Specify a raster /im,
  /^Specify the raster /im,
  /^Specify the input \[ENVIRaster\]/im,
  /^Specify an input raster /im,
  /^Specify an input ENVIRaster/im,
  /^A reference to an ENVIRaster/im,
  /^Specify a single-band, two-dimensional ENVIRaster/im,
  /^This is a reference to the output raster/im,
  /^Specify the input raster/im,
  /^Specify a multispectral input raster/im,
  /^Specify a single-band raster/im,
  /^The \[ENVIRaster\]/im,
  /^Specify a classification raster/im,
  /^Specify a classification \[ENVIRaster\]/im,
];

TYPE_GUESS['ENVIVector'] = [
  /^Specify an input ENVIVector/im,
  /^This is a reference to the output vector/,
];

TYPE_GUESS['ENVITiePointSet'] = [
  /^This is a reference to an \[ENVITiePointSet\]/im,
];

TYPE_GUESS['ENVIStandardRasterSpatialRef'] = [
  /^Specify an \[ENVIStandardRasterSpatialRef\]/im,
];

TYPE_GUESS['ENVIPointCloudSpatialRef'] = [
  /^Specify an \[ENVIPointCloudSpatialRef\]/im,
  /^The spatial reference to the target \[ENVIPointCloudSpatialRef\]/im,
];

TYPE_GUESS['ENVICoordSys'] = [
  /^Set this optional argument to an \[ENVICoordSys\]/im,
  /^The coordinate system \(\[ENVICoordSys\]/im,
];

TYPE_GUESS['ENVITask'] = [/^A scalar ENVITask /im];

TYPE_GUESS['IDLffXMLDOMNode'] = [
  /^An object reference to an instance of an IDLffXMLDOMNode/im,
];

TYPE_GUESS[`${IDL_TYPE_LOOKUP.ARRAY}<ENVIROI>`] = [
  /^This is an array of ROIs/im,
];

TYPE_GUESS[`${IDL_TYPE_LOOKUP.ARRAY}<${IDL_TYPE_LOOKUP.DOUBLE}>`] = [
  /^Specify a double-precision array/im,
  /^Specify a two-element double-precision /im,
];

TYPE_GUESS[`${IDL_TYPE_LOOKUP.ARRAY}<${IDL_TYPE_LOOKUP.UNSIGNED_INTEGER}>`] = [
  /^Specify an unsigned integer array /im,
];

TYPE_GUESS[`${IDL_TYPE_LOOKUP.ARRAY}<${IDL_TYPE_LOOKUP.LONG}>`] = [
  /^Specify an unsigned integer array /im,
  /array (long)/im,
  /^A long array /im,
  /^A long value /im,
];

TYPE_GUESS[`${IDL_TYPE_LOOKUP.ARRAY}<${IDL_TYPE_LOOKUP.NUMBER}>`] = [
  /^Returns an array/im,
];

TYPE_GUESS[IDL_TYPE_LOOKUP.ARRAY] = [
  /^A (a-z_-)+ (vector|array)/im,
  /^Set this (keyword|property) to an array/im,
  /^Set this (keyword|property) to a (a-z_-)+ vector/im,
  /^An array /im,
  /^Specify an array /im,
  /^A vector /im,
];

TYPE_GUESS[IDL_TYPE_LOOKUP.FLOAT] = [
  /^A floating point/im,
  /^Specify a floating-point /im,
  /^A floating-point /im,
  /^\(float\)/im,
  /^Set this property to a floating-point /im,
  /\bsingle-precision floating point\b/im,
  /^Set this property to a floating point/im,
];

TYPE_GUESS[IDL_TYPE_LOOKUP.UNSIGNED_LONG] = [
  /^An integer/im,
  /^An unsigned long integer /im,
];

TYPE_GUESS[IDL_TYPE_LOOKUP.LONG] = [
  /^If set, the result type is 64-bit/im,
  /^A longword integer /im,
  /^A long integer /im,
  /\(long\)/im,
  /\(0-based long\)/im,
];

TYPE_GUESS[IDL_TYPE_LOOKUP.INTEGER] = [
  /^An integer/im,
  /^Set this property to an integer/im,
  /^A scalar integer/im,
];

TYPE_GUESS[IDL_TYPE_LOOKUP.DOUBLE] = [
  /^Specify a double-precision /im,
  /\bdouble-precision floating point\b/im,
  /\(double\)/im,
];

TYPE_GUESS[IDL_TYPE_LOOKUP.NUMBER] = [
  /^Specify the maximum/im,
  /^Specify the number/im,
  /^Specify the minimum/im,
  /^A user-defined scale factor/im,
  /^The number of/im,
  /^The total number/im,
  /^Set this property to the maximum/im,
  /^Set this property to the minimum/im,
  /^Specify the value for minimum/im,
  /^The height of /im,
  /^The widget ID /im,
  /^The width of /im,
  /^The vertical offset /im,
  /^The horizontal offset /im,
  /^The maximum /im,
  /^The minimum /im,
  /^The index of /im,
  /^A zero-based index /im,
  /^A scalar specifying the maximum/im,
  /^A scalar specifying the minimum/im,
  /\bfile X-coordinate\b/im,
  /\bfile Y-coordinate\b/im,
  /\bmap x-coordinate\b/im,
  /\bmap y-coordinate\b/im,
  /\bgeographic longitude\b/im,
  /\bgeographic latitude\b/im,
  /\blongitude coordinate\b/im,
  /\blatitude coordinate\b/im,
  /\blongitude value\b/im,
  /\blatitude value\b/im,
  /^A scalar number/im,
  /^The zero-based index/im,
  /^Maximum number/im,
  /^Minimum number/im,
  /^Number of/im,
  /^The angle of rotation/im,
  /^The angle/im,
  /^The tag number/im,
  /^The reference number/im,
  /^The record number/im,
];

TYPE_GUESS[IDL_TYPE_LOOKUP.STRING] = [
  /^A string/im,
  /^Specify the name/im,
  /^Specify the purpose/im,
  /^The string /im,
  /^Specify a description /im,
  /^Specify a string /im,
  /^A scalar string /im,
  /^Set this property to the name /im,
  /^The name of /im,
  /^Enter a string /im,
  /^Specify a vegetation index/im,
  /^Specify one of the following strings /im,
  /^Specifies a case-sensitive string/im,
  /\btitle\b/im,
  /^Set this keyword equal to a string/im,
  /^String name /im,
  /\(string\)/im,
  /^Specify the input URI/im,
  /^The full URI/im,
  /^A required string/im,
  /^Set to a string/im,
  /^The tag name/im,
  /file\.$/im,
];

TYPE_GUESS['Hash'] = [
  /^Specify a variable name for a style sheet \(in the form of an IDL hash\)/im,
  /^Specify a hash /im,
];

TYPE_GUESS[IDL_TYPE_LOOKUP.ANY] = [
  /^Set this keyword to a named variable/im,
  /^Set this property to an IDL variable /im,
  /^Set this keyword equal to a named variable/im,
  /^The user value /im,
  /^The “user value” /im,
];

TYPE_GUESS[IDL_TYPE_LOOKUP.BOOLEAN] = [
  /^Set this (keyword|property) to 1/im,
  /^Set this (keyword|property) if/im,
  /^Set this (keyword|property) to create/im,
  /^Set this keyword to (?!(?:a|an|the|'|"|`|\(|\[)\b)/im,
  /^Set to `true` /im,
  /^A boolean value /im,
  /^If present and nonzero/im,
  /^If this keyword is specified/im,
  /^If this keyword is set,/im,
  /^Flag, /im,
  /^If this field is set to 1/im,
  /^True \(1\) /im,
  /^a non-zero value/im,
  /^If set,/im,
];
