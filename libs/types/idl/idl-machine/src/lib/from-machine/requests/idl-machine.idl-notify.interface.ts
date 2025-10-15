/**
 * IDL Notify request
 */
export type IDLNotifyRequest = 'idlNotify';

/**
 * Parameters from IDL Notify function:
 *
 * response = IDLNotify(id, param1, param2)
 */
export type IDLNotifyParams = {
  id: string;
  param1: string;
  param2: string;
};

/**
 * Integer number returned from our response
 */
export type IDLNotifyResponse = number;
