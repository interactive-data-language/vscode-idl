import {
  GlobalDisplayNameLookup,
  OBSOLETE_FUNCTION_METHODS,
  OBSOLETE_FUNCTIONS,
  OBSOLETE_PROCEDURE_METHODS,
  OBSOLETE_PROCEDURES,
} from '@idl/parsing/routines';
import { IDL_DOCS_HEADERS } from '@idl/parsing/syntax-tree';
import { readFileSync } from 'fs';
import { parse } from 'himalaya';

import { IHTMLByRoutine, IRoutineHTML } from '../main.interface';
import { InheritanceGuess } from '../type-guess/inheritance-guess';
import { ElementsToText } from './elements-to-text';
import { HTMLToDocs } from './html-to-docs';
import { HTMLToMarkdownBasic } from './html-to-markdown';
import { JoinCode } from './join-code';
import { IParsedHTML } from './parser.interface';
import { IParameterHTML } from './process-parameters.interface';

/**
 * Cleans the name of an item that we store in an object. Must clean up
 * to remove stupid HTML characters, extra spaces, etc.
 */
function CleanName(children: IParsedHTML[]) {
  return ElementsToText(children)
    .replace(/\sprocedure/gim, '')
    .replace(/&#160;/gim, ' ')
    .trim();
}

function IsLikelyObsolete(name: string) {
  switch (true) {
    case name in OBSOLETE_FUNCTIONS:
      return true;
    case name in OBSOLETE_FUNCTION_METHODS:
      return true;
    case name in OBSOLETE_PROCEDURES:
      return true;
    case name in OBSOLETE_PROCEDURE_METHODS:
      return true;
    default:
      return false;
  }
}

/**
 * Loads and parses HTML data for docs
 */
export async function ParseDocsHTML(file: string) {
  // read a file
  const strings = readFileSync(file, { encoding: 'utf-8' });

  /** Parse the HTML */
  const parsed: IParsedHTML[] = parse(strings);

  // get the html content
  const html = parsed[parsed.length - 1];

  /** Get reference to the body */
  let body: IParsedHTML;

  /** Get a reference to the main content div */
  let content: IParsedHTML;

  // find body
  if ('children' in html) {
    for (let i = 0; i < html.children.length; i++) {
      if (html.children[i].tagName === 'body') {
        body = html.children[i];
        break;
      }
    }
  }

  // find main content
  if (body !== undefined) {
    const kids = body.children;
    for (let i = 0; i < kids.length; i++) {
      if (kids[i].type === 'text') {
        continue;
      }
      if (kids[i].tagName === 'div') {
        if (kids[i].attributes !== undefined) {
          if (kids[i].attributes[0].key === 'role') {
            content = kids[i];
          }
        }
      }
    }
  }

  /** Name of the current routine */
  let name: string;

  /** Docs for all routines in our file */
  const allHTMLDocs: IHTMLByRoutine = {};

  /** Docs by sections of current routine */
  let routineDocs: IRoutineHTML = {
    name: 'unknown',
    link: IDL_DOCS_HEADERS.DEFAULT,
    docs: {},
    args: {},
    keywords: {},
    properties: {},
  };

  /** HTML elements for current routine section  */
  let children: IParsedHTML[] = [];

  /** Arguments for current routine */
  let theseArgs: IParameterHTML = {};

  /** HTML elements for current argument */
  let argsChildren: IParsedHTML[] = [];

  /** Keywords for current routine */
  let theseKws: IParameterHTML = {};

  /** HTML elements for current argument */
  let kwChildren: IParsedHTML[] = [];

  /** Keywords for current routine */
  let theseProps: IParameterHTML = {};

  /** HTML elements for current argument */
  let propChildren: IParsedHTML[] = [];

  /** Current arg/keyword that we are parsing */
  let current: 'none' | 'arg' | 'kw' | 'prop';

  /** Flag if we have docs along the line of "Name Properties" so we only have properties */
  let onlyProperties = false;

  // process our children
  if (content !== undefined) {
    // get all of our children
    const kids = content.children;

    // clean up code blocks
    await JoinCode(kids);

    // process each one
    for (let i = 0; i < kids.length; i++) {
      if (kids[i].type === 'text') {
        continue;
      }

      // get our child
      const element = kids[i];

      // process our tag
      switch (true) {
        // routine name
        case element.tagName === 'h3' &&
          element?.attributes[0]?.value === 'Sysvar':
        // eslint-disable-next-line no-fallthrough
        case element.tagName === 'h1': {
          name = CleanName(element.children);

          // extract the anchor name from the first child
          let link: string = IDL_DOCS_HEADERS.DEFAULT; // default value for the link name, not everything has it

          // validate that we have children
          if (element.children.length > 0) {
            // get first child
            const first = element.children[0];

            // verify it is an element and not just text
            if (first.type === 'element') {
              // verify element
              if (first.type === 'element' && first.tagName === 'a') {
                link = first.attributes[0].value;
              }
            }
          }

          // create new routine docs
          routineDocs = {
            name: name,
            link: link,
            docs: {},
            args: {},
            keywords: {},
            properties: {},
          };

          // update args and keywords vars
          theseArgs = routineDocs.args;
          theseKws = routineDocs.keywords;
          theseProps = routineDocs.properties;

          // set placeholder for having a description
          children = [];
          routineDocs.docs[IDL_DOCS_HEADERS.DEFAULT] = children;

          // check if we need to set a default docs block for system variable and custom name
          if (element.tagName === 'h3') {
            // split name by comma since some system variables share the same documentation
            // but we need separate entries for all three of them
            const split = name.split(',').map((item) => item.trim());
            for (let z = 0; z < split.length; z++) {
              // save reference
              allHTMLDocs[split[z].toLowerCase()] = routineDocs;
            }
          } else {
            // split name by '/' since some routines that share the same docs and
            // we need to capture them all
            const split = name.split('/').map((item) => item.trim());
            for (let z = 0; z < split.length; z++) {
              // save reference
              allHTMLDocs[split[z].toLowerCase()] = routineDocs;
            }
          }

          // check if we only have properties
          if (name.endsWith(' Properties')) {
            onlyProperties = true;
            current = 'prop';
          } else {
            // reset current thing we are processing
            current = 'none';
          }

          break;
        }
        // section name
        case element.tagName === 'h4' &&
          element?.attributes[0]?.value === 'SysvarField': {
          // get the name of our system variable property
          const title = CleanName(element.children);

          // set that we are handling a property
          current = 'prop';

          // get a clean title to use
          const useTitle = title.replace(
            / \(Init, Get\)| \(Get, Init\)| \(Get Only\)| \(Get, Set\)| \(Get\)| \(Init\)/gim,
            ''
          );

          propChildren = [];
          theseProps[useTitle] = propChildren;
          break;
        }
        case element.tagName === 'h2': {
          const title = CleanName(element.children);

          // check if we have extra content for properties, but no properties identified
          if (current === 'prop' && !name.endsWith(' Task')) {
            // check the name of our item
            const useName = name.toLowerCase();

            // check if we have a guess at inheritance
            const guess = InheritanceGuess(useName);

            // skip saving properties if we have information about inheritance
            const skip = guess.length > 0 || IsLikelyObsolete(useName);

            // check if there are children
            if (Object.keys(theseProps).length === 0 && !skip) {
              const sanity = HTMLToMarkdownBasic(propChildren)
                .trim()
                .toLowerCase();
              if (!sanity.startsWith('none')) {
                routineDocs.docs['Properties'] = propChildren;
              }
            }
          }

          // check if we have a properties title
          const compareTitle =
            title.toLowerCase().endsWith(' properties') || onlyProperties
              ? 'Properties'
              : title;

          // check special cases
          switch (compareTitle) {
            case 'Arguments':
              current = 'arg';
              break;
            case 'Keywords':
              current = 'kw';
              break;
            case 'Properties':
              current = 'prop';
              break;
            default: {
              children = [];

              // get a unique title
              let useTitle = compareTitle;
              let duplicates = 0;
              // eslint-disable-next-line no-constant-condition
              while (true) {
                if (useTitle in routineDocs.docs) {
                  duplicates += 1;
                  useTitle = `${title} (${duplicates})`;
                } else {
                  break;
                }
              }

              routineDocs.docs[useTitle] = children;
              current = 'none';
              break;
            }
          }
          break;
        }
        // section name
        case element.tagName === 'h3': {
          const title = CleanName(element.children);
          const superCleaned = title.replace(/\s*\(.*\)/gim, '').toLowerCase();

          // TODO:  alert dev that they need to manually specify information for
          // this routine
          // const split = superCleaned.split(' ');
          // if (split.length > 1 && current !== 'none') {
          //   console.log(superCleaned);
          // }

          switch (current) {
            case 'arg':
              argsChildren = [];
              theseArgs[superCleaned] = argsChildren;
              break;
            case 'kw':
              kwChildren = [];
              theseKws[superCleaned] = kwChildren;
              break;
            case 'prop': {
              propChildren = [];
              theseProps[superCleaned] = propChildren;

              // check if we also have a keyword that we can specify on init
              if (/\(Init|Init\)$|Set\)/gim.test(title)) {
                theseKws[superCleaned] = propChildren;
              }
              break;
            }
            default:
              element.tagName === 'h5';
              children.push(element);
              // children = [];
              // routineDocs[title] = children;
              break;
          }
          break;
        }
        case element.tagName === 'table':
        case element.tagName === 'h4':
        case element.tagName === 'pre':
        case element.tagName === 'ul':
        case element.tagName === 'li':
        case element.tagName === 'p': {
          switch (current) {
            case 'arg':
              argsChildren.push(element);
              break;
            case 'kw':
              kwChildren.push(element);
              break;
            case 'prop':
              propChildren.push(element);
              break;
            default:
              children.push(element);
              break;
          }

          break;
        }
        default:
          break;
      }
    }
  }

  return allHTMLDocs;
}

/**
 * Parses an HTML file from our documentation and converts it to a friendly markdown format
 */
export async function DocsParser(
  file: string,
  lookup: GlobalDisplayNameLookup
) {
  // convert all to HTML and return
  return HTMLToDocs(await ParseDocsHTML(file), file, lookup);
}
