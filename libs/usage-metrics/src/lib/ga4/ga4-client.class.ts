import { SimplePromiseQueue, Sleep } from '@idl/shared';
import copy from 'fast-copy';

import {
  GA4_CONFIG,
  GA4DataType,
  IGA4EventParameters,
  IGA4Options,
  IGA4PayloadData,
} from './ga4-client.interface';
import { E_COMMERCE_EVENTS, GA4_EVENT_MAP } from './helpers/ga4-schema';
import { IsNumber, RandomInt, TimeStampInSeconds } from './helpers/helpers';
import { SendRequest } from './helpers/send-request';

/**
 * Google Analytics v4 client for node.js
 *
 * Use firebase for front-end applications.
 */
export class GA4Client<Event extends string = string> {
  /**
   * Are we in debug mode or not?
   */
  private debug = false;

  /**
   * GA tracking IDs we send events for
   */
  measurement_ids: string[] = [];

  /**
   * Parameters for events
   */
  eventParameters: IGA4EventParameters = {};

  /**
   * Parameters for events that we always send
   */
  persistentEventParameters: IGA4EventParameters = {};

  /**
   * User properties that we always send
   */
  userProperties: IGA4EventParameters = {};

  /**
   * IP address we use for the client
   */
  user_ip_address = null;

  /**
   * Hooks for customizing event sending
   */
  hooks = {
    beforeLoad: () => {
      // empty
    },
    beforeRequestSend: () => {
      // empty
    },
  };

  /**
   * The data we send in our events with initial values
   */
  payloadData: IGA4PayloadData = {
    protocol_version: 2,
    hit_count: 1,
    session_id: `${TimeStampInSeconds()}`,
    client_id: `${RandomInt()}.${TimeStampInSeconds()}`,
  };

  /**
   * Promise queue that sends one event at a time
   */
  private queue = new SimplePromiseQueue(1);

  constructor(ids: string[], config: Partial<IGA4Options> = {}) {
    if (!ids) {
      throw new Error('No measurement IDs provides, required');
    }

    // save measurement IDs
    this.measurement_ids = ids;

    // save debug flag
    this.debug = config.debug ? true : false;

    // set flags for GA behaviors
    this.payloadData._is_debug = this.debug ? 1 : undefined;
    this.payloadData.non_personalized_ads = config.non_personalized_ads
      ? 1
      : undefined;

    // init client data
    if (config.client_id) {
      this.payloadData.client_id = config.client_id;
    }

    // init session data
    if (config.session_id) {
      this.payloadData.session_id = config.session_id;
    }

    // make sure we always send this detail with events
    this.setEventsParameter('ga_session_id', this.payloadData.session_id);

    // init user data
    if (config.user_id) {
      this.payloadData.user_id = config.user_id.substring(
        0,
        GA4_CONFIG.USER_ID_LENGTH
      );
    }
    if (config.user_ip_address) {
      this.payloadData.user_ip_address = config.user_ip_address;
    }
  }

  /**
   * Grab current ClientId
   * @returns string
   */
  getClientId() {
    return this.payloadData.client_id;
  }

  /**
   * Grab current Session ID
   * @returns string
   */
  getSessionId() {
    return this.payloadData.session_id;
  }

  /**
   * Set a parameter that tags along with all events
   */
  setEventsParameter(key: string, value: GA4DataType) {
    this.persistentEventParameters[
      key.substring(0, GA4_CONFIG.EVENTS_KEY_LENGTH)
    ] = value.toString().substring(0, GA4_CONFIG.EVENTS_VALUE_LENGTH);
  }

  /**
   * Set a user property that comes along with all events
   */
  setUserProperty(key: string, value: GA4DataType) {
    this.userProperties[key.substring(0, GA4_CONFIG.USER_KEY_LENGTH)] = value
      .toString()
      .substring(0, GA4_CONFIG.USER_VALUE_LENGTH);
  }

