import {
  DEFAULT_ASSEMBLER_OPTIONS,
  FormatterType,
  IAssemblerInputOptions,
  IAssemblerOptions,
} from '@idl/assembling/config';
import { IDL_LSP_LOG } from '@idl/logger';

import { IDL_INDEX } from '../events/initialize-document-manager';
import { IDL_LANGUAGE_SERVER_LOGGER } from '../initialize-server';
import { IDL_CLIENT_CONFIG } from './track-workspace-config';

/**
 * Resolves the formatting configuration for a file which
 * checks the parent workspace and applies defaults
 */
export function GetFormattingConfigForFile(
  fsPath: string,
  formatting?: Partial<IAssemblerInputOptions<FormatterType>>
) {
  /**
   * Make default formatting config for info.fsPath
   *
   * Use settings from VSCode client as our default
   */
  const clientConfig: IAssemblerOptions<FormatterType> = {
    ...DEFAULT_ASSEMBLER_OPTIONS,
    ...IDL_CLIENT_CONFIG.code.formatting,
    style: IDL_CLIENT_CONFIG.code.formattingStyle,
  };

  /**
   * Check if we have custom formatting that needs to be applied
   */
  if (formatting) {
    Object.assign(clientConfig, formatting);
  }

  // log information
  IDL_LANGUAGE_SERVER_LOGGER.log({
    log: IDL_LSP_LOG,
    type: 'debug',
    content: ['Starting config', clientConfig],
  });

  /** Formatting config for info.fsPath */
  const config = IDL_INDEX.getConfigForFile(fsPath, clientConfig);

  // log information
  IDL_LANGUAGE_SERVER_LOGGER.log({
    log: IDL_LSP_LOG,
    type: 'debug',
    content: ['Resolved config', config],
  });

  return config;
}
