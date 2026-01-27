/**
 * IP addresses for local machine and not remote
 */
export const LOCAL_IPS: { [key: string]: any } = {};
LOCAL_IPS['127.0.0.1'] = true; // IPv4
LOCAL_IPS['::1'] = true; // IPv6
LOCAL_IPS['::ffff:127.0.0.1'] = true; // IPv6
LOCAL_IPS['localhost'] = true;
