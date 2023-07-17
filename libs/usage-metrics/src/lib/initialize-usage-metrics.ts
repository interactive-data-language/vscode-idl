import { GetExtensionPath } from '@idl/shared';
import { readFileSync } from 'fs';

import { UsageMetric } from './events/usage-metrics.interface';
import { GA4Client } from './ga4/ga4-client.class';
import { GA4_CONFIG } from './ga4/ga4-client.interface';
import { MEASUREMENT } from './helpers/measurement.interface';

/**
 * ref to our google analytics helper
 */
export let GA4: GA4Client<UsageMetric> = undefined;

/**
 * Do we run in debug mode
 */
const DEBUG = false;

/**
 * Version of the app
 */
export const APP_VERSION = JSON.parse(
  readFileSync(GetExtensionPath('package.json'), 'utf-8')
).version;

/**
 * Inits/creates the information we need to capture usage metrics
 *
 * Only does something if we are enabled and canReport
 */
export function InitializeUsageMetrics() {
  /**
   * Return if we are not allowed to report
   */
  if (!MEASUREMENT.ID || GA4 !== undefined || !GA4_CONFIG.CLIENT_ID) {
    return;
  }

  // make client
  GA4 = new GA4Client([`G-${MEASUREMENT.ID}`], {
    /**
     * Client and session are the same because they represent the same
     * instance (i.e. "session") of VSCode
     *
     * That way we can track the total number of times the extension has launched
     */
    client_id: GA4_CONFIG.CLIENT_ID,
    session_id: GA4_CONFIG.SESSION_ID,
    user_id: GA4_CONFIG.CLIENT_ID,
    non_personalized_ads: true,
    debug: DEBUG,
  });

  /**
   * Override the ID of the app
   */
  GA4.setEventsParameter('app_version', APP_VERSION);
}
