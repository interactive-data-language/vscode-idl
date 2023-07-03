import { UpdateThese } from '../../helpers/set-keywords-as-properties.interface';

/**
 * Lookup that defines the locations of other routines that we should get keywords
 * from.
 *
 * This is an obnoxious aspect of our docs where we have a function AND an init method
 * for classes, so we need to steal keywords from somewhere else at times
 *
 * First entry is the source, everything else is what we borrow from
 */
export const GET_KEYWORDS_FROM: {
  [key: string]: UpdateThese;
} = {};
// example,. but all structures do this autoamtically now
// GET_KEYWORDS_FROM['idlffxmldomdocument'] = [
//   ['idlffxmldomdocument', GLOBAL_TOKEN_TYPES.FUNCTION],
//   ['idlffxmldomdocument::init', GLOBAL_TOKEN_TYPES.FUNCTION_METHOD],
// ];
