import {
  IClassLookup,
  IGlobalLocationLookup,
  IGlobalTokenPosition,
} from '@idl/parsing/syntax-tree';
import {
  RoutineMethodNameToken,
  TokenStartMatches,
} from '@idl/parsing/tokenizer';

/**
 * Handles logic to save a match to our lookup. Just wraps handling arrays
 * when a definition exists already.
 */
export function SaveMatch(
  lookup: IGlobalLocationLookup,
  routineName: string,
  info: IGlobalTokenPosition
) {
  // convert to lower case
  const useMatch = routineName.toLowerCase();

  // save
  if (useMatch in lookup) {
    lookup[useMatch].push(info);
  } else {
    lookup[useMatch] = [info];
  }
}

/**
 * Handles logic to save a match to our lookup. Just wraps handling arrays
 * when a definition exists already.
 */
export function SaveClassMatch(
  lookup: IClassLookup,
  procedure: boolean,
  matches: TokenStartMatches<RoutineMethodNameToken>,
  info: IGlobalTokenPosition
) {
  // get lower case class name
  const className = matches[1].toLowerCase();

  // make entry if it doesnt exist
  if (!(className in lookup)) {
    lookup[className] = {
      source: [],
      pro: {},
      func: {},
    };
  }

  // save our match
  if (procedure) {
    SaveMatch(lookup[className].pro, matches[2], info);
  } else {
    SaveMatch(lookup[className].func, matches[2], info);
  }
}

/**
 * Handles logic to save a match to our lookup. Just wraps handling arrays
 * when a definition exists already.
 */
export function SaveClassSource(
  lookup: IClassLookup,
  className: string,
  info: IGlobalTokenPosition
) {
  // get lower case class name
  const useName = className.toLowerCase();

  // make entry if it doesnt exist
  if (!(useName in lookup)) {
    lookup[useName] = {
      source: [],
      pro: {},
      func: {},
    };
  }

  // save source information
  lookup[useName].source.push(info);
}
