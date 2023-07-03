import { UsageMetric, UsageMetricPayload } from '@idl/usage-metrics';
import { LANGUAGE_SERVER_MESSAGE_LOOKUP } from '@idl/vscode/events/messages';

import { SERVER_EVENT_MANAGER } from '../initialize-server';

/**
 * Send a message to the VSCode client that we have a usage metric to report
 *
 * The client does nothing with these messages unless users have opted-in
 *
 * IMPORTANT NOTE: This does not send any usage metrics directly. That happens in the
 * VSCode client for centralized logic
 */
export function SendUsageMetricServer<T extends UsageMetric>(
  event: T,
  payload: UsageMetricPayload<T>
) {
  SERVER_EVENT_MANAGER.sendNotification(
    LANGUAGE_SERVER_MESSAGE_LOOKUP.USAGE_METRIC,
    {
      event,
      payload,
    }
  );
}
