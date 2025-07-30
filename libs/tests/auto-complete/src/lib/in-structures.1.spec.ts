import { GetExtensionPath } from '@idl/idl/files';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { readFile } from 'fs/promises';
import { CompletionItem, Position } from 'vscode-languageserver/node';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Verify auto-complete in structures`, () => {
  it(`[auto generated] for properties, property completion, and normal property completion`, async () => {
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
    const filepath = GetExtensionPath(
      'idl/test/auto-complete/in_structures.pro'
    );

    // add file to index
    await index.indexFile(filepath);

    // define position
    const position_0: Position = { line: 17, character: 15 };

    // define expected token we extract
    const expectedFound_0: CompletionItem[] = [
      {
        label: 'prop1',
        insertText: 'prop1:',
        kind: 5,
        sortText: '30',
        detail: 'Property of NYStruct',
        documentation: {
          kind: 'markdown',
          value: 'Placeholder docs for argument, keyword, or property',
        },
      },
      {
        label: 'prop2',
        insertText: 'prop2:',
        kind: 5,
        sortText: '30',
        detail: 'Property of NYStruct',
        documentation: {
          kind: 'markdown',
          value: 'Placeholder docs for argument, keyword, or property',
        },
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
    const position_1: Position = { line: 19, character: 22 };

    // define expected token we extract
    const expectedFound_1: CompletionItem[] = [
      {
        label: 'a',
        kind: 6,
        sortText: '20',
        detail: 'Variable',
        documentation: '',
      },
      {
        label: 'b',
        kind: 6,
        sortText: '20',
        detail: 'Variable',
        documentation: '',
      },
      {
        label: 'something',
        kind: 6,
        sortText: '20',
        detail: 'Variable',
        documentation: '',
      },
      {
        label: 'byte1',
        kind: 6,
        sortText: '20',
        detail: 'Variable',
        documentation: '',
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
      { label: '!theme', kind: 21, sortText: '90', detail: 'System Variable' },
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
        sortText: '40',
        detail: 'Function',
      },
      {
        label: "ENVITask('BuildLabelRasterFromClassification')",
        insertText: "ENVITask('BuildLabelRasterFromClassification')",
        kind: 3,
        sortText: '40',
        detail: 'Function',
      },
      {
        label: "ENVITask('ClassActivationToPixelROI')",
        insertText: "ENVITask('ClassActivationToPixelROI')",
        kind: 3,
        sortText: '40',
        detail: 'Function',
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
    const position_2: Position = { line: 21, character: 47 };

    // define expected token we extract
    const expectedFound_2: CompletionItem[] = [
      {
        label: 'Axis::convertCoord()',
        insertText: 'convertCoord()',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'Axis::copyWindow()',
        insertText: 'copyWindow()',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'Barplot::convertCoord()',
        insertText: 'convertCoord()',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'Barplot::copyWindow()',
        insertText: 'copyWindow()',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'Barplot::getValueAtLocation()',
        insertText: 'getValueAtLocation()',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'Barplot::mapForward()',
        insertText: 'mapForward()',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'Barplot::mapInverse()',
        insertText: 'mapInverse()',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'BigInteger::bitLength()',
        insertText: 'bitLength()',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'BigInteger::factorial()',
        insertText: 'factorial()',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'BigInteger::gCD()',
        insertText: 'gCd()',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'BigInteger::getPrimes()',
        insertText: 'getPrimes()',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'BigInteger::getProperty()',
        insertText: 'getProperty()',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'BigInteger::hashcode()',
        insertText: 'hashcode()',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'BigInteger::isPowerOfTwo()',
        insertText: 'isPowerOfTwo()',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'BigInteger::isPrime()',
        insertText: 'isPrime()',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'BigInteger::lCM()',
        insertText: 'lCm()',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'BigInteger::log10()',
        insertText: 'log10()',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'BigInteger::log2()',
        insertText: 'log2()',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'BigInteger::modInverse()',
        insertText: 'modInverse()',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'BigInteger::modPower()',
        insertText: 'modPower()',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'BigInteger::nextPrime()',
        insertText: 'nextPrime()',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'BigInteger::prime()',
        insertText: 'prime()',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'BigInteger::primorial()',
        insertText: 'primorial()',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'BigInteger::random()',
        insertText: 'random()',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'BigInteger::signum()',
        insertText: 'signum()',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'BigInteger::sqrt()',
        insertText: 'sqrt()',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'BigInteger::toDouble()',
        insertText: 'toDouble()',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'BigInteger::toInteger()',
        insertText: 'toInteger()',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'BigInteger::toString()',
        insertText: 'toString()',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'Boxplot::convertCoord()',
        insertText: 'convertCoord()',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'Boxplot::copyWindow()',
        insertText: 'copyWindow()',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'Boxplot::getValueAtLocation()',
        insertText: 'getValueAtLocation()',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'Boxplot::mapForward()',
        insertText: 'mapForward()',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'Boxplot::mapInverse()',
        insertText: 'mapInverse()',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'Bubbleplot::convertCoord()',
        insertText: 'convertCoord()',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'Bubbleplot::copyWindow()',
        insertText: 'copyWindow()',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'Bubbleplot::getValueAtLocation()',
        insertText: 'getValueAtLocation()',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'Bubbleplot::mapForward()',
        insertText: 'mapForward()',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'Bubbleplot::mapInverse()',
        insertText: 'mapInverse()',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'Clipboard::get()',
        insertText: 'get()',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'Colorbar::convertCoord()',
        insertText: 'convertCoord()',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'Colorbar::copyWindow()',
        insertText: 'copyWindow()',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'Contour::convertCoord()',
        insertText: 'convertCoord()',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'Contour::copyWindow()',
        insertText: 'copyWindow()',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'Contour::getValueAtLocation()',
        insertText: 'getValueAtLocation()',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'Contour::mapForward()',
        insertText: 'mapForward()',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'Contour::mapInverse()',
        insertText: 'mapInverse()',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'E3De::createLidarFromSubrect()',
        insertText: 'createLidarFromSubrect()',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'E3De::getOpenData()',
        insertText: 'getOpenData()',
        kind: 2,
        sortText: '40',
        detail: 'Function Method',
        command: { title: 'Cursor Adjust', command: 'cursorLeft' },
      },
      {
        label: 'E3De::getProductionParameters()',
        insertText: 'getProductionParameters()',
        kind: 2,
        sortText: '40',
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
    // define position
    const position_3: Position = { line: 24, character: 27 };

    // define expected token we extract
    const expectedFound_3: CompletionItem[] = [
      { label: '!x', kind: 7, sortText: '10', detail: 'Structure' },
      { label: '!y', kind: 7, sortText: '10', detail: 'Structure' },
      { label: '!z', kind: 7, sortText: '10', detail: 'Structure' },
      {
        label: 'ENVIInitializeENVINet5MultiModelTask',
        kind: 7,
        sortText: '10',
        detail: 'Structure',
      },
      {
        label: 'ENVIBuildLabelRasterFromClassificationTask',
        kind: 7,
        sortText: '10',
        detail: 'Structure',
      },
      {
        label: 'ENVIClassActivationToPixelROITask',
        kind: 7,
        sortText: '10',
        detail: 'Structure',
      },
      {
        label: 'ENVIRandomizeTrainTensorFlowMaskModelTask',
        kind: 7,
        sortText: '10',
        detail: 'Structure',
      },
      {
        label: 'ENVIBoundingBoxSet',
        kind: 7,
        sortText: '10',
        detail: 'Structure',
      },
      {
        label: 'ENVITensorFlowGridModel',
        kind: 7,
        sortText: '10',
        detail: 'Structure',
      },
      {
        label: 'ENVITensorFlowModel',
        kind: 7,
        sortText: '10',
        detail: 'Structure',
      },
      {
        label: 'ENVIBuildDeepLearningRasterTask',
        kind: 7,
        sortText: '10',
        detail: 'Structure',
      },
      {
        label: 'ENVIBuildLabelRasterFromROITask',
        kind: 7,
        sortText: '10',
        detail: 'Structure',
      },
      {
        label: 'ENVIBuildObjectDetectionRasterFromAnnotationTask',
        kind: 7,
        sortText: '10',
        detail: 'Structure',
      },
      {
        label: 'ENVIInitializeENVINet5ModelTask',
        kind: 7,
        sortText: '10',
        detail: 'Structure',
      },
      {
        label: 'ENVIBuildObjectDetectionRasterFromROITask',
        kind: 7,
        sortText: '10',
        detail: 'Structure',
      },
      {
        label: 'ENVIBuildObjectDetectionRasterFromVectorTask',
        kind: 7,
        sortText: '10',
        detail: 'Structure',
      },
      {
        label: 'ENVIClassActivationToClassificationTask',
        kind: 7,
        sortText: '10',
        detail: 'Structure',
      },
      {
        label: 'ExtractDeepLearningObjectModelFromFile',
        kind: 7,
        sortText: '10',
        detail: 'Structure',
      },
      {
        label: 'ENVITensorFlowPixelClassificationTask',
        kind: 7,
        sortText: '10',
        detail: 'Structure',
      },
      {
        label: 'ExtractDeepLearningGridModelFromFile',
        kind: 7,
        sortText: '10',
        detail: 'Structure',
      },
      {
        label: 'ENVIClassActivationToPolygonROITask',
        kind: 7,
        sortText: '10',
        detail: 'Structure',
      },
      {
        label: 'ENVITensorFlowOptimizedObjectClassificationTask',
        kind: 7,
        sortText: '10',
        detail: 'Structure',
      },
      {
        label: 'ENVISubsetLabelRasterTask',
        kind: 7,
        sortText: '10',
        detail: 'Structure',
      },
      {
        label: 'ENVIClassActivationToPolygonShapefileTask',
        kind: 7,
        sortText: '10',
        detail: 'Structure',
      },
      {
        label: 'ENVIClassActivationToPolylineShapefileTask',
        kind: 7,
        sortText: '10',
        detail: 'Structure',
      },
      {
        label: 'ENVIDeepLearningLabelRaster',
        kind: 7,
        sortText: '10',
        detail: 'Structure',
      },
      {
        label: 'ENVIDeepLearningObjectDetectionRaster',
        kind: 7,
        sortText: '10',
        detail: 'Structure',
      },
      {
        label: 'ENVITensorFlowMaskClassificationTask',
        kind: 7,
        sortText: '10',
        detail: 'Structure',
      },
      {
        label: 'ENVIDeepLearningRaster',
        kind: 7,
        sortText: '10',
        detail: 'Structure',
      },
      {
        label: 'ENVIExtractDeepLearningLabelRasterFromFileTask',
        kind: 7,
        sortText: '10',
        detail: 'Structure',
      },
      {
        label: 'ENVITrainTensorFlowGridModelTask',
        kind: 7,
        sortText: '10',
        detail: 'Structure',
      },
      {
        label: 'ENVIExtractDeepLearningRasterFromFileTask',
        kind: 7,
        sortText: '10',
        detail: 'Structure',
      },
      {
        label: 'ENVIExtractTensorFlowModelFromFileTask',
        kind: 7,
        sortText: '10',
        detail: 'Structure',
      },
      {
        label: 'ENVIPostProcessObjectClassificationTask',
        kind: 7,
        sortText: '10',
        detail: 'Structure',
      },
      {
        label: 'ENVITensorFlowGridClassificationTask',
        kind: 7,
        sortText: '10',
        detail: 'Structure',
      },
      {
        label: 'ENVIRandomizeTrainTensorFlowPixelModelTask',
        kind: 7,
        sortText: '10',
        detail: 'Structure',
      },
      {
        label: 'ENVITensorFlowObjectClassificationTask',
        kind: 7,
        sortText: '10',
        detail: 'Structure',
      },
      {
        label: 'ENVITensorFlowObjectModel',
        kind: 7,
        sortText: '10',
        detail: 'Structure',
      },
      {
        label: 'ENVITensorFlowOptimizedPixelClassificationTask',
        kind: 7,
        sortText: '10',
        detail: 'Structure',
      },
      {
        label: 'ENVITrainTensorFlowMaskModelTask',
        kind: 7,
        sortText: '10',
        detail: 'Structure',
      },
      {
        label: 'ENVITrainTensorFlowObjectModelTask',
        kind: 7,
        sortText: '10',
        detail: 'Structure',
      },
      {
        label: 'ENVITrainTensorFlowPixelModelTask',
        kind: 7,
        sortText: '10',
        detail: 'Structure',
      },
      {
        label: 'ENVIStretchParameters',
        kind: 7,
        sortText: '10',
        detail: 'Structure',
      },
      {
        label: 'ENVIImageToImageRegistrationTask',
        kind: 7,
        sortText: '10',
        detail: 'Structure',
      },
      {
        label: 'ENVIDiceRasterByVectorTask',
        kind: 7,
        sortText: '10',
        detail: 'Structure',
      },
      {
        label: 'ENVITopographicBreaklinesTask',
        kind: 7,
        sortText: '10',
        detail: 'Structure',
      },
      {
        label: 'ENVIConvertGeographicToMapCoordinatesTask',
        kind: 7,
        sortText: '10',
        detail: 'Structure',
      },
      { label: 'ENVITask', kind: 7, sortText: '10', detail: 'Structure' },
      { label: 'ENVIAbortable', kind: 7, sortText: '10', detail: 'Structure' },
      {
        label: 'ENVILinearSpectralUnmixingTask',
        kind: 7,
        sortText: '10',
        detail: 'Structure',
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
    const position_4: Position = { line: 24, character: 28 };

    // define expected token we extract
    const expectedFound_4: CompletionItem[] = [
      { label: '!x', kind: 7, sortText: '10', detail: 'Structure' },
      { label: '!y', kind: 7, sortText: '10', detail: 'Structure' },
      { label: '!z', kind: 7, sortText: '10', detail: 'Structure' },
      {
        label: 'ENVIInitializeENVINet5MultiModelTask',
        kind: 7,
        sortText: '10',
        detail: 'Structure',
      },
      {
        label: 'ENVIBuildLabelRasterFromClassificationTask',
        kind: 7,
        sortText: '10',
        detail: 'Structure',
      },
      {
        label: 'ENVIClassActivationToPixelROITask',
        kind: 7,
        sortText: '10',
        detail: 'Structure',
      },
      {
        label: 'ENVIRandomizeTrainTensorFlowMaskModelTask',
        kind: 7,
        sortText: '10',
        detail: 'Structure',
      },
      {
        label: 'ENVIBoundingBoxSet',
        kind: 7,
        sortText: '10',
        detail: 'Structure',
      },
      {
        label: 'ENVITensorFlowGridModel',
        kind: 7,
        sortText: '10',
        detail: 'Structure',
      },
      {
        label: 'ENVITensorFlowModel',
        kind: 7,
        sortText: '10',
        detail: 'Structure',
      },
      {
        label: 'ENVIBuildDeepLearningRasterTask',
        kind: 7,
        sortText: '10',
        detail: 'Structure',
      },
      {
        label: 'ENVIBuildLabelRasterFromROITask',
        kind: 7,
        sortText: '10',
        detail: 'Structure',
      },
      {
        label: 'ENVIBuildObjectDetectionRasterFromAnnotationTask',
        kind: 7,
        sortText: '10',
        detail: 'Structure',
      },
      {
        label: 'ENVIInitializeENVINet5ModelTask',
        kind: 7,
        sortText: '10',
        detail: 'Structure',
      },
      {
        label: 'ENVIBuildObjectDetectionRasterFromROITask',
        kind: 7,
        sortText: '10',
        detail: 'Structure',
      },
      {
        label: 'ENVIBuildObjectDetectionRasterFromVectorTask',
        kind: 7,
        sortText: '10',
        detail: 'Structure',
      },
      {
        label: 'ENVIClassActivationToClassificationTask',
        kind: 7,
        sortText: '10',
        detail: 'Structure',
      },
      {
        label: 'ExtractDeepLearningObjectModelFromFile',
        kind: 7,
        sortText: '10',
        detail: 'Structure',
      },
      {
        label: 'ENVITensorFlowPixelClassificationTask',
        kind: 7,
        sortText: '10',
        detail: 'Structure',
      },
      {
        label: 'ExtractDeepLearningGridModelFromFile',
        kind: 7,
        sortText: '10',
        detail: 'Structure',
      },
      {
        label: 'ENVIClassActivationToPolygonROITask',
        kind: 7,
        sortText: '10',
        detail: 'Structure',
      },
      {
        label: 'ENVITensorFlowOptimizedObjectClassificationTask',
        kind: 7,
        sortText: '10',
        detail: 'Structure',
      },
      {
        label: 'ENVISubsetLabelRasterTask',
        kind: 7,
        sortText: '10',
        detail: 'Structure',
      },
      {
        label: 'ENVIClassActivationToPolygonShapefileTask',
        kind: 7,
        sortText: '10',
        detail: 'Structure',
      },
      {
        label: 'ENVIClassActivationToPolylineShapefileTask',
        kind: 7,
        sortText: '10',
        detail: 'Structure',
      },
      {
        label: 'ENVIDeepLearningLabelRaster',
        kind: 7,
        sortText: '10',
        detail: 'Structure',
      },
      {
        label: 'ENVIDeepLearningObjectDetectionRaster',
        kind: 7,
        sortText: '10',
        detail: 'Structure',
      },
      {
        label: 'ENVITensorFlowMaskClassificationTask',
        kind: 7,
        sortText: '10',
        detail: 'Structure',
      },
      {
        label: 'ENVIDeepLearningRaster',
        kind: 7,
        sortText: '10',
        detail: 'Structure',
      },
      {
        label: 'ENVIExtractDeepLearningLabelRasterFromFileTask',
        kind: 7,
        sortText: '10',
        detail: 'Structure',
      },
      {
        label: 'ENVITrainTensorFlowGridModelTask',
        kind: 7,
        sortText: '10',
        detail: 'Structure',
      },
      {
        label: 'ENVIExtractDeepLearningRasterFromFileTask',
        kind: 7,
        sortText: '10',
        detail: 'Structure',
      },
      {
        label: 'ENVIExtractTensorFlowModelFromFileTask',
        kind: 7,
        sortText: '10',
        detail: 'Structure',
      },
      {
        label: 'ENVIPostProcessObjectClassificationTask',
        kind: 7,
        sortText: '10',
        detail: 'Structure',
      },
      {
        label: 'ENVITensorFlowGridClassificationTask',
        kind: 7,
        sortText: '10',
        detail: 'Structure',
      },
      {
        label: 'ENVIRandomizeTrainTensorFlowPixelModelTask',
        kind: 7,
        sortText: '10',
        detail: 'Structure',
      },
      {
        label: 'ENVITensorFlowObjectClassificationTask',
        kind: 7,
        sortText: '10',
        detail: 'Structure',
      },
      {
        label: 'ENVITensorFlowObjectModel',
        kind: 7,
        sortText: '10',
        detail: 'Structure',
      },
      {
        label: 'ENVITensorFlowOptimizedPixelClassificationTask',
        kind: 7,
        sortText: '10',
        detail: 'Structure',
      },
      {
        label: 'ENVITrainTensorFlowMaskModelTask',
        kind: 7,
        sortText: '10',
        detail: 'Structure',
      },
      {
        label: 'ENVITrainTensorFlowObjectModelTask',
        kind: 7,
        sortText: '10',
        detail: 'Structure',
      },
      {
        label: 'ENVITrainTensorFlowPixelModelTask',
        kind: 7,
        sortText: '10',
        detail: 'Structure',
      },
      {
        label: 'ENVIStretchParameters',
        kind: 7,
        sortText: '10',
        detail: 'Structure',
      },
      {
        label: 'ENVIImageToImageRegistrationTask',
        kind: 7,
        sortText: '10',
        detail: 'Structure',
      },
      {
        label: 'ENVIDiceRasterByVectorTask',
        kind: 7,
        sortText: '10',
        detail: 'Structure',
      },
      {
        label: 'ENVITopographicBreaklinesTask',
        kind: 7,
        sortText: '10',
        detail: 'Structure',
      },
      {
        label: 'ENVIConvertGeographicToMapCoordinatesTask',
        kind: 7,
        sortText: '10',
        detail: 'Structure',
      },
      { label: 'ENVITask', kind: 7, sortText: '10', detail: 'Structure' },
      { label: 'ENVIAbortable', kind: 7, sortText: '10', detail: 'Structure' },
      {
        label: 'ENVILinearSpectralUnmixingTask',
        kind: 7,
        sortText: '10',
        detail: 'Structure',
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
  });
});
