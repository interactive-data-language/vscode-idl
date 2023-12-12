import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { GetExtensionPath } from '@idl/shared';
import { readFile } from 'fs/promises';
import { CompletionItem, Position } from 'vscode-languageserver/node';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Methods`, () => {
  it(`[auto generated] inside the paren showing variables`, async () => {
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
    const filepath = GetExtensionPath('idl/test/auto-complete/methods.pro');

    // add file to index
    await index.indexFile(filepath);

    // define position
    const position_0: Position = { line: 12, character: 8 };

    // define expected token we extract
    const expectedFound_0: CompletionItem[] = [
      {
        label: 'myProp',
        insertText: 'myProp',
        kind: 5,
        sortText: '02',
        detail: 'Property of TestCompletion',
        documentation: {
          kind: 'markdown',
          value: 'Placeholder docs for argument, keyword, or property',
        },
      },
      {
        label: 'myProp2',
        insertText: 'myProp2',
        kind: 5,
        sortText: '02',
        detail: 'Property of TestCompletion',
        documentation: {
          kind: 'markdown',
          value: 'Placeholder docs for argument, keyword, or property',
        },
      },
      {
        label: 'TestCompletion::method',
        insertText: 'method',
        kind: 3,
        sortText: '03',
        detail: 'Procedure Method',
      },
      {
        label: 'TestCompletion::method()',
        insertText: 'method()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
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
    const position_1: Position = { line: 15, character: 8 };

    // define expected token we extract
    const expectedFound_1: CompletionItem[] = [
      {
        label: 'TestCompletion::method',
        insertText: 'method',
        kind: 3,
        sortText: '03',
        detail: 'Procedure Method',
      },
      {
        label: 'TestCompletion::method()',
        insertText: 'method()',
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
    const position_2: Position = { line: 18, character: 13 };

    // define expected token we extract
    const expectedFound_2: CompletionItem[] = [
      {
        label: 'TestCompletion::method()',
        insertText: 'method',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorRight' },
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
    // define position
    const position_3: Position = { line: 21, character: 8 };

    // define expected token we extract
    const expectedFound_3: CompletionItem[] = [
      {
        label: 'myProp',
        insertText: 'myProp',
        kind: 5,
        sortText: '02',
        detail: 'Property of TestCompletion',
        documentation: {
          kind: 'markdown',
          value: 'Placeholder docs for argument, keyword, or property',
        },
      },
      {
        label: 'myProp2',
        insertText: 'myProp2',
        kind: 5,
        sortText: '02',
        detail: 'Property of TestCompletion',
        documentation: {
          kind: 'markdown',
          value: 'Placeholder docs for argument, keyword, or property',
        },
      },
      {
        label: 'TestCompletion::method',
        insertText: 'method',
        kind: 3,
        sortText: '03',
        detail: 'Procedure Method',
      },
      {
        label: 'TestCompletion::method()',
        insertText: 'method()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
    ];

    // verify results
    expect(expectedFound_3).toEqual(
      (
        await index.getAutoComplete(
          filepath,
          await readFile(filepath, 'utf-8'),
          position_3
        )
      ).slice(0, 50)
    );
    // define position
    const position_4: Position = { line: 24, character: 13 };

    // define expected token we extract
    const expectedFound_4: CompletionItem[] = [
      {
        label: 'myProp',
        insertText: 'myProp',
        kind: 5,
        sortText: '02',
        detail: 'Property of TestCompletion',
        documentation: {
          kind: 'markdown',
          value: 'Placeholder docs for argument, keyword, or property',
        },
      },
      {
        label: 'myProp2',
        insertText: 'myProp2',
        kind: 5,
        sortText: '02',
        detail: 'Property of TestCompletion',
        documentation: {
          kind: 'markdown',
          value: 'Placeholder docs for argument, keyword, or property',
        },
      },
      {
        label: 'TestCompletion::method',
        insertText: 'method',
        kind: 3,
        sortText: '03',
        detail: 'Procedure Method',
      },
      {
        label: 'TestCompletion::method()',
        insertText: 'method()',
        kind: 2,
        sortText: '03',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
    ];

    // verify results
    expect(expectedFound_4).toEqual(
      (
        await index.getAutoComplete(
          filepath,
          await readFile(filepath, 'utf-8'),
          position_4
        )
      ).slice(0, 50)
    );
    // define position
    const position_5: Position = { line: 27, character: 14 };

    // define expected token we extract
    const expectedFound_5: CompletionItem[] = [
      {
        label: 'kew = ',
        insertText: 'kew = ',
        kind: 20,
        sortText: '00',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value: 'Placeholder docs for argument, keyword, or property',
        },
      },
      {
        label: 'kw1',
        kind: 6,
        sortText: '01',
        detail: 'Variable',
        documentation: {
          kind: 'markdown',
          value: 'Placeholder docs for argument, keyword, or property',
        },
      },
      {
        label: 'foo',
        kind: 6,
        sortText: '01',
        detail: 'Variable',
        documentation: '',
      },
      {
        label: 'self',
        kind: 6,
        sortText: '01',
        detail: 'Variable',
        documentation: {
          kind: 'markdown',
          value: 'A reference to our object class',
        },
      },
      { label: '!x', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!y', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!z', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!c', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!d', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!order', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!p', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!color', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!const', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!dpi', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!dtor', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!false', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!map', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!null', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!pi', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!radeg', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!true', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!values', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!err', kind: 21, sortText: '90', detail: 'System Variable' },
      {
        label: '!error_state',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      { label: '!error', kind: 21, sortText: '90', detail: 'System Variable' },
      {
        label: '!err_string',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      { label: '!except', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!mouse', kind: 21, sortText: '90', detail: 'System Variable' },
      {
        label: '!msg_prefix',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      {
        label: '!syserror',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      {
        label: '!syserr_string',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      { label: '!warn', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!cpu', kind: 21, sortText: '90', detail: 'System Variable' },
      {
        label: '!debug_process_events',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      { label: '!dir', kind: 21, sortText: '90', detail: 'System Variable' },
      {
        label: '!dlm_path',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      {
        label: '!edit_input',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      {
        label: '!help_path',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      {
        label: '!journal',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      {
        label: '!make_dll',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      { label: '!more', kind: 21, sortText: '90', detail: 'System Variable' },
      {
        label: '!package_path',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      { label: '!path', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!prompt', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!quiet', kind: 21, sortText: '90', detail: 'System Variable' },
      {
        label: '!version',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      {
        label: "ENVITask('InitializeENVINet5MultiModel')",
        insertText: "ENVITask('InitializeENVINet5MultiModel')",
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: "ENVITask('BuildLabelRasterFromClassification')",
        insertText: "ENVITask('BuildLabelRasterFromClassification')",
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: "ENVITask('ClassActivationToPixelROI')",
        insertText: "ENVITask('ClassActivationToPixelROI')",
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: "ENVITask('RandomizeTrainTensorFlowMaskModel')",
        insertText: "ENVITask('RandomizeTrainTensorFlowMaskModel')",
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
    ];

    // verify results
    expect(expectedFound_5).toEqual(
      (
        await index.getAutoComplete(
          filepath,
          await readFile(filepath, 'utf-8'),
          position_5
        )
      ).slice(0, 50)
    );
    // define position
    const position_6: Position = { line: 30, character: 14 };

    // define expected token we extract
    const expectedFound_6: CompletionItem[] = [
      {
        label: 'kew = ',
        insertText: 'kew = ',
        kind: 20,
        sortText: '00',
        detail: 'Keyword',
        documentation: {
          kind: 'markdown',
          value: 'Placeholder docs for argument, keyword, or property',
        },
      },
      {
        label: 'kw1',
        kind: 6,
        sortText: '01',
        detail: 'Variable',
        documentation: {
          kind: 'markdown',
          value: 'Placeholder docs for argument, keyword, or property',
        },
      },
      {
        label: 'foo',
        kind: 6,
        sortText: '01',
        detail: 'Variable',
        documentation: '',
      },
      {
        label: 'self',
        kind: 6,
        sortText: '01',
        detail: 'Variable',
        documentation: {
          kind: 'markdown',
          value: 'A reference to our object class',
        },
      },
      { label: '!x', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!y', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!z', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!c', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!d', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!order', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!p', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!color', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!const', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!dpi', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!dtor', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!false', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!map', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!null', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!pi', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!radeg', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!true', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!values', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!err', kind: 21, sortText: '90', detail: 'System Variable' },
      {
        label: '!error_state',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      { label: '!error', kind: 21, sortText: '90', detail: 'System Variable' },
      {
        label: '!err_string',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      { label: '!except', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!mouse', kind: 21, sortText: '90', detail: 'System Variable' },
      {
        label: '!msg_prefix',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      {
        label: '!syserror',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      {
        label: '!syserr_string',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      { label: '!warn', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!cpu', kind: 21, sortText: '90', detail: 'System Variable' },
      {
        label: '!debug_process_events',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      { label: '!dir', kind: 21, sortText: '90', detail: 'System Variable' },
      {
        label: '!dlm_path',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      {
        label: '!edit_input',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      {
        label: '!help_path',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      {
        label: '!journal',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      {
        label: '!make_dll',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      { label: '!more', kind: 21, sortText: '90', detail: 'System Variable' },
      {
        label: '!package_path',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      { label: '!path', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!prompt', kind: 21, sortText: '90', detail: 'System Variable' },
      { label: '!quiet', kind: 21, sortText: '90', detail: 'System Variable' },
      {
        label: '!version',
        kind: 21,
        sortText: '90',
        detail: 'System Variable',
      },
      {
        label: "ENVITask('InitializeENVINet5MultiModel')",
        insertText: "ENVITask('InitializeENVINet5MultiModel')",
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: "ENVITask('BuildLabelRasterFromClassification')",
        insertText: "ENVITask('BuildLabelRasterFromClassification')",
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: "ENVITask('ClassActivationToPixelROI')",
        insertText: "ENVITask('ClassActivationToPixelROI')",
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
      {
        label: "ENVITask('RandomizeTrainTensorFlowMaskModel')",
        insertText: "ENVITask('RandomizeTrainTensorFlowMaskModel')",
        kind: 3,
        sortText: '03',
        detail: 'Function',
      },
    ];

    // verify results
    expect(expectedFound_6).toEqual(
      (
        await index.getAutoComplete(
          filepath,
          await readFile(filepath, 'utf-8'),
          position_6
        )
      ).slice(0, 50)
    );
  });
});
