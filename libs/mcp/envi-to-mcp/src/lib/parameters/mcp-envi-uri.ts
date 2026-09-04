import { z } from 'zod';

/**
 * Grabs first extension to the end of the string
 */
const EXT_REGEX = /\..*$/i;

/**
 * Gets full extension when files have multiple "."s in them
 */
function GetExtension(str: string) {
  const match = EXT_REGEX.exec(str);
  if (match !== null) {
    return match[0];
  } else {
    return '';
  }
}

/**
 * Creates an ENVI URI
 */
export function MCP_ENVIURI(extension = '.dat') {
  return z.string().optional();
  // .transform((val) => {
  //   // return if nothing since it can be optional
  //   if (!val) {
  //     return val;
  //   }

  //   // if not a temp file, then return
  //   if (val !== '!' && val !== '#') {
  //     /** Normalize our file extension */
  //     const normExt = (
  //       extension[0] === '.' ? extension : `.${extension}`
  //     ).toLowerCase();

  //     /** Get extension (includes leading dot) */
  //     const found = GetExtension(basename(val)).toLowerCase();
  //     if (found) {
  //       if (normExt !== found) {
  //         return val + extension;
  //       } else {
  //         return val;
  //       }
  //     } else {
  //       return val + extension;
  //     }
  //   } else {
  //     return val;
  //   }
  // });
}
