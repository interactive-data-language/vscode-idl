import {
  DEFAULT_DATA_TYPE,
  GLOBAL_TOKEN_SOURCE_LOOKUP,
  IParameterOrPropertyDetails,
  ParameterDirection,
  ParseIDLType,
  SerializeIDLType,
  TYPE_DOCS_REGEX,
} from '@idl/data-types/core';
import { IDL_PROBLEM_CODES, SyntaxProblems } from '@idl/parsing/problem-codes';
import { CommentToken } from '@idl/parsing/tokenizer';
import { PositionArray } from '@idl/parsing/tokenizer-types';
import { IDL_TRANSLATION } from '@idl/translation';
import copy from 'fast-copy';

import { IBasicBranch } from '../branches.interface';
import {
  SyntaxProblemWithoutTranslation,
  SyntaxProblemWithTranslation,
} from '../syntax-problem-with';
import { ARG_KW_PROPERTY_TAG } from './docs.regex.interface';
import { IHeaderDocs, REMOVE_COMMENT_REGEX } from './extract-docs.interface';
import {
  DIRECTION_DOCS,
  PRIVATE_DOCS,
  REQUIRED_DOCS,
} from './extract-parameter-docs.interface';
import { JoinDocs } from './join-docs';

/**
 * Extracts docs from our comment blocks for arguments or keywords (i.e. parameters)
 */
