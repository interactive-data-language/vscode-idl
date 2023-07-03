import { GetExtensionPath, GetRuntimePath } from '@idl/shared';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

import { UsageMetric } from './events/usage-metrics.interface';
import { GA4Client } from './ga4/ga4-client.class';
import { MakeID } from './helpers/make-id';
import { MEASUREMENT } from './helpers/measurement.interface';

/**
 * Fully-qualified path for the device ID file (i.e. our app ID)
 */
const CLIENT_ID_URI = GetRuntimePath('dist/.client-id');

/**
 * Backup filepath in case we can't write to first location
 */
const CLIENT_ID_FALLBACK_URI = join(tmpdir(), '.vscode-idl-client-id');

/**
 * Track if we have saved content already or not
 *
 * Only save once a session
 */
let HAVE_SAVED = false;

/**
 * The ID of our installation
 */
export let CLIENT_ID: string;

/**
 * The ID of our current session
 */
export let SESSION_ID = 1;

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
 * Writes content to disk and increments session ID by 1 so that we
 * track the number of sessions
 */
function SaveInfo(uri: string) {
  // return if already saved
  if (HAVE_SAVED) {
    return;
  }

  /**
   * Serialize and save content to disk
   */
  writeFileSync(
    uri,
    Buffer.from(
      JSON.stringify({ id: CLIENT_ID, n: SESSION_ID }),
      'utf8'
    ).toString('base64')
  );

  // update flag
  HAVE_SAVED = true;
}

/**
 * Loads content from disk
 */
function LoadInfo(uri: string) {
  /**
   * Load and parse content from disk
   */
  const parsed = JSON.parse(
    Buffer.from(readFileSync(uri, 'utf-8'), 'base64').toString('utf8')
  );

  // restore parameters
  SESSION_ID = +parsed.n + 1;
  CLIENT_ID = parsed.id;
}

/**
 * Inits/creates the information we need to capture usage metrics
 *
 * Only does something if we are enabled and canReport
 */
export function InitializeUsageMetrics() {
  /**
   * Return if we are not allowed to report
   */
  if (!MEASUREMENT.ID || GA4 !== undefined) {
    return;
  }

  /**
   * Flag if we loaded our device/client ID from disk
   */
  let loaded = false;

  /**
   * Check if primary file exists
   */
  if (existsSync(CLIENT_ID_URI)) {
    try {
      LoadInfo(CLIENT_ID_URI);
      loaded = true;
    } catch (err) {
      console.log('Unable to load primary usage metric ID file', err);
      // do nothing
    }
  } else {
    /**
     * Check if secondary file exists
     */
    if (existsSync(CLIENT_ID_FALLBACK_URI)) {
      try {
        LoadInfo(CLIENT_ID_FALLBACK_URI);
        loaded = true;
      } catch (err) {
        console.log('Unable to load secondary usage metric ID file', err);
        // do nothing
      }
    }
  }

  /**
   * If we didn't load an ID for our client, save the one we create
   * on startup
   */
  if (!loaded) {
    CLIENT_ID = MakeID();
  }

  /**
   * Save details back to disk
   */
  try {
    SaveInfo(CLIENT_ID_URI);
  } catch (err1) {
    try {
      SaveInfo(CLIENT_ID_FALLBACK_URI);
    } catch (err2) {
      console.log(
        'Unable to create temporary ID for usage metric, returning',
        err1,
        err2
      );
      return;
    }
  }

  GA4 = new GA4Client([`G-${MEASUREMENT.ID}`], {
    /**
     * Client and session are the same because they represent the same
     * instance (i.e. "session") of VSCode
     *
     * That way we can track the total number of times the extension has launched
     */
    client_id: CLIENT_ID,
    session_id: CLIENT_ID,
    user_id: CLIENT_ID,
    session_number: SESSION_ID,
    non_personalized_ads: true,
    debug: DEBUG,
  });

  /**
   * Override the ID of the app
   */
  GA4.setEventsParameter('app_version', APP_VERSION);
}
