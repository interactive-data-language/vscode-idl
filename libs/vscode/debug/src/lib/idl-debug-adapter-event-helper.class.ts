import { IDL_DEBUG_ADAPTER_LOG } from '@idl/logger';
import { Sleep } from '@idl/shared/extension';
import { IDLCallStackItem, StopReason } from '@idl/types/idl/idl-process';
import { IDL_LOGGER } from '@idl/vscode/logger';
import { ContinuedEvent, StoppedEvent } from '@vscode/debugadapter';
import * as vscode from 'vscode';

import { IDLDebugAdapter } from './idl-debug-adapter.class';
import {
  ADAPTER_METHOD_LOG_LEVEL,
  ADAPTER_STOP_DELAY,
} from './idl-debug-adapter.interface';

export class IDLDebugAdapterEventHelper {
  /** Reference to the debug adapter */
  private adapter: IDLDebugAdapter;

  /** Counters we track to better handle events */
  private counters = {
    stopBlockers: 0,
  };

  /** Track information about latest stop */
  private stopped?: { reason: StopReason; stack: IDLCallStackItem };

  constructor(adapter: IDLDebugAdapter) {
    this.adapter = adapter;
  }

  /** Reduces stop blocker counter by 1 */
  removeStopBlocker() {
    // this.counters.stopBlockers = Math.max(this.counters.stopBlockers-1, 0)
    this.counters.stopBlockers--;
  }

  /**
   * Track a new stop
   */
  async reportStop(reason: StopReason, stack: IDLCallStackItem) {
    IDL_LOGGER.log({
      log: IDL_DEBUG_ADAPTER_LOG,
      type: ADAPTER_METHOD_LOG_LEVEL,
      content: [
        `Stopped because "${reason}" and can send "${
          this.counters.stopBlockers === 0
        }"`,
        stack,
      ],
    });

    // make sure that we can send an event or update our location
    if (this.counters.stopBlockers === 0) {
      // save stopped information
      this.stopped = {
        reason,
        stack,
      };

      // alert VSCode we have stopped
      this.adapter.sendEvent(
        new StoppedEvent(reason, IDLDebugAdapter.THREAD_ID)
      );

      // short pause to make sure APIs catch up
      await Sleep(ADAPTER_STOP_DELAY);

      // jump to stack to work around VSCode issue/change with latest release
      // have to manually set the debug console focus in evaluateRequest() in the
      // debug helper libs\vscode\debug\src\lib\idl-debug-adapter.class.ts
      if (stack.file.toLowerCase().endsWith('.pro')) {
        await vscode.commands.executeCommand(
          'workbench.action.debug.callStackTop'
        );
      }
    }
  }

  /** Reset the stop and alert VSCode we have moved on */
  resetStopAndContinue() {
    this.stopped = undefined;
    this.adapter.sendEvent(new ContinuedEvent(IDLDebugAdapter.THREAD_ID));
  }

  /** Increments stop blocker counter by 1 */
  trackStopBlocker() {
    this.counters.stopBlockers++;
  }
}
