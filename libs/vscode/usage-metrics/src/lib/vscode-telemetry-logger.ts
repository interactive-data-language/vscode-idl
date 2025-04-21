import {
  GA4_CONFIG,
  InitializeUsageMetrics,
  SendUsageMetric,
  UsageMetric,
  UsageMetricPayload,
} from '@idl/usage-metrics';
import * as vscode from 'vscode';

/**
 * Helper flag to disable usage metric reporting
 */
const CAN_METRIC = true;

/**
 * Remove extra keys that VSCode adds
 *
 * Even though we can tell vscode to remove, we want the
 * machine ID that comes through so we have a value that persists
 */
function CleanData(data: { [key: string]: any }) {
  const keys = Object.keys(data);
  for (let i = 0; i < keys.length; i++) {
    if (keys[i].includes('.')) {
      delete data[keys[i]];
    }
  }
}

/**
 * Sends telemetry events
 */
const VSCODE_TELEMETRY_SENDER: vscode.TelemetrySender = {
  /**
   * When called, actually send event data
   *
   * Only called when usage metrics are enabled through VSCode
   */
  sendEventData: (
    eventName: UsageMetric,
    data: UsageMetricPayload<UsageMetric>
  ) => {
    /**
     * Check if we need to initialize our usage metrics
     */
    if (!GA4_CONFIG.CLIENT_ID && 'common.vscodemachineid' in data) {
      GA4_CONFIG.CLIENT_ID = data['common.vscodemachineid'] as string;
      GA4_CONFIG.SESSION_ID = data['common.vscodesessionid'] as string;
      InitializeUsageMetrics();
    }

    /**
     * Remove keys that VSCode adds
     */
    CleanData(data);

    /**
     * Remove start of event name
     */
    eventName = eventName.split('/')[1] as UsageMetric;

    // send our cleaned data
    if (CAN_METRIC) {
      SendUsageMetric(eventName, data);
    }
  },
  sendErrorData: (eventName, data) => {
    // do nothing for now
  },
};

/**
 * VSCode telemetry logger
 */
const VSCODE_TELEMETRY_LOGGER = vscode.env.createTelemetryLogger(
  VSCODE_TELEMETRY_SENDER,
  {
    ignoreBuiltInCommonProperties: false,
  }
);

/**
 * Calls the internal VSCode telemetry routines that apply filtering based
 * on a centralized source of information
 */
export function VSCodeTelemetryLogger<T extends UsageMetric>(
  event: T,
  payload: UsageMetricPayload<T>
) {
  VSCODE_TELEMETRY_LOGGER.logUsage(event, payload);
}
