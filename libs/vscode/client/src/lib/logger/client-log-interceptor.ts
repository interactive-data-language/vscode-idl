import {
  IDL_LOG,
  LOGGING_CONFIG,
  LogInterceptor,
  StringifyData,
  StringifyDataForLog,
} from '@idl/logger';

import { IDL_CLIENT_OUTPUT_CHANNEL } from '../initialize-client';

/**
 * Interceptor to nicely handle output to our output channel.
 *
 * Only used when we are not developing the extension
 */
export const CLIENT_LOG_INTERCEPTOR: LogInterceptor = (options) => {
  const data = Array.isArray(options.content)
    ? options.content
    : [options.content];
  for (let i = 0; i < data.length; i++) {
    if (i === 0) {
      IDL_CLIENT_OUTPUT_CHANNEL.appendLine(
        StringifyDataForLog(
          `${options.log || IDL_LOG} ${options.type || 'info'}`,
          data[i],
          false,
          false
        )
      );
    } else {
      IDL_CLIENT_OUTPUT_CHANNEL.appendLine(
        LOGGING_CONFIG.INDENT + StringifyData(data[i], false)
      );
    }
  }
};
