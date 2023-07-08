import axios, { AxiosError } from 'axios';

import { GA4_CONFIG, IGA4EventParameters } from '../ga4-client.interface';

/**
 * Helper function to send event to GA
 */
export async function SendRequest(
  url: string,
  payload: IGA4EventParameters
): Promise<void> {
  /**
   * Make query parameters for payload
   */
  const qs = new URLSearchParams(
    JSON.parse(JSON.stringify(payload))
  ).toString();

  // send data
  try {
    await axios.get([url, qs].join('?'), {
      headers: {
        'User-Agent': GA4_CONFIG.USER_AGENT,
      },
      timeout: GA4_CONFIG.TIMEOUT,
    });
  } catch (err) {
    // ignore if we have errors related to not finding URL (i.e. disconnected)
    if ((err as AxiosError).code === 'ENOTFOUND') {
      return;
    }
    console.log(err);
  }
}
