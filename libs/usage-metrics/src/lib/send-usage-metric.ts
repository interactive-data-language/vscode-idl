import { IDL_TRANSLATION } from '@idl/translation';

import { UsageMetricPayload } from './events/usage-metric-payload.interface';
import { UsageMetric } from './events/usage-metrics.interface';
import { GA4 } from './initialize-usage-metrics';

/**
 * Track if this is our first message or not
 */
let FIRST_MESSAGE = true;

/**
 * Logs detail about our metric
 */
let LOGGER: (ev: string, payload: any) => void = (ev, payload) => {
  console.log(
    `${IDL_TRANSLATION.usageMetrics.sendingUsageMetric} "${ev}" with information:`,
    payload
  );
};

/**
 * Usage metric logger
 */
export function SetUsageMetricLogger(cb: (ev: string, payload: any) => void) {
  LOGGER = cb;
}

/**
 * Wrapper to send a usage metric
 *
 * THIS DOES NOTHING UNLESS USAGE METRICS ARE ENABLED AND HAVE BEEN INITIALIZED
 */
export function SendUsageMetric<T extends UsageMetric>(
  event: T,
  payload: UsageMetricPayload<T>
) {
  /**
   * Do nothing if we don't have an analytics interface which means
   * that we have not initialized
   */
  if (GA4 === undefined) {
    return;
  }

  // log and alert user
  LOGGER(event, payload);

  try {
    /**
     * Check if we have a first load and should indicate that our session has started
     */
    if (FIRST_MESSAGE) {
      FIRST_MESSAGE = false;
      GA4.sendEvent(event, Object.assign({ is_session_start: true }, payload));
    } else {
      GA4.sendEvent(event, payload);
    }
  } catch (err) {
    // silently ignore errors
  }
}
