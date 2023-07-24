import {
  IDL_LANGUAGE_NAME,
  LANGUAGE_TOKEN_SCOPE_NAME,
  LOG_LANGUAGE_NAME,
  LOG_LANGUAGE_TOKEN_SCOPE_NAME,
} from '@idl/shared';
import * as merge from 'deepmerge';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import * as plist from 'plist';
import * as YAML from 'yaml';

/** Regular expression to detect when our child expression needs to be made case insensitive */
const LOWER_CASE_REGEX = /(?<!\\)[a-z]/gim;

/**
 * Makes patterns case insensitive so we dont have to remember to do this oursleves
 */
function CaseInsensitize(item: { [key: string]: any }) {
  // check if we need to clean up a match property
  if (item.match !== undefined) {
    item.match = `(?i)${item.match}`;
  }

  // check if we need to clean up a begin
  if (item.begin !== undefined) {
    item.begin = `(?i)${item.begin}`;
  }

  // check if we need to clean up an end property
  if (item.end !== undefined) {
    item.end = `(?i)${item.end}`;
  }

  // check for nested patterns
  if (Array.isArray(item.patterns)) {
    for (let i = 0; i < item.patterns.length; i++) {
      CaseInsensitize(item.patterns[i]);
    }
  }

  // Check for nested captures, beginCaptures, endCaptures
  const recurseKeys = ['captures', 'beginCaptures', 'endCaptures'];
  for (let i = 0; i < recurseKeys.length; i++) {
    if (recurseKeys[i] in item) {
      const children = Object.values(item[recurseKeys[i]]);
      for (let j = 0; j < children.length; j++) {
        CaseInsensitize(children[j]);
      }
    }
  }
}

/**
 * Converts our language file from YAML to JSON and accounts for the variables section of the YAML
 */
function MakeTMLanguageFile(
  source: string,
  dest: string,
  langName = IDL_LANGUAGE_NAME,
  scopeName = LANGUAGE_TOKEN_SCOPE_NAME
) {
  /** YAML file as strings for easier manipulation of the variables */
  let strings = readFileSync(source, { encoding: 'utf-8' });

  /** Parse the document to get our variables */
  let parsed = YAML.parse(strings);

  // if we have variables, replace them all
  if ('variables' in parsed) {
    /** Variables that we need to replace with regex */
    const vars: { [key: string]: string } = parsed.variables;

    /** Get variable names */
    const names = Object.keys(vars);

    // process each variable
    for (let i = 0; i < names.length; i++) {
      strings = strings.replace(
        new RegExp(`{\\s*{\\s*${names[i]}\\s*}\\s*}`, 'gim'),
        vars[names[i]]
      );
    }

    // parse again
    parsed = YAML.parse(strings);
  }

  // update properties in the file so they are consistent with our configuration
  parsed['name'] = langName;
  parsed['scopeName'] = scopeName;

  // delete variables
  delete parsed['variables'];

  // post-process the expressions to make them correctly case insensitive
  const repo = parsed['repository'];

  // get keys
  const keys = Object.keys(repo);

  // handle case sensitivity in first-level matches
  for (let i = 0; i < keys.length; i++) {
    CaseInsensitize(repo[keys[i]]);
  }

  // second pass through for merging entities
  for (let i = 0; i < keys.length; i++) {
    const item = repo[keys[i]];

    // check if we need to merge objects together
    if ('<<' in item) {
      // get key to merge with
      const keysMerge: string[] = !Array.isArray(item['<<'])
        ? [item['<<']]
        : item['<<'];

      // delete merge keys
      delete item['<<'];

      // merge together
      for (let j = 0; j < keysMerge.length; j++) {
        const keyMerge = keysMerge[j];

        // validate merge key exists
        if (!(keyMerge in repo)) {
          throw new Error(`Repository key not found for merge: "${keyMerge}"`);
        }

        // merge
        repo[keys[i]] = merge(repo[keys[i]], repo[keyMerge]);
      }
    }
  }

  // write our plist to disk
  writeFileSync(dest, plist.build(parsed));
}

/**
 * Directory that our syntaxes live in
 */
const IN_DIR = join(process.cwd(), 'extension', 'language', 'syntaxes', 'src');

/**
 * Directory that our syntaxes live in
 */
const OUT_DIR = join(process.cwd(), 'extension', 'language', 'syntaxes');

/**
 * Convert our YAML tmLanguage file
 */
MakeTMLanguageFile(
  join(IN_DIR, 'idl.tmLanguage.yaml'),
  join(OUT_DIR, 'idl.tmLanguage')
);

/**
 * Convert our YAML tmLanguage file for logs
 */
MakeTMLanguageFile(
  join(IN_DIR, 'idl-log.tmLanguage.yaml'),
  join(OUT_DIR, 'idl-log.tmLanguage'),
  LOG_LANGUAGE_NAME,
  LOG_LANGUAGE_TOKEN_SCOPE_NAME
);