  /**
   * Generate Payload
   */
  private buildPayload(
    event: Event,
    parameters: IGA4EventParameters
  ): IGA4EventParameters {
    // set flag if we have started our session or not
    if (this.payloadData.hit_count === 1) this.payloadData.session_engaged = 1;

    /**
     * Init payload that we send
     */
    const payload: IGA4EventParameters = Object.assign(
      {} as IGA4EventParameters,
      copy(this.payloadData)
    );

    /**
     * Correct payload boolean values
     */
    Object.entries(this.payloadData).forEach((pair) => {
      const key = pair[0];
      const value = pair[1];
      if (key in GA4_EVENT_MAP) {
        payload[GA4_EVENT_MAP[key]] =
          typeof value === 'boolean' ? +value : value;
      }
    });

    // GA4 Will have different Limits based on "unknown" rules
    // const itemsLimit = isP ? 27 : 10

    /**
     * Init event parameters that we use
     */
    const eventParameters = Object.assign(
      copy(this.persistentEventParameters),
      copy(parameters)
    );

    /**
     * Set name of the event
     */
    eventParameters.event_name = event;

    /**
     * Add all event parameters
     */
    Object.entries(eventParameters).forEach((pair) => {
      const key = pair[0];
      const value = pair[1];
      if (
        key === 'items' &&
        E_COMMERCE_EVENTS.indexOf(event) > -1 &&
        Array.isArray(value)
      ) {
        // only 200 items per event
        const items = value.slice(0, 200);
        for (let i = 0; i < items.length; i++) {
          if (items[i]) {
            const item = {
              core: {},
              custom: {},
            };
            Object.entries(items[i]).forEach((pair2) => {
              if (GA4_EVENT_MAP[pair2[0]]) {
                if (typeof pair2[1] !== 'undefined')
                  item.core[GA4_EVENT_MAP[pair2[0]]] = pair2[1];
              } else item.custom[pair2[0]] = pair2[1];
            });
            const productString =
              Object.entries(item.core)
                .map((v) => {
                  return v[0] + v[1];
                })
                .join('~') +
              '~' +
              Object.entries(item.custom)
                .map((v, i2) => {
                  const customItemParamIndex =
                    10 > i2 ? '' + i2 : String.fromCharCode(65 + i2 - 10);
                  return `k${customItemParamIndex}${v[0]}~v${customItemParamIndex}${v[1]}`;
                })
                .join('~');
            payload[`pr${i + 1}`] = productString;
          }
        }
      } else {
        if (key in GA4_EVENT_MAP) {
          payload[GA4_EVENT_MAP[key]] =
            typeof value === 'boolean' ? +value : value;
        } else {
          payload[`${IsNumber(value) ? 'epn' : 'ep'}.${key}`] = value;
        }
      }
    });

    /**
     * Add all user properties
     */
    Object.entries(this.userProperties).forEach((pair) => {
      const key = pair[0];
      const value = pair[1];
      if (key in GA4_EVENT_MAP) {
        payload[GA4_EVENT_MAP[key]] =
          typeof value === 'boolean' ? +value : value;
      } else {
        payload[`${IsNumber(value) ? 'upn' : 'up'}.${key}`] = value;
      }
    });

    return payload;
  }

  /**
   * Set ID for user ID
   */
  setUserId(id: string) {
    this.payloadData.user_id = id.substring(0, 256);
  }

  /**
   * Get number of events
   */
  getHitIndex() {
    return this.payloadData.hit_count;
  }

  /**
   * Send event
   */
  sendEvent(event: Event, payloadIn: IGA4EventParameters) {
    /**
     * Create payload
     */
    const payload = this.buildPayload(event, payloadIn);

    /**
     *  Get the IDs that we send events for
     */
    const ids = this.measurement_ids;

    // send event for each ID
    for (let i = 0; i < ids.length; i++) {
      /** Copy payload */
      const iPayload = copy(payload);

      // set metric ID
      iPayload.tid = ids[i];

      // add to queue with a slight delay
      this.queue.add(async () => {
        SendRequest(GA4_CONFIG.URL, iPayload);
        await Sleep(GA4_CONFIG.DELAY);
      });
    }

    // update hit count
    this.payloadData.hit_count++;
  }
}