export function ExtractParameterDocs(
  header: IHeaderDocs,
  reference: { [key: string]: string }, // contains the reference display names
  problems: SyntaxProblems,
  properties = false
): {
  [key: string]: IParameterOrPropertyDetails;
} {
  /** Details for arguments or keywords */
  const details: { [key: string]: IParameterOrPropertyDetails } = {};

  /** Extract the comments */
  const comments = header.comments;

  /** Extract comments */
  const docs = header.docs;

  /** Strings for docs */
  const docsStrings: string[] = [];

  /** Tokens for docs */
  const docsComments: IBasicBranch<CommentToken>[] = [];

  /** Track the last found block which we will save text to if a new block is not found */
  let lastFound: IParameterOrPropertyDetails = undefined;

  /** Match for testing string */
  let match: RegExpExecArray;

  /** Line of code we are processing */
  let line: string;

  // check for
  for (let i = 0; i < comments.length; i++) {
    // extract line
    line = docs[i];

    // cleanup our line
    line = line.replace(REMOVE_COMMENT_REGEX, '');

    // check if we have a new header or not
    match = ARG_KW_PROPERTY_TAG.exec(line);
    if (match !== null) {
      // check if we have docs to save
      if (lastFound !== undefined) {
        lastFound.docs = JoinDocs(docsStrings, docsComments, problems);
      }

      // clean up docs
      docsStrings.splice(0, docsStrings.length);
      docsComments.splice(0, docsComments.length);

      // initialize hover help for comment
      comments[i].hoverOverride = [];

      // make new last found
      lastFound = {
        docs: '',
        direction: 'in',
        source: GLOBAL_TOKEN_SOURCE_LOOKUP.INTERNAL,
        type: ParseIDLType(DEFAULT_DATA_TYPE),
        private: false,
        req: false,
        display: match[1].trim(),
        code: false,
        pos: comments[i].pos,
      };

      /**
       * Get the keys, might have more than one if we are coming from
       * the legacy IDL doc tags
       */
      const keys = match[1]
        .trim()
        .toLowerCase()
        .split(/,/g)
        .map((key) => key.trim());

      // process each key
      for (let z = 0; z < keys.length; z++) {
        // get actual key
        const key = keys[z];

        // check for a parameter not existing
        if (!(key in reference)) {
          problems.push(
            SyntaxProblemWithoutTranslation(
              IDL_PROBLEM_CODES.DOCUMENTED_PARAMETER_DOESNT_EXIST,
              `${
                IDL_TRANSLATION.parsing.errors[
                  IDL_PROBLEM_CODES.DOCUMENTED_PARAMETER_DOESNT_EXIST
                ]
              }: "${key}"`,
              comments[i].pos,
              comments[i].pos
            )
          );
        } else {
          // update display name from our reference if we only have one
          if (keys.length === 1) {
            lastFound.display = reference[key];
          }
          lastFound.code = true;
        }

        // save our new block
        details[key] = lastFound;
      }

      /** Length of our match, variable so we can re-use later */
      const splitStart = match.index + match[0].length;

      // get the text afterwards if we have any
      const after = line.substring(splitStart);

      // split into the docs details
      const split = after
        .split(TYPE_DOCS_REGEX)
        .slice(1)
        .filter((el, idx) => idx % 2 === 0);

      // check if we have a property doc string that we are parsing
      if (properties) {
        // check the information that we split out
        switch (true) {
          case split.length < 1:
            problems.push(
              SyntaxProblemWithTranslation(
                IDL_PROBLEM_CODES.NOT_ENOUGH_PROPERTY_DOCS_PARAMETERS,
                comments[i].pos,
                comments[i].pos
              )
            );
            break;
          case split.length > 1:
            problems.push(
              SyntaxProblemWithTranslation(
                IDL_PROBLEM_CODES.TOO_MANY_PROPERTY_DOCS_PARAMETERS,
                comments[i].pos,
                comments[i].pos
              )
            );
            break;
          default:
            break;
        }

        // if we have at least one parameter, save it as a type
        if (split.length > 0) {
          // get trimmed string
          const trimmed = split[0].trim();

          // make the position for what we are processing
          const pos: PositionArray = [
            comments[i].pos[0],
            line.indexOf(trimmed) + 1,
            trimmed.length,
          ];

          lastFound.type = ParseIDLType(trimmed);
          // // TODO: verify that the type is correct
          // if (IsValidType(compare)) {
          //   lastFound.dataType = compare;
          // } else {
          //   // PROBLEM
          //   syntax.push(
          //     ProblemWithTranslation(
          //       IDL_PROBLEM_CODES.INVALID_TYPE_DOCS,
          //       pos,
          //       pos
          //     )
          //   );
          // }
          comments[i].hoverOverride.push({
            pos,
            docs: `${
              IDL_TRANSLATION.docs.hover.params.typeProp
            }: \`${SerializeIDLType(lastFound.type)}\``,
          });
        }
      } else {
        // check the information that we split out
        switch (true) {
          case split.length < 3:
            problems.push(
              SyntaxProblemWithTranslation(
                IDL_PROBLEM_CODES.NOT_ENOUGH_DOCS_PARAMETERS,
                comments[i].pos,
                comments[i].pos
              )
            );
            break;
          case split.length > 4:
            problems.push(
              SyntaxProblemWithTranslation(
                IDL_PROBLEM_CODES.TOO_MANY_DOCS_PARAMETERS,
                comments[i].pos,
                comments[i].pos
              )
            );
            break;
          default:
            break;
        }

        // process all of our elements
        for (let di = 0; di < split.length; di++) {
          // get trimmed string
          const trimmed = split[di].trim();

          /** Get comparison string */
          const compare = trimmed.toLowerCase();

          // make the position for what we are processing
          const pos: PositionArray = [
            comments[i].pos[0],
            line.indexOf(trimmed) + 1,
            trimmed.length,
          ];

          // determine which item we are processing
          switch (di) {
            case 0:
              if (compare in DIRECTION_DOCS) {
                if (compare === 'bd') {
                  lastFound.direction = 'bidirectional';
                } else {
                  lastFound.direction = compare as ParameterDirection;
                }
              } else {
                problems.push(
                  SyntaxProblemWithTranslation(
                    IDL_PROBLEM_CODES.INVALID_IN_OUT_DOCS,
                    pos,
                    pos
                  )
                );
              }

              // save as hover override
              comments[i].hoverOverride.push({
                pos,
                docs: `${IDL_TRANSLATION.docs.hover.params.direction}: \`${compare}\``,
              });
              break;
            case 1:
              if (compare in REQUIRED_DOCS) {
                lastFound.req = compare === 'required' ? true : false;
              } else {
                problems.push(
                  SyntaxProblemWithTranslation(
                    IDL_PROBLEM_CODES.INVALID_REQUIRED_OPTIONAL_DOCS,
                    pos,
                    pos
                  )
                );
              }

              comments[i].hoverOverride.push({
                pos,
                docs: `${IDL_TRANSLATION.docs.hover.params.required}: \`${
                  compare === 'required'
                    ? IDL_TRANSLATION.docs.hover.params.true
                    : IDL_TRANSLATION.docs.hover.params.false
                }\``,
              });
              break;
            case 2:
              lastFound.type = ParseIDLType(split[di]);
              // // TODO: verify that the type is correct
              // if (IsValidType(compare)) {
              //   lastFound.dataType = compare;
              // } else {
              //   // PROBLEM
              //   syntax.push(
              //     ProblemWithTranslation(
              //       IDL_PROBLEM_CODES.INVALID_TYPE_DOCS,
              //       pos,
              //       pos
              //     )
              //   );
              // }
              comments[i].hoverOverride.push({
                pos,
                docs: `${
                  IDL_TRANSLATION.docs.hover.params.typeParam
                }: \`${SerializeIDLType(lastFound.type)}\``,
              });
              break;
            case 3:
              if (compare in PRIVATE_DOCS) {
                lastFound.private = compare === 'private' ? true : false;
              } else {
                problems.push(
                  SyntaxProblemWithTranslation(
                    IDL_PROBLEM_CODES.INVALID_PRIVATE_DOCS,
                    pos,
                    pos
                  )
                );
              }
              comments[i].hoverOverride.push({
                pos,
                docs: `${IDL_TRANSLATION.docs.hover.params.private}: \`${
                  lastFound.private ? 'true' : 'false'
                }\``,
              });
              break;
            default:
              break;
          }
        }
      }

      // determine how to proceed

      // skip to next line
      continue;
    }

    // save line
    if (lastFound !== undefined) {
      docsStrings.push(docs[i]);
      docsComments.push(comments[i]);
    }
  }

  // check if we have docs to save
  if (lastFound !== undefined) {
    lastFound.docs = JoinDocs(docsStrings, docsComments, problems);
  }

  // if not IDL doc, reset all hover overrides
  if (header.type !== 'idldoc') {
    for (let i = 0; i < comments.length; i++) {
      comments[i].hoverOverride = [];
    }
  }

  /** Track keys we processed */
  const processed: { [key: string]: undefined } = {};

  // clean up display names and correct for the duplicates
  // this is for legacy IDL doc tags
  const keys = Object.keys(details);
  for (let i = 0; i < keys.length; i++) {
    // if we have comma separated then we have multiple for one!
    if (details[keys[i]].display.includes(',')) {
      /** Get source and copy it */
      const prime = copy(details[keys[i]]);

      /** Get all display names */
      const allDisplay = details[keys[i]].display
        .split(/,/g)
        .map((item) => item.trim());

      // process each display name
      for (let z = 0; z < allDisplay.length; z++) {
        if (z === 0) {
          details[keys[i]].display = allDisplay[z];
          continue;
        }

        /** get lower case */
        const lc = allDisplay[z].toLowerCase();

        // check if we need to skip
        if (lc in processed) {
          continue;
        }

        // update display name
        prime.display = allDisplay[z];

        // save
        details[lc] = copy(prime);

        // track as processed
        processed[lc] = undefined;
      }
    }
  }

  return details;
}
