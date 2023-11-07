import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { GetExtensionPath } from '@idl/shared';
import { readFile } from 'fs/promises';
import { CompletionItem, Position } from 'vscode-languageserver/node';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Structures`, () => {
  it(`[auto generated] without a name`, async () => {
    // create index
    const index = new IDLIndex(
      new LogManager({
        alert: () => {
          // do nothing
        },
      }),
      0
    );

    // specify filepath
    const filepath = GetExtensionPath('idl/test/auto-complete/structures.pro');

    // add file to index
    await index.indexFile(filepath);

    // define position
    const position_0: Position = { line: 8, character: 12 };

    // define expected token we extract
    const expectedFound_0: CompletionItem[] = [
      {
        label: 'a',
        insertText: 'a',
        kind: 5,
        sortText: '02',
        documentation: '',
      },
      {
        label: 'b',
        insertText: 'b',
        kind: 5,
        sortText: '02',
        documentation: '',
      },
    ];

    // verify results
    expect(expectedFound_0).toEqual(
      (
        await index.getAutoComplete(
          filepath,
          await readFile(filepath, 'utf-8'),
          position_0
        )
      ).slice(0, 50)
    );
    // define position
    const position_1: Position = { line: 9, character: 14 };

    // define expected token we extract
    const expectedFound_1: CompletionItem[] = [
      {
        label: 'dim',
        insertText: 'dim',
        kind: 5,
        sortText: '02',
        detail: 'Property of IDL_Variable',
        documentation: {
          kind: 'markdown',
          value: 'An array giving the dimensions (0 for scalars).',
        },
      },
      {
        label: 'length',
        insertText: 'length',
        kind: 5,
        sortText: '02',
        detail: 'Property of IDL_Variable',
        documentation: {
          kind: 'markdown',
          value: 'The number of elements in the variable.',
        },
      },
      {
        label: 'ndim',
        insertText: 'ndim',
        kind: 5,
        sortText: '02',
        detail: 'Property of IDL_Variable',
        documentation: {
          kind: 'markdown',
          value: 'An integer giving the number of dimensions (0 for scalars).',
        },
      },
      {
        label: 'tname',
        insertText: 'tname',
        kind: 5,
        sortText: '02',
        detail: 'Property of IDL_Variable',
        documentation: {
          kind: 'markdown',
          value:
            'A string giving the raw IDL type name. For structures this returns "STRUCT", while for objects this returns "OBJREF".',
        },
      },
      {
        label: 'typecode',
        insertText: 'typecode',
        kind: 5,
        sortText: '02',
        detail: 'Property of IDL_Variable',
        documentation: {
          kind: 'markdown',
          value: 'An integer giving the IDL type code.',
        },
      },
      {
        label: 'typename',
        insertText: 'typename',
        kind: 5,
        sortText: '02',
        detail: 'Property of IDL_Variable',
        documentation: {
          kind: 'markdown',
          value:
            'A string giving the IDL type name. For structures and objects this returns the actual structure or class name.',
        },
      },
      {
        label: 'IDL_String::capWords()',
        insertText: 'capWords()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_String::charAt()',
        insertText: 'charAt()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_String::compress()',
        insertText: 'compress()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_String::contains()',
        insertText: 'contains()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_String::decrypt()',
        insertText: 'decrypt()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_String::encrypt()',
        insertText: 'encrypt()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_String::endsWith()',
        insertText: 'endsWith()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_String::extract()',
        insertText: 'extract()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_String::indexOf()',
        insertText: 'indexOf()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_String::insert()',
        insertText: 'insert()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_String::join()',
        insertText: 'join()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_String::lastIndexOf()',
        insertText: 'lastIndexOf()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_String::matches()',
        insertText: 'matches()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_String::remove()',
        insertText: 'remove()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_String::replace()',
        insertText: 'replace()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_String::reverse()',
        insertText: 'reverse()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_String::split()',
        insertText: 'split()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_String::startsWith()',
        insertText: 'startsWith()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_String::strlen()',
        insertText: 'strlen()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_String::substring()',
        insertText: 'substring()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_String::toByte()',
        insertText: 'toByte()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_String::toLower()',
        insertText: 'toLower()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_String::toUpper()',
        insertText: 'toUpper()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_String::trim()',
        insertText: 'trim()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Variable::compare()',
        insertText: 'compare()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Variable::convert()',
        insertText: 'convert()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Variable::diff()',
        insertText: 'diff()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Variable::equals()',
        insertText: 'equals()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Variable::filter()',
        insertText: 'filter()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Variable::finite()',
        insertText: 'finite()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Variable::fromBits()',
        insertText: 'fromBits()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Variable::hashcode()',
        insertText: 'hashcode()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Variable::hasValue()',
        insertText: 'hasValue()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Variable::isFinite()',
        insertText: 'isFinite()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Variable::isInfinite()',
        insertText: 'isInfinite()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Variable::isNaN()',
        insertText: 'isNaN()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Variable::isReal()',
        insertText: 'isReal()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Variable::map()',
        insertText: 'map()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Variable::nestedMap()',
        insertText: 'nestedMap()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Variable::ptrValid()',
        insertText: 'ptrValid()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Variable::reduce()',
        insertText: 'reduce()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Variable::reform()',
        insertText: 'reform()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Variable::shift()',
        insertText: 'shift()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Variable::sort()',
        insertText: 'sort()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
    ];

    // verify results
    expect(expectedFound_1).toEqual(
      (
        await index.getAutoComplete(
          filepath,
          await readFile(filepath, 'utf-8'),
          position_1
        )
      ).slice(0, 50)
    );
    // define position
    const position_2: Position = { line: 10, character: 21 };

    // define expected token we extract
    const expectedFound_2: CompletionItem[] = [
      {
        label: 'dim',
        insertText: 'dim',
        kind: 5,
        sortText: '02',
        detail: 'Property of IDL_Variable',
        documentation: {
          kind: 'markdown',
          value: 'An array giving the dimensions (0 for scalars).',
        },
      },
      {
        label: 'length',
        insertText: 'length',
        kind: 5,
        sortText: '02',
        detail: 'Property of IDL_Variable',
        documentation: {
          kind: 'markdown',
          value: 'The number of elements in the variable.',
        },
      },
      {
        label: 'ndim',
        insertText: 'ndim',
        kind: 5,
        sortText: '02',
        detail: 'Property of IDL_Variable',
        documentation: {
          kind: 'markdown',
          value: 'An integer giving the number of dimensions (0 for scalars).',
        },
      },
      {
        label: 'tname',
        insertText: 'tname',
        kind: 5,
        sortText: '02',
        detail: 'Property of IDL_Variable',
        documentation: {
          kind: 'markdown',
          value:
            'A string giving the raw IDL type name. For structures this returns "STRUCT", while for objects this returns "OBJREF".',
        },
      },
      {
        label: 'typecode',
        insertText: 'typecode',
        kind: 5,
        sortText: '02',
        detail: 'Property of IDL_Variable',
        documentation: {
          kind: 'markdown',
          value: 'An integer giving the IDL type code.',
        },
      },
      {
        label: 'typename',
        insertText: 'typename',
        kind: 5,
        sortText: '02',
        detail: 'Property of IDL_Variable',
        documentation: {
          kind: 'markdown',
          value:
            'A string giving the IDL type name. For structures and objects this returns the actual structure or class name.',
        },
      },
      {
        label: 'IDL_Number::ceil()',
        insertText: 'ceil()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Number::floor()',
        insertText: 'floor()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Number::imaginary()',
        insertText: 'imaginary()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Number::mean()',
        insertText: 'mean()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Number::median()',
        insertText: 'median()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Number::max()',
        insertText: 'max()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Number::min()',
        insertText: 'min()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Number::product()',
        insertText: 'product()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Number::real()',
        insertText: 'real()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Number::round()',
        insertText: 'round()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Number::signum()',
        insertText: 'signum()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Number::total()',
        insertText: 'total()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Variable::compare()',
        insertText: 'compare()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Variable::convert()',
        insertText: 'convert()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Variable::diff()',
        insertText: 'diff()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Variable::equals()',
        insertText: 'equals()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Variable::filter()',
        insertText: 'filter()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Variable::finite()',
        insertText: 'finite()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Variable::fromBits()',
        insertText: 'fromBits()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Variable::hashcode()',
        insertText: 'hashcode()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Variable::hasValue()',
        insertText: 'hasValue()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Variable::isFinite()',
        insertText: 'isFinite()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Variable::isInfinite()',
        insertText: 'isInfinite()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Variable::isNaN()',
        insertText: 'isNaN()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Variable::isReal()',
        insertText: 'isReal()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Variable::map()',
        insertText: 'map()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Variable::nestedMap()',
        insertText: 'nestedMap()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Variable::ptrValid()',
        insertText: 'ptrValid()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Variable::reduce()',
        insertText: 'reduce()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Variable::reform()',
        insertText: 'reform()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Variable::shift()',
        insertText: 'shift()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Variable::sort()',
        insertText: 'sort()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Variable::toBits()',
        insertText: 'toBits()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Variable::toDouble()',
        insertText: 'toDouble()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Variable::toInteger()',
        insertText: 'toInteger()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Variable::toList()',
        insertText: 'toList()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Variable::toString()',
        insertText: 'toString()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'IDL_Variable::uniq()',
        insertText: 'uniq()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
    ];

    // verify results
    expect(expectedFound_2).toEqual(
      (
        await index.getAutoComplete(
          filepath,
          await readFile(filepath, 'utf-8'),
          position_2
        )
      ).slice(0, 50)
    );
  });

  it(`[auto generated] auto-complete for structure names`, async () => {
    // create index
    const index = new IDLIndex(
      new LogManager({
        alert: () => {
          // do nothing
        },
      }),
      0
    );

    // specify filepath
    const filepath = GetExtensionPath('idl/test/auto-complete/structures.pro');

    // add file to index
    await index.indexFile(filepath);

    // define position
    const position_0: Position = { line: 13, character: 11 };

    // define expected token we extract
    const expectedFound_0: CompletionItem[] = [
      { label: '!x', kind: 7, sortText: '00', detail: 'Structure' },
      { label: '!y', kind: 7, sortText: '00', detail: 'Structure' },
      { label: '!z', kind: 7, sortText: '00', detail: 'Structure' },
      {
        label: 'ENVIInitializeENVINet5MultiModelTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIBuildLabelRasterFromClassificationTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIClassActivationToPixelROITask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIRandomizeTrainTensorFlowMaskModelTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIBoundingBoxSet',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIBuildDeepLearningRasterTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIBuildLabelRasterFromROITask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIBuildObjectDetectionRasterFromAnnotationTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIBuildObjectDetectionRasterFromROITask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIBuildObjectDetectionRasterFromVectorTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIClassActivationToClassificationTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIClassActivationToPolygonROITask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIClassActivationToPolygonShapefileTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIClassActivationToPolylineShapefileTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIDeepLearningLabelRaster',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIDeepLearningObjectDetectionRaster',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVITensorFlowMaskClassificationTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIDeepLearningRaster',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIExtractDeepLearningLabelRasterFromFileTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIExtractDeepLearningRasterFromFileTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIExtractTensorFlowModelFromFileTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVITrainTensorFlowObjectModelTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIPostProcessObjectClassificationTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVITensorFlowModel',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVITensorFlowObjectClassificationTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVITensorFlowObjectModel',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVITrainTensorFlowMaskModelTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIQuerySpectralLibraryTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIStretchParameters',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIDiceRasterByVectorTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      { label: 'ENVITask', kind: 7, sortText: '00', detail: 'Structure' },
      {
        label: 'ENVILinearSpectralUnmixingTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIDirectionalKernelTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIVectorRecordsToBoundingBoxTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIMaximumLikelihoodClassificationTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIPercentThresholdClassificationTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVICalibrateRaster',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIVectorRecordsToROITask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIFireFuelClassificationTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVInnDiffusePanSharpeningRaster',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIPointCloudMetadata',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVICreateSubrectsFromTileCountTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVInnDiffusePanSharpeningTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIImageIntersectionTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIBinaryGtThresholdRaster',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIRadarBackscatterRaster',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIAutoChangeThresholdClassificationTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
    ];

    // verify results
    expect(expectedFound_0).toEqual(
      (
        await index.getAutoComplete(
          filepath,
          await readFile(filepath, 'utf-8'),
          position_0
        )
      ).slice(0, 50)
    );
    // define position
    const position_1: Position = { line: 14, character: 14 };

    // define expected token we extract
    const expectedFound_1: CompletionItem[] = [
      { label: '!x', kind: 7, sortText: '00', detail: 'Structure' },
      { label: '!y', kind: 7, sortText: '00', detail: 'Structure' },
      { label: '!z', kind: 7, sortText: '00', detail: 'Structure' },
      {
        label: 'ENVIInitializeENVINet5MultiModelTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIBuildLabelRasterFromClassificationTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIClassActivationToPixelROITask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIRandomizeTrainTensorFlowMaskModelTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIBoundingBoxSet',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIBuildDeepLearningRasterTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIBuildLabelRasterFromROITask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIBuildObjectDetectionRasterFromAnnotationTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIBuildObjectDetectionRasterFromROITask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIBuildObjectDetectionRasterFromVectorTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIClassActivationToClassificationTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIClassActivationToPolygonROITask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIClassActivationToPolygonShapefileTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIClassActivationToPolylineShapefileTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIDeepLearningLabelRaster',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIDeepLearningObjectDetectionRaster',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVITensorFlowMaskClassificationTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIDeepLearningRaster',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIExtractDeepLearningLabelRasterFromFileTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIExtractDeepLearningRasterFromFileTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIExtractTensorFlowModelFromFileTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVITrainTensorFlowObjectModelTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIPostProcessObjectClassificationTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVITensorFlowModel',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVITensorFlowObjectClassificationTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVITensorFlowObjectModel',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVITrainTensorFlowMaskModelTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIQuerySpectralLibraryTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIStretchParameters',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIDiceRasterByVectorTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      { label: 'ENVITask', kind: 7, sortText: '00', detail: 'Structure' },
      {
        label: 'ENVILinearSpectralUnmixingTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIDirectionalKernelTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIVectorRecordsToBoundingBoxTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIMaximumLikelihoodClassificationTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIPercentThresholdClassificationTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVICalibrateRaster',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIVectorRecordsToROITask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIFireFuelClassificationTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVInnDiffusePanSharpeningRaster',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIPointCloudMetadata',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVICreateSubrectsFromTileCountTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVInnDiffusePanSharpeningTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIImageIntersectionTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIBinaryGtThresholdRaster',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIRadarBackscatterRaster',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
      {
        label: 'ENVIAutoChangeThresholdClassificationTask',
        kind: 7,
        sortText: '00',
        detail: 'Structure',
      },
    ];

    // verify results
    expect(expectedFound_1).toEqual(
      (
        await index.getAutoComplete(
          filepath,
          await readFile(filepath, 'utf-8'),
          position_1
        )
      ).slice(0, 50)
    );
  });
});
