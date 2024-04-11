import { CleanPath } from '@idl/shared';
import { Breakpoint, BreakpointEvent, Source } from '@vscode/debugadapter';
import { DebugProtocol } from '@vscode/debugprotocol';

import {
  IDL_BREAKPOINT_REGEX,
  IDLBreakpoint,
} from './idl-breakpoint-manager.interface';
import { IDLDebugAdapter } from './idl-debug-adapter.class';

/**
 * Manages breakpoints for our IDL session
 */
export class IDLBreakpointManager {
  /** Breakpoints from users in VSCode */
  private VSCodeBreakpoints: DebugProtocol.Breakpoint[] = [];

  constructor(private adapter: IDLDebugAdapter) {}

  /**
   * Gets current breakpoints from IDL
   *
   * Updates internal property with this as the latest
   */
  private async getBreakpoints(): Promise<IDLBreakpoint[]> {
    /**
     * Get current breakpoints from IDL
     */
    const bpTable = await this.adapter.evaluate('help, /breakpoints', {
      silent: true,
      idlInfo: false,
    });

    /**
     * Parse output
     */
    let match = IDL_BREAKPOINT_REGEX.exec(bpTable);

    /**
     * Current breakpoints in IDL
     */
    const breakpoints: IDLBreakpoint[] = [];

    /**
     * Process all matches
     */
    while (match !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (match.index === IDL_BREAKPOINT_REGEX.lastIndex) {
        IDL_BREAKPOINT_REGEX.lastIndex++;
      }

      // get line
      const line = parseInt(match[2]);

      /**
       * Get index of our BP
       */
      const idx = parseInt(match[1]);

      // save breakpoint
      breakpoints.push({
        _id: idx,
        idx: idx,
        line: line,
        file: match[4],
      });

      // check again
      match = IDL_BREAKPOINT_REGEX.exec(bpTable);
    }

    // return what we found
    return breakpoints;
  }

  /**
   * Sets an individual breakpoint for a file and line
   *
   * Line number is one-based
   */
  async setBreakpoint(file: string, line: number, sync = true): Promise<void> {
    /**
     * Add breakpoint via IDL
     */
    await this.adapter.evaluate(
      `breakpoint, /set, '${CleanPath(file)}', ${line}`,
      {
        silent: true,
        idlInfo: false,
      }
    );

    // check if we need to sync with VSCode
    if (sync) {
      await this.syncBreakpointState();
    }
  }

  /**
   * Sets breakpoints and return set breakpoints
   */
  async setBreakpoints(
    bps: DebugProtocol.SetBreakpointsArguments
  ): Promise<DebugProtocol.Breakpoint[]> {
    // wait for IDL to start before we add them
    await this.adapter._startup;

    /** Get file */
    const file = bps.source.path;

    // because we might not have a path (no idea why) return if missing
    if (!file) {
      return [];
    }

    /** Get proper path */
    const cleaned = CleanPath(file);

    // process each requested breakpoint
    for (let i = 0; i < bps.breakpoints.length; i++) {
      await this.setBreakpoint(cleaned, bps.breakpoints[i].line, false);
    }

    // update our breakpoint state
    await this.syncBreakpointState();

    // return current breakpoints
    return this.VSCodeBreakpoints;
  }

  /**
   * Synchronized breakpoint state with VScode
   */
  async syncBreakpointState() {
    /** remove all existing breakpoints */
    const removed = this.VSCodeBreakpoints;

    // remove all
    for (let i = 0; i < removed.length; i++) {
      this.adapter.sendEvent(new BreakpointEvent('removed', removed[i]));
    }

    /**
     * get current breakpoints
     */
    const current: DebugProtocol.Breakpoint[] = (
      await this.getBreakpoints()
    ).map((bp) => {
      return new Breakpoint(
        true,
        bp.line,
        undefined,
        new Source(IDLDebugAdapter.name, bp.file)
      );
    });

    // save
    this.VSCodeBreakpoints = current;

    // sync
    for (let i = 0; i < current.length; i++) {
      this.adapter.sendEvent(new BreakpointEvent('new', current[i]));
    }
  }
}
