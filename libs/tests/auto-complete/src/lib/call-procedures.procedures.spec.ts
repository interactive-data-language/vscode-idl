import { GetExtensionPath } from '@idl/idl/files';
import { LogManager } from '@idl/logger';
import { IDL_INDEX_OPTIONS, IDLIndex } from '@idl/parsing/index';
import { readFile } from 'fs/promises';
import { CompletionItem, Position } from 'vscode-languageserver/node';

IDL_INDEX_OPTIONS.IS_TEST = true;

describe(`[auto generated] Add names of procedures that we can auto-complete`, () => {
  it(`[auto generated] for all cases`, async () => {
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
      'idl/test/auto-complete/call_procedure.pro'
    );

    // add file to index
    await index.indexFile(filepath);

    // define position
    const position_0: Position = { line: 3, character: 14 };

    // define expected token we extract
    const expectedFound_0: CompletionItem[] = [
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
        label: 'ENVITensorBoard',
        kind: 3,
        sortText: '40',
        detail: 'Procedure',
      },
      { label: 'openr', kind: 3, sortText: '40', detail: 'Procedure' },
      { label: 'openu', kind: 3, sortText: '40', detail: 'Procedure' },
      { label: 'openw', kind: 3, sortText: '40', detail: 'Procedure' },
      { label: 'print', kind: 3, sortText: '40', detail: 'Procedure' },
      { label: 'printf', kind: 3, sortText: '40', detail: 'Procedure' },
      { label: 'read', kind: 3, sortText: '40', detail: 'Procedure' },
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
    const position_1: Position = { line: 6, character: 17 };

    // define expected token we extract
    const expectedFound_1: CompletionItem[] = [
      {
        label: 'ENVITensorBoard',
        kind: 3,
        sortText: '40',
        detail: 'Procedure',
      },
      { label: 'openr', kind: 3, sortText: '40', detail: 'Procedure' },
      { label: 'openu', kind: 3, sortText: '40', detail: 'Procedure' },
      { label: 'openw', kind: 3, sortText: '40', detail: 'Procedure' },
      { label: 'print', kind: 3, sortText: '40', detail: 'Procedure' },
      { label: 'printf', kind: 3, sortText: '40', detail: 'Procedure' },
      { label: 'read', kind: 3, sortText: '40', detail: 'Procedure' },
      { label: 'readf', kind: 3, sortText: '40', detail: 'Procedure' },
      {
        label: 'ENVICalibrateRaster',
        kind: 3,
        sortText: '40',
        detail: 'Procedure',
      },
      {
        label: 'ENVIPointCloudMetadata',
        kind: 3,
        sortText: '40',
        detail: 'Procedure',
      },
      { label: 'class_doit', kind: 3, sortText: '40', detail: 'Procedure' },
      {
        label: 'ENVIFirstOrderEntropyTextureRaster',
        kind: 3,
        sortText: '40',
        detail: 'Procedure',
      },
      {
        label: 'ENVILabelEntropyTextureRaster',
        kind: 3,
        sortText: '40',
        detail: 'Procedure',
      },
      {
        label: 'ENVIRankStrengthTextureRaster',
        kind: 3,
        sortText: '40',
        detail: 'Procedure',
      },
      {
        label: 'ENVILayerStackRaster',
        kind: 3,
        sortText: '40',
        detail: 'Procedure',
      },
      {
        label: 'ENVIRGBToHSIRaster',
        kind: 3,
        sortText: '40',
        detail: 'Procedure',
      },
      { label: 'ENVITime', kind: 3, sortText: '40', detail: 'Procedure' },
      {
        label: 'cw_light_editor_set',
        kind: 3,
        sortText: '40',
        detail: 'Procedure',
      },
      { label: 'ireset', kind: 3, sortText: '40', detail: 'Procedure' },
      { label: 'cdf_attinq', kind: 3, sortText: '40', detail: 'Procedure' },
      { label: 'cdf_lib_info', kind: 3, sortText: '40', detail: 'Procedure' },
      {
        label: 'grib_index_select',
        kind: 3,
        sortText: '40',
        detail: 'Procedure',
      },
      { label: 'file_delete', kind: 3, sortText: '40', detail: 'Procedure' },
      { label: 'dlm_load', kind: 3, sortText: '40', detail: 'Procedure' },
      {
        label: 'grib_keys_iterator_rewind',
        kind: 3,
        sortText: '40',
        detail: 'Procedure',
      },
      { label: 'hls', kind: 3, sortText: '40', detail: 'Procedure' },
      { label: 'polar_contour', kind: 3, sortText: '40', detail: 'Procedure' },
      {
        label: 'h5g_set_comment',
        kind: 3,
        sortText: '40',
        detail: 'Procedure',
      },
      { label: 'cdf_varput', kind: 3, sortText: '40', detail: 'Procedure' },
      { label: 'hdf_an_end', kind: 3, sortText: '40', detail: 'Procedure' },
      { label: 'annotate', kind: 3, sortText: '40', detail: 'Procedure' },
      {
        label: 'hdf_sd_setcompress',
        kind: 3,
        sortText: '40',
        detail: 'Procedure',
      },
      { label: 'get_lun', kind: 3, sortText: '40', detail: 'Procedure' },
      { label: 'blas_axpy', kind: 3, sortText: '40', detail: 'Procedure' },
      { label: 'asdf_write', kind: 3, sortText: '40', detail: 'Procedure' },
      { label: 'imsl_sp_mvmul', kind: 3, sortText: '40', detail: 'Procedure' },
      { label: 'igetproperty', kind: 3, sortText: '40', detail: 'Procedure' },
      {
        label: 'i18n_multibytetoutf8',
        kind: 3,
        sortText: '40',
        detail: 'Procedure',
      },
      { label: 'iputdata', kind: 3, sortText: '40', detail: 'Procedure' },
      { label: 'hdf_vd_get', kind: 3, sortText: '40', detail: 'Procedure' },
      { label: 'file_copy', kind: 3, sortText: '40', detail: 'Procedure' },
      { label: 'hdf_sd_getinfo', kind: 3, sortText: '40', detail: 'Procedure' },
      { label: 'imap', kind: 3, sortText: '40', detail: 'Procedure' },
      {
        label: 'hdf_dfan_getlabel',
        kind: 3,
        sortText: '40',
        detail: 'Procedure',
      },
      {
        label: 'cw_palette_editor_set',
        kind: 3,
        sortText: '40',
        detail: 'Procedure',
      },
      { label: 'read_ppm', kind: 3, sortText: '40', detail: 'Procedure' },
      {
        label: 'h5t_enum_insert',
        kind: 3,
        sortText: '40',
        detail: 'Procedure',
      },
      { label: 'polyfill', kind: 3, sortText: '40', detail: 'Procedure' },
      { label: 'h_eq_ct', kind: 3, sortText: '40', detail: 'Procedure' },
      {
        label: 'cw_animate_getp',
        kind: 3,
        sortText: '40',
        detail: 'Procedure',
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
    const position_2: Position = { line: 9, character: 17 };

    // define expected token we extract
    const expectedFound_2: CompletionItem[] = [
      {
        label: 'ENVITensorBoard',
        kind: 3,
        sortText: '40',
        detail: 'Procedure',
      },
      { label: 'openr', kind: 3, sortText: '40', detail: 'Procedure' },
      { label: 'openu', kind: 3, sortText: '40', detail: 'Procedure' },
      { label: 'openw', kind: 3, sortText: '40', detail: 'Procedure' },
      { label: 'print', kind: 3, sortText: '40', detail: 'Procedure' },
      { label: 'printf', kind: 3, sortText: '40', detail: 'Procedure' },
      { label: 'read', kind: 3, sortText: '40', detail: 'Procedure' },
      { label: 'readf', kind: 3, sortText: '40', detail: 'Procedure' },
      {
        label: 'ENVICalibrateRaster',
        kind: 3,
        sortText: '40',
        detail: 'Procedure',
      },
      {
        label: 'ENVIPointCloudMetadata',
        kind: 3,
        sortText: '40',
        detail: 'Procedure',
      },
      { label: 'class_doit', kind: 3, sortText: '40', detail: 'Procedure' },
      {
        label: 'ENVIFirstOrderEntropyTextureRaster',
        kind: 3,
        sortText: '40',
        detail: 'Procedure',
      },
      {
        label: 'ENVILabelEntropyTextureRaster',
        kind: 3,
        sortText: '40',
        detail: 'Procedure',
      },
      {
        label: 'ENVIRankStrengthTextureRaster',
        kind: 3,
        sortText: '40',
        detail: 'Procedure',
      },
      {
        label: 'ENVILayerStackRaster',
        kind: 3,
        sortText: '40',
        detail: 'Procedure',
      },
      {
        label: 'ENVIRGBToHSIRaster',
        kind: 3,
        sortText: '40',
        detail: 'Procedure',
      },
      { label: 'ENVITime', kind: 3, sortText: '40', detail: 'Procedure' },
      {
        label: 'cw_light_editor_set',
        kind: 3,
        sortText: '40',
        detail: 'Procedure',
      },
      { label: 'ireset', kind: 3, sortText: '40', detail: 'Procedure' },
      { label: 'cdf_attinq', kind: 3, sortText: '40', detail: 'Procedure' },
      { label: 'cdf_lib_info', kind: 3, sortText: '40', detail: 'Procedure' },
      {
        label: 'grib_index_select',
        kind: 3,
        sortText: '40',
        detail: 'Procedure',
      },
      { label: 'file_delete', kind: 3, sortText: '40', detail: 'Procedure' },
      { label: 'dlm_load', kind: 3, sortText: '40', detail: 'Procedure' },
      {
        label: 'grib_keys_iterator_rewind',
        kind: 3,
        sortText: '40',
        detail: 'Procedure',
      },
      { label: 'hls', kind: 3, sortText: '40', detail: 'Procedure' },
      { label: 'polar_contour', kind: 3, sortText: '40', detail: 'Procedure' },
      {
        label: 'h5g_set_comment',
        kind: 3,
        sortText: '40',
        detail: 'Procedure',
      },
      { label: 'cdf_varput', kind: 3, sortText: '40', detail: 'Procedure' },
      { label: 'hdf_an_end', kind: 3, sortText: '40', detail: 'Procedure' },
      { label: 'annotate', kind: 3, sortText: '40', detail: 'Procedure' },
      {
        label: 'hdf_sd_setcompress',
        kind: 3,
        sortText: '40',
        detail: 'Procedure',
      },
      { label: 'get_lun', kind: 3, sortText: '40', detail: 'Procedure' },
      { label: 'blas_axpy', kind: 3, sortText: '40', detail: 'Procedure' },
      { label: 'asdf_write', kind: 3, sortText: '40', detail: 'Procedure' },
      { label: 'imsl_sp_mvmul', kind: 3, sortText: '40', detail: 'Procedure' },
      { label: 'igetproperty', kind: 3, sortText: '40', detail: 'Procedure' },
      {
        label: 'i18n_multibytetoutf8',
        kind: 3,
        sortText: '40',
        detail: 'Procedure',
      },
      { label: 'iputdata', kind: 3, sortText: '40', detail: 'Procedure' },
      { label: 'hdf_vd_get', kind: 3, sortText: '40', detail: 'Procedure' },
      { label: 'file_copy', kind: 3, sortText: '40', detail: 'Procedure' },
      { label: 'hdf_sd_getinfo', kind: 3, sortText: '40', detail: 'Procedure' },
      { label: 'imap', kind: 3, sortText: '40', detail: 'Procedure' },
      {
        label: 'hdf_dfan_getlabel',
        kind: 3,
        sortText: '40',
        detail: 'Procedure',
      },
      {
        label: 'cw_palette_editor_set',
        kind: 3,
        sortText: '40',
        detail: 'Procedure',
      },
      { label: 'read_ppm', kind: 3, sortText: '40', detail: 'Procedure' },
      {
        label: 'h5t_enum_insert',
        kind: 3,
        sortText: '40',
        detail: 'Procedure',
      },
      { label: 'polyfill', kind: 3, sortText: '40', detail: 'Procedure' },
      { label: 'h_eq_ct', kind: 3, sortText: '40', detail: 'Procedure' },
      {
        label: 'cw_animate_getp',
        kind: 3,
        sortText: '40',
        detail: 'Procedure',
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
    const position_3: Position = { line: 12, character: 17 };

    // define expected token we extract
    const expectedFound_3: CompletionItem[] = [
      {
        label: 'ENVITensorBoard',
        kind: 3,
        sortText: '40',
        detail: 'Procedure',
      },
      { label: 'openr', kind: 3, sortText: '40', detail: 'Procedure' },
      { label: 'openu', kind: 3, sortText: '40', detail: 'Procedure' },
      { label: 'openw', kind: 3, sortText: '40', detail: 'Procedure' },
      { label: 'print', kind: 3, sortText: '40', detail: 'Procedure' },
      { label: 'printf', kind: 3, sortText: '40', detail: 'Procedure' },
      { label: 'read', kind: 3, sortText: '40', detail: 'Procedure' },
      { label: 'readf', kind: 3, sortText: '40', detail: 'Procedure' },
      {
        label: 'ENVICalibrateRaster',
        kind: 3,
        sortText: '40',
        detail: 'Procedure',
      },
      {
        label: 'ENVIPointCloudMetadata',
        kind: 3,
        sortText: '40',
        detail: 'Procedure',
      },
      { label: 'class_doit', kind: 3, sortText: '40', detail: 'Procedure' },
      {
        label: 'ENVIFirstOrderEntropyTextureRaster',
        kind: 3,
        sortText: '40',
        detail: 'Procedure',
      },
      {
        label: 'ENVILabelEntropyTextureRaster',
        kind: 3,
        sortText: '40',
        detail: 'Procedure',
      },
      {
        label: 'ENVIRankStrengthTextureRaster',
        kind: 3,
        sortText: '40',
        detail: 'Procedure',
      },
      {
        label: 'ENVILayerStackRaster',
        kind: 3,
        sortText: '40',
        detail: 'Procedure',
      },
      {
        label: 'ENVIRGBToHSIRaster',
        kind: 3,
        sortText: '40',
        detail: 'Procedure',
      },
      { label: 'ENVITime', kind: 3, sortText: '40', detail: 'Procedure' },
      {
        label: 'cw_light_editor_set',
        kind: 3,
        sortText: '40',
        detail: 'Procedure',
      },
      { label: 'ireset', kind: 3, sortText: '40', detail: 'Procedure' },
      { label: 'cdf_attinq', kind: 3, sortText: '40', detail: 'Procedure' },
      { label: 'cdf_lib_info', kind: 3, sortText: '40', detail: 'Procedure' },
      {
        label: 'grib_index_select',
        kind: 3,
        sortText: '40',
        detail: 'Procedure',
      },
      { label: 'file_delete', kind: 3, sortText: '40', detail: 'Procedure' },
      { label: 'dlm_load', kind: 3, sortText: '40', detail: 'Procedure' },
      {
        label: 'grib_keys_iterator_rewind',
        kind: 3,
        sortText: '40',
        detail: 'Procedure',
      },
      { label: 'hls', kind: 3, sortText: '40', detail: 'Procedure' },
      { label: 'polar_contour', kind: 3, sortText: '40', detail: 'Procedure' },
      {
        label: 'h5g_set_comment',
        kind: 3,
        sortText: '40',
        detail: 'Procedure',
      },
      { label: 'cdf_varput', kind: 3, sortText: '40', detail: 'Procedure' },
      { label: 'hdf_an_end', kind: 3, sortText: '40', detail: 'Procedure' },
      { label: 'annotate', kind: 3, sortText: '40', detail: 'Procedure' },
      {
        label: 'hdf_sd_setcompress',
        kind: 3,
        sortText: '40',
        detail: 'Procedure',
      },
      { label: 'get_lun', kind: 3, sortText: '40', detail: 'Procedure' },
      { label: 'blas_axpy', kind: 3, sortText: '40', detail: 'Procedure' },
      { label: 'asdf_write', kind: 3, sortText: '40', detail: 'Procedure' },
      { label: 'imsl_sp_mvmul', kind: 3, sortText: '40', detail: 'Procedure' },
      { label: 'igetproperty', kind: 3, sortText: '40', detail: 'Procedure' },
      {
        label: 'i18n_multibytetoutf8',
        kind: 3,
        sortText: '40',
        detail: 'Procedure',
      },
      { label: 'iputdata', kind: 3, sortText: '40', detail: 'Procedure' },
      { label: 'hdf_vd_get', kind: 3, sortText: '40', detail: 'Procedure' },
      { label: 'file_copy', kind: 3, sortText: '40', detail: 'Procedure' },
      { label: 'hdf_sd_getinfo', kind: 3, sortText: '40', detail: 'Procedure' },
      { label: 'imap', kind: 3, sortText: '40', detail: 'Procedure' },
      {
        label: 'hdf_dfan_getlabel',
        kind: 3,
        sortText: '40',
        detail: 'Procedure',
      },
      {
        label: 'cw_palette_editor_set',
        kind: 3,
        sortText: '40',
        detail: 'Procedure',
      },
      { label: 'read_ppm', kind: 3, sortText: '40', detail: 'Procedure' },
      {
        label: 'h5t_enum_insert',
        kind: 3,
        sortText: '40',
        detail: 'Procedure',
      },
      { label: 'polyfill', kind: 3, sortText: '40', detail: 'Procedure' },
      { label: 'h_eq_ct', kind: 3, sortText: '40', detail: 'Procedure' },
      {
        label: 'cw_animate_getp',
        kind: 3,
        sortText: '40',
        detail: 'Procedure',
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
  });
});
