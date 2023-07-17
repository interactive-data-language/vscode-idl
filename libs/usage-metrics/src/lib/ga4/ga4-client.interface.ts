/**
 * Centralized config for key/value pairs.
 *
 * Represents event limits
 */
export const GA4_CONFIG = {
  EVENTS_KEY_LENGTH: 40,
  EVENTS_VALUE_LENGTH: 100,
  USER_KEY_LENGTH: 24,
  USER_VALUE_LENGTH: 36,
  USER_ID_LENGTH: 256,
  URL: 'https://www.google-analytics.com/g/collect',
  TIMEOUT: 1000,
  USER_AGENT: `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36`,
  /**
   * Delay, in milliseconds, between each event
   */
  DELAY: 100,
  /** ID of the client */
  CLIENT_ID: '',
  /** Session ID */
  SESSION_ID: '',
};

/**
 * Configuration options for creating a GA4 session
 */
export interface IGA4Options {
  /**
   * ID of the client
   */
  client_id?: string;
  /**
   * Send debug events?
   */
  debug?: boolean;
  /**
   * Do we use non-personalized ads
   */
  non_personalized_ads?: boolean;
  /**
   * ID for the session, if specified added as an additional events parameter "ga_session_id"
   */
  session_id?: string;
  /**
   * ID of the user
   */
  user_id?: string;
  /**
   * The IP address to use for the events
   */
  user_ip_address?: string;
  /**
   * Text for user agent in the events we send
   */
  user_agent?: string;
}

/**
 * Allowed data types for GA4 parameter values
 */
export type GA4DataType = number | string | boolean;

/**
 *  Allowed data types for GA4 parameters
 */
export interface IGA4EventParameters {
  [key: string]: GA4DataType | IGA4EventParameters[];
}

/**
 * Payload data for events
 */
export interface IGA4PayloadData {
  /**
   * GA protocol for sending events and how we format them
   */
  protocol_version: number;
  /**
   * Are we a debug event that shows up in the debug event stream
   */
  _is_debug?: 1;
  /**
   * Do we send personalized ads?
   */
  non_personalized_ads?: 1;
  /**
   * Total number of events
   */
  hit_count: number;
  /**
   * The ID of the client that is sending events
   */
  client_id: string;
  /**
   * The ID of the session
   */
  session_id: string;
  /**
   * Did we start a session
   */
  session_engaged?: 1;
  /**
   * ID of the user
   */
  user_id?: string;
  /**
   * IP address to use for the event
   */
  user_ip_address?: string;
}
