import {
  CleanIDLOutput,
  IDL_EVENT_LOOKUP,
  IDLCallStackItem,
  IDLInteractionManager,
  REGEX_COMPILE_COMMAND,
  REGEX_COMPILE_EDIT_COMMAND,
  REGEX_COMPILED_MAIN,
  REGEX_EDIT_COMMAND,
  REGEX_IDL_EXIT,
  REGEX_IDL_LINE_CONTINUATION,
  REGEX_IDL_RESTART,
  REGEX_IDL_RETALL,
  StopReason,
} from '@idl/idl';
import { IDL_DEBUG_ADAPTER_LOG, IDL_DEBUG_LOG } from '@idl/logger';
import { Sleep } from '@idl/shared';
import { IDL_TRANSLATION } from '@idl/translation';
import { USAGE_METRIC_LOOKUP } from '@idl/usage-metrics';
import { IDL_LOGGER, VSCODE_PRO_DIR } from '@idl/vscode/client';
import { IDL_DECORATIONS_MANAGER } from '@idl/vscode/decorations';
import { VSCODE_COMMANDS, VSCodeTelemetryLogger } from '@idl/vscode/shared';
import {
  ContinuedEvent,
  InitializedEvent,
  Logger,
  logger,
  LoggingDebugSession,
  OutputEvent,
  Scope,
  Source,
  StackFrame,
  StoppedEvent,
  TerminatedEvent,
  Thread,
} from '@vscode/debugadapter';
import { DebugProtocol } from '@vscode/debugprotocol';
import { Subject } from 'await-notify';
import { platform } from 'os';
import { basename, delimiter } from 'path';
import * as vscode from 'vscode';

import { FULL_RESET_REGEX, Repartee } from './commands/extra/repartee';
import { LogInput } from './helpers/log-input';
import { LogOutput } from './helpers/log-output';
import { LogSessionStart } from './helpers/log-session-start';
import { LogSessionStop } from './helpers/log-session-stop';
import { MapVariables } from './helpers/map-variables';
import { IDLBreakpointManager } from './idl-breakpoint-manager.class';
import {
  DEFAULT_EVALUATE_OPTIONS,
  IDebugEvaluateOptions,
  IDLDebugConfiguration,
} from './idl-debug-adapter.interface';
import { IDL_STATUS_BAR } from './initialize-debugger';

/**
 * Class that handles requests from VSCode UI and sends them to our underlying
 * process.
 *
 * These are called when a user clicks on the debug buttons included with VSCode
 * or a user manually types content into the debug console.
 */
export class IDLDebugAdapter extends LoggingDebugSession {
  // we don't support multiple threads, so we can use a hardcoded ID for the default thread
  private static readonly THREAD_ID = 1;

  /** Are we listening to events from IDL or not? */
  listening = false;

  /** track the last requested scope */
  lastFrameId = 0;

  /** Last arguments for launching a session */
  lastLaunchArgs?: IDLDebugConfiguration;

  /** IDL interaction manager to communicate with the IDL process */
  _runtime: IDLInteractionManager;

  /** Breakpoint manager */
  _breakpoints: IDLBreakpointManager;

  /** Event to fire when our configuration has been completed, from VSCode example */
  private readonly _configurationDone = new Subject();

  /**
   * Current location we are stopped at, only set/updated when we stop
   *
   * Exposed as a helper for testing to make sure we are in the right place
   */
  stopped?: { reason: StopReason; stack: IDLCallStackItem };

  /**
   * Promise that resolves when IDL has started, used as blocker
   * when we make requests
   */
  _startup: Promise<void>;

  /**
   * Callback to resolve our startup promise
   */
  private _startupResolver: () => void;

  /**
   * Callback to reject our startup promise
   */
  private _startupRejector: () => void;

  constructor() {
    super('idl-debug.txt');

    // this debugger uses zero-based lines and columns
    this.setDebuggerLinesStartAt1(true);
    this.setDebuggerColumnsStartAt1(true);

    // init promise for startup and resolver callback
    this._setStartupPromise();

    // create our runtime session - does not immediately start IDL
    this._runtime = new IDLInteractionManager(
      IDL_LOGGER.getLog(IDL_DEBUG_LOG),
      VSCODE_PRO_DIR
    );

    // create breakpoint manager
    this._breakpoints = new IDLBreakpointManager(this);

    // listen to events
    this.listenToEvents();
  }

  /**
   * Once IDL has started, we listen to events
   */
  listenToEvents() {
    // return if we are already listening to things
    if (this.listening) {
      return;
    }

    // list for failures to start
    this._runtime.on(IDL_EVENT_LOOKUP.FAILED_START, () => {
      this._IDLCrashed('failed-start');
      LogSessionStop('failed-start');
    });

    // listen for events when we continue processing
    this._runtime.on(IDL_EVENT_LOOKUP.CONTINUE, () => {
      this.sendEvent(new ContinuedEvent(IDLDebugAdapter.THREAD_ID));
    });

    // listen for stops
    this._runtime.on(IDL_EVENT_LOOKUP.STOP, async (reason, stack) => {
      IDL_LOGGER.log({
        type: 'debug',
        log: IDL_DEBUG_ADAPTER_LOG,
        content: [`Stopped because: "${reason}"`, stack],
      });
      this.stopped = {
        reason,
        stack,
      };
      this.sendEvent(
        new StoppedEvent(this.stopped.reason, IDLDebugAdapter.THREAD_ID)
      );

      // short pause to make sure APIs catch up
      await Sleep(100);

      // jump to stack to work around VSCode issue/change with latest release
      await vscode.commands.executeCommand(
        'workbench.action.debug.callStackTop'
      );
    });

    // listen for debug output
    this._runtime.on(IDL_EVENT_LOOKUP.OUTPUT, (text) => {
      this.sendEvent(new OutputEvent(`${text}\n`));
      // LogOutput(`${text}\n`);
    });

    // listen for standard out
    this._runtime.on(IDL_EVENT_LOOKUP.STANDARD_OUT, (msg) => {
      this.sendEvent(new OutputEvent(msg, 'stdout'));
      LogOutput(msg);

      // placeholder code that shows how you can apply ansi colors to the output from IDL
      // this.sendEvent(
      //   new OutputEvent(
      //     `${styles.color.ansi16m(...styles.hexToRgb('#8a8c8f'))}${msg}${
      //       styles.color.close
      //     }`
      //   )
      // );
    });

    // pass all stderr output back to the console
    this._runtime.on(IDL_EVENT_LOOKUP.STANDARD_ERR, (msg) => {
      this.sendEvent(new OutputEvent(msg, 'stderr'));
      LogOutput(msg);
    });

    // detect crash event
    this._runtime.on(IDL_EVENT_LOOKUP.END, () => {
      this._IDLCrashed('crash');
      LogSessionStop('crashed');
    });

    // listen for IDL crashing
    this._runtime.on(IDL_EVENT_LOOKUP.CRASHED, () => {
      this._IDLCrashed('crash');
      LogSessionStop('crashed');
    });

    // listen for when our prompt chang es
    this._runtime.on(IDL_EVENT_LOOKUP.PROMPT, (prompt) => {
      // change prompt for status bar
      if (this._runtime.getIDLInfo().envi) {
        IDL_STATUS_BAR.setPrompt('ENVI');
      } else {
        IDL_STATUS_BAR.setPrompt('IDL');
      }
    });

    // update flag that we have started listening to events
    this.listening = true;
  }

  /**
   * Sets our startup promise to track when IDL starts and properly cancel/fail
   * pending requests
   */
  private _setStartupPromise(reset = false) {
    // if resetting, fail previous promise if we havent started yet
    if (reset && this._startupRejector !== undefined) {
      this._startupRejector();
    }

    // refresh properties
    this._startup = new Promise((res, rej) => {
      this._startupResolver = res;
      this._startupRejector = rej;
    });
  }

  /**
   * Method we call when IDL was stopped - not via user, but a likely crash
   */
  private _IDLCrashed(reason: 'crash' | 'failed-start') {
    // this._runtime.removeAllListeners(); // this breaks things
    this.sendEvent(new TerminatedEvent());

    // clear all syntax problems
    IDL_DECORATIONS_MANAGER.reset('pro');

    // reset the status bar prompt
    IDL_STATUS_BAR.resetPrompt();

    // alert user
    switch (reason) {
      case 'failed-start':
        IDL_STATUS_BAR.setStoppedStatus(
          IDL_TRANSLATION.statusBar.problemStarting
        );
        break;
      case 'crash':
        IDL_STATUS_BAR.setStoppedStatus(IDL_TRANSLATION.statusBar.crashed);
        break;
      default:
        break;
    }

    // init promise for startup and resolver callback
    this._setStartupPromise(true);
  }

  /**
   * Gets syntax problems from our IDL helper, tracked
   * by string versions of VSCode URIs
   */
  getSyntaxProblems() {
    return this._runtime.getErrorsByFile();
  }

  /**
   * Gets code coverage for a file and, optionally, decorates the file with it
   */
  async getCodeCoverage(file: string, decorate = false) {
    /** Get coverage */
    const coverage = await this._runtime.getCodeCoverage(file);

    // see if we need to display
    if (decorate) {
      IDL_DECORATIONS_MANAGER.addCodeCoverageDecorations(
        vscode.Uri.file(file),
        coverage
      );
    }

    return coverage;
  }

  /**
   * Run something in IDL and return the string output.
   *
   * This also manages making sure we properly reset things like breakpoints
   * when compiling, nicely closing IDL, and any other actions that need to be
   * made when interacting with the program.
   */
  async evaluate(
    command: string,
    inOptions?: IDebugEvaluateOptions
  ): Promise<string> {
    // make sure we wait until IDL has started to execute anything
    if (!inOptions?.noWait) {
      await this._startup;
    }

    // get the options for evaluating our expression
    const options = { ...DEFAULT_EVALUATE_OPTIONS, ...inOptions };

    // log what we are running
    if (!options.silent) {
      LogInput(options.echoThis ? options.echoThis : command);
    }

    /**
     * Handle executing more than one statement at a time.
     *
     * This prevents the additional scope information from begin printed to the screen by
     * joining the commands together in a single statement as is the assumption
     * for any command directly executed by IDL.
     *
     * TODO: This can potentially change in the future when we can execute one or more
     * statements at a time.
     */
    const splitCommands = command
      .split(/\r?\n/gim)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    // return if nothing to do after filtering
    if (splitCommands.length === 0) {
      return '';
    }

    /** Flag indicating if we have a reset statement and need to add breakpoints again */
    let reset = false;

    /** Flag indicating if are executing an exit statement and need to close */
    let close = false;

    /** Check if we are compiling a file and we need to update breakpoints */
    let didCompile = false;

    /** Hold strings we will actually use for execution */
    const useSplit: string[] = [];

    let last = '';
    let wasCont = false;

    /** Process each command */
    for (let i = 0; i < splitCommands.length; i++) {
      // update flags
      reset = reset || REGEX_IDL_RESTART.test(splitCommands[i]);
      close = close || REGEX_IDL_EXIT.test(splitCommands[i]);

      // start our lines
      if (i === 0) {
        last = splitCommands[i].replace(REGEX_IDL_LINE_CONTINUATION, '');
      } else {
        // check if we had a line continuation before
        if (wasCont) {
          last += splitCommands[i].replace(REGEX_IDL_LINE_CONTINUATION, '');
        } else {
          useSplit.push(last);
          last = splitCommands[i].replace(REGEX_IDL_LINE_CONTINUATION, '');
        }
      }

      // update flag if we had a line continuation
      wasCont = REGEX_IDL_LINE_CONTINUATION.test(splitCommands[i]);

      // check if we are on our last line and add to the use split lines
      if (i === splitCommands.length - 1) {
        useSplit.push(last);
      }
    }

    /**
     * Join our commands together
     */
    const useCommand = useSplit.join(' & ');

    // log what we are doing
    IDL_LOGGER.log({
      log: IDL_DEBUG_ADAPTER_LOG,
      type: 'debug',
      content: [
        'Evaluate',
        { command, splitCommands, useSplit, reset, close, options },
      ],
    });

    // check if we need to close our debug session
    if (close) {
      this.terminate();
      return '';
    }

    // check if we need to send an event that we have continued
    if (options.continued) {
      this.sendEvent(new ContinuedEvent(IDLDebugAdapter.THREAD_ID));
    }

    // update status bar
    IDL_STATUS_BAR.busy();

    /** Output from running all commands */
    let res = '';

    /** Track if we had a main level program */
    let atMain = false;

    /** Flag indicating if we need to return */
    let shouldReturn = false;

    // check if we need to return
    if (REGEX_COMPILE_COMMAND.test(useCommand)) {
      // update flag that we compiled code
      didCompile = true;

      // get the current scope information
      const scope = await this._runtime.getCurrentStack();

      // check for main level
      if (scope.length > 0) {
        if (scope[scope.length - 1].routine === '$main$') {
          atMain = true;
        }
      }

      // process every file we are in
      for (let i = 0; i < scope.length; i++) {
        // get current file so we can build regex expressions
        const scopeFile = scope[i].file;

        // check if our compiled file matches our command
        switch (true) {
          // test full filepath
          case new RegExp(
            `^\\s*\\.(com|comp|compi|compil|compile)\\s+(-v\\s*)?('|")?${scopeFile}('|")?`,
            'gim'
          ).test(useCommand):
            shouldReturn = true;
            break;
          // test base name
          case new RegExp(
            `^\\s*\\.(com|comp|compi|compil|compile)\\s+(-v\\s*)?('|")?${basename(
              scopeFile
            )}('|")?`,
            'gim'
          ).test(useCommand):
            shouldReturn = true;
            break;
          default:
            break;
        }

        // stop checking scope if we found that we are in our file
        if (shouldReturn) {
          break;
        }
      }

      // return silently if needed
      if (shouldReturn) {
        await this._runtime.evaluate('retall', {
          echo: false,
          silent: true,
          idlInfo: false,
        });

        // alert vscode
        this.sendEvent(
          new OutputEvent(`${IDL_TRANSLATION.debugger.adapter.returning}\n`)
        );
        this.sendEvent(new ContinuedEvent(IDLDebugAdapter.THREAD_ID));
      }
    }

    // reset return flag
    shouldReturn = false;

    /** Flag if we need to issue a continued event or not */
    let shouldContinue = false;

    // run every command that came in
    for (let i = 0; i < splitCommands.length; i++) {
      // execute if not .edit
      if (!REGEX_EDIT_COMMAND.test(splitCommands[i])) {
        /**
         * Output from running this command
         */
        const iOutput = await this._runtime.evaluate(splitCommands[i], options);

        // save output
        res += iOutput;

        // check if we are returning
        if (REGEX_IDL_RETALL.test(splitCommands[i])) {
          shouldContinue = true;
        }

        /**
         * Check if we are at a main level program and have compiled a main
         * level program.
         *
         * We don't know this until we run our commands.
         */
        if (atMain) {
          if (REGEX_COMPILED_MAIN.test(CleanIDLOutput(iOutput, false))) {
            shouldReturn = true;
            shouldContinue = true;
          }
        }
      }

      // open pro code on edit or compile
      if (
        REGEX_COMPILE_EDIT_COMMAND.test(splitCommands[i]) ||
        REGEX_EDIT_COMMAND.test(splitCommands[i])
      ) {
        // indicate that we need to reset our breakpoints
        reset = true;

        // open file
        await this.editProCodeFile(splitCommands[i]);
      }
    }

    /**
     * Check if we need to return, indicated by the fact that we compiled a main
     * level program and we were stopped in one
     */
    if (shouldReturn) {
      await this._runtime.evaluate('retall', {
        echo: false,
        silent: true,
        idlInfo: false,
      });
    }

    // determine how to proceed
    switch (true) {
      case reset:
        this.sendEvent(new ContinuedEvent(IDLDebugAdapter.THREAD_ID));
        break;
      case shouldContinue:
        this.sendEvent(new ContinuedEvent(IDLDebugAdapter.THREAD_ID));
        break;
      default:
        break;
    }

    // check for mean statements
    if (FULL_RESET_REGEX.test(command)) {
      await Repartee();
    }

    // check if we need to reset our syntax problems
    if (reset || close) {
      IDL_DECORATIONS_MANAGER.reset('pro');
    }

    // if we compiled, sync breakpoints
    if (didCompile) {
      await this._breakpoints.syncBreakpointState();
    }

    // update status bar if we are done
    if (!this._runtime.executing()) {
      IDL_STATUS_BAR.ready();
    }

    // check if we need to add a new line
    if (options.newLine) {
      this.sendEvent(new OutputEvent(`\n`));
    }

    // see if we need to check for errors
    if (options.errorCheck) {
      // error check the output
      this._runtime.errorCheck(res);

      // sync decorators
      IDL_DECORATIONS_MANAGER.syncSyntaxErrorDecorations(
        this.getSyntaxProblems()
      );
    }

    // return our result
    return res;
  }

  /**
   * Tells us if we have started IDL or not
   */
  isStarted(): boolean {
    return this._runtime.isStarted();
  }

  /**
   * Wraps "protected" method of similar name
   */
  debuggerLineToClient(line: number) {
    return this.convertDebuggerLineToClient(line);
  }

  /**
   * Wraps "protected" method of similar name
   */
  clientLineToDebugger(line: number) {
    return this.convertClientLineToDebugger(line);
  }

  /**
   * The 'initialize' request is the first request called by the frontend
   * to interrogate the features the debug adapter provides.
   */
  protected initializeRequest(
    response: DebugProtocol.InitializeResponse,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    args: DebugProtocol.InitializeRequestArguments
  ) {
    // build and return the capabilities of this debug adapter:
    response.body = response.body || {};

    // the adapter implements the configurationDoneRequest.
    response.body.supportsConfigurationDoneRequest = true;

    // make VS Code to use 'evaluate' when hovering over source
    response.body.supportsEvaluateForHovers = false;

    // make VS Code to show a 'step back' button
    response.body.supportsStepBack = false;

    // make VS Code to support data breakpoints
    response.body.supportsDataBreakpoints = false;

    // make VS Code to support completion in REPL
    response.body.supportsCompletionsRequest = false;
    response.body.completionTriggerCharacters = ['.', '['];

    // make VS Code to send cancelRequests
    response.body.supportsCancelRequest = true;

    // restart and stop debugging
    response.body.supportsTerminateRequest = true;
    response.body.supportsRestartRequest = true;

    // make VS Code send the breakpointLocations request
    response.body.supportsBreakpointLocationsRequest = true;

    this.sendResponse(response);

    // since this debug adapter can accept configuration requests like 'setBreakpoint' at any time,
    // we request them early by sending an 'initializeRequest' to the frontend.
    // The frontend will end the configuration sequence by calling 'configurationDone' request.
    this.sendEvent(new InitializedEvent());
  }

  /**
   * Called at the end of the configuration sequence.
   * Indicates that all breakpoints etc. have been sent to the DA and that the 'launch' can start.
   */
  protected configurationDoneRequest(
    response: DebugProtocol.ConfigurationDoneResponse,
    args: DebugProtocol.ConfigurationDoneArguments
  ) {
    try {
      super.configurationDoneRequest(response, args);

      IDL_LOGGER.log({
        log: IDL_DEBUG_ADAPTER_LOG,
        type: 'debug',
        content: ['Configuration done request'],
      });
    } catch (err) {
      IDL_LOGGER.log({
        type: 'error',
        log: IDL_DEBUG_ADAPTER_LOG,
        content: [IDL_TRANSLATION.debugger.errors.configDone, err],
        alert: IDL_TRANSLATION.debugger.errors.configDone,
      });
    }

    // notify the launchRequest that configuration has finished
    this._configurationDone.notify();
  }

  /**
   * Wrapper to start IDL and run some commands
   */
  launch(): Promise<boolean> {
    // create launch promise
    return new Promise((res, rej) => {
      // attempt to start IDL
      IDL_STATUS_BAR.busy(IDL_TRANSLATION.statusBar.starting, true);

      // log that our session has started
      LogSessionStart();

      // stop listening if we are
      if (this.listening) {
        this._runtime.removeAllListeners();
        this.listening = false;
      }

      // create new instance of runtime
      this._runtime = new IDLInteractionManager(
        IDL_LOGGER.getLog(IDL_DEBUG_LOG),
        VSCODE_PRO_DIR
      );

      // listen to events
      this.listenToEvents();

      // start our runtime session
      this._runtime.start(this.lastLaunchArgs);

      // listen for when we started
      this._runtime.once(IDL_EVENT_LOOKUP.IDL_STARTED, async () => {
        // add new line now that we have started
        LogOutput('\n');

        // get information about IDL
        const version = CleanIDLOutput(
          await this.evaluate('vscode_getIDLInfo', {
            echo: false,
            silent: true,
            idlInfo: false,
            noWait: true,
          })
        );

        try {
          // attempt to parse the response
          const parsed = JSON.parse(version);

          /**
           * TODO: Alert user if they don't have a supported version of IDL
           */

          // send usage metric
          VSCodeTelemetryLogger(USAGE_METRIC_LOOKUP.IDL_STARTUP, {
            idl_version: parsed.release,
            idl_type: parsed.dir.toLowerCase().includes('envi')
              ? 'idl-envi'
              : 'idl',
          });
        } catch (err) {
          IDL_LOGGER.log({
            type: 'error',
            log: IDL_DEBUG_ADAPTER_LOG,
            content: [IDL_TRANSLATION.debugger.errors.idlDetails, err],
            alert: IDL_TRANSLATION.debugger.errors.idlDetails,
          });
        }

        // update status bar
        IDL_STATUS_BAR.ready();

        // return
        res(true);

        // remove rejector callback since we started
        this._startupRejector = undefined;

        // resolve startup promise
        this._startupResolver();
      });

      // listen for failures to launch
      this._runtime.once(IDL_EVENT_LOOKUP.FAILED_START, () => {
        if (!this.isStarted()) {
          // set the stop
          LogSessionStop('failed-start');

          // emit event that we failed to start - handled status bar update
          this._IDLCrashed('failed-start');

          // return
          res(false);
        }
      });
    });
  }

  /**
   * Start a debug session of IDL
   */
  protected async launchRequest(
    response: DebugProtocol.LaunchResponse,
    args: IDLDebugConfiguration
  ) {
    try {
      this.sendEvent(
        new OutputEvent(
          `${IDL_TRANSLATION.debugger.adapter.previewWarning}\n`,
          'stderr'
        )
      );
      this.sendEvent(
        new OutputEvent(`${IDL_TRANSLATION.debugger.adapter.start}\n`)
      );

      // make sure to 'Stop' the buffered logging if 'trace' is not set
      logger.setup(Logger.LogLevel.Stop, false);

      // verify that we have the right info, otherwise alert, terminate, and return
      if (args.config.IDL.directory === '') {
        IDL_LOGGER.log({
          log: IDL_DEBUG_ADAPTER_LOG,
          content:
            'The IDL directory has not been configured, cannot start a debug session',
          type: 'error',
          alert: IDL_TRANSLATION.debugger.adapter.noIDLDir,
          alertMeta: {
            idlLoc: true,
          },
        });

        // indicate we failed
        response.success = false;

        // send response
        this.sendResponse(response);

        // send event that we have terminated
        this.sendEvent(new TerminatedEvent());

        // return and dont continue
        return;
      }

      // start our idl debug session and wait for prompt ready
      IDL_LOGGER.log({
        log: IDL_DEBUG_ADAPTER_LOG,
        type: 'debug',
        content: ['Attempting to start a session of IDL', args],
      });

      // save launch args
      this.lastLaunchArgs = args;

      // start IDL and set flag if we succeeded or not
      response.success = await this.launch();

      // respond
      this.sendResponse(response);
    } catch (err) {
      this.sendResponse(response);
      IDL_LOGGER.log({
        type: 'error',
        log: IDL_DEBUG_ADAPTER_LOG,
        content: [IDL_TRANSLATION.debugger.errors.launch, err],
        alert: IDL_TRANSLATION.debugger.errors.launch,
      });
    }
  }

  /**
   * Restart debugging session
   */
  protected async restartRequest(
    response: DebugProtocol.RestartResponse,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    args: DebugProtocol.RestartArguments,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    request?: DebugProtocol.Request
  ) {
    try {
      IDL_LOGGER.log({
        log: IDL_DEBUG_ADAPTER_LOG,
        type: 'debug',
        content: 'Restart (i.e. reset) request',
      });

      // reset the session
      await this.evaluate('.reset');

      // reset syntax problems
      IDL_DECORATIONS_MANAGER.reset('pro');

      // let vscode know we finished
      this.sendResponse(response);

      // send text to console since it gets cleared
      this.sendEvent(new OutputEvent(`.reset\n`));

      // alert vscode we have started again
      this.sendEvent(new ContinuedEvent(IDLDebugAdapter.THREAD_ID));
    } catch (err) {
      this.sendResponse(response);
      IDL_LOGGER.log({
        type: 'error',
        log: IDL_DEBUG_ADAPTER_LOG,
        content: [IDL_TRANSLATION.debugger.errors.launch, err],
        alert: IDL_TRANSLATION.debugger.errors.launch,
      });
    }
  }

  /**
   * Add breakpoints to IDL
   */
  protected async setBreakPointsRequest(
    response: DebugProtocol.SetBreakpointsResponse,
    args: DebugProtocol.SetBreakpointsArguments
  ) {
    try {
      // add to logs
      IDL_LOGGER.log({
        log: IDL_DEBUG_ADAPTER_LOG,
        type: 'debug',
        content: ['Setting breakpoints for file', args],
      });

      // set breakpoints
      response.body = {
        breakpoints: await this._breakpoints.setBreakpoints(args),
      };

      // send our response
      this.sendResponse(response);
    } catch (err) {
      response.success = false;
      this.sendResponse(response);
      IDL_LOGGER.log({
        type: 'error',
        log: IDL_DEBUG_ADAPTER_LOG,
        content: [IDL_TRANSLATION.debugger.errors.setBreakpoint, err],
        alert: IDL_TRANSLATION.debugger.errors.setBreakpoint,
      });
    }
  }

  /**
   * Get breakpoints from IDL for specific line and file
   */
  protected async breakpointLocationsRequest(
    response: DebugProtocol.BreakpointLocationsResponse,
    args: DebugProtocol.BreakpointLocationsArguments,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    request?: DebugProtocol.Request
  ) {
    try {
      IDL_LOGGER.log({
        log: IDL_DEBUG_ADAPTER_LOG,
        type: 'debug',
        content: ['Breakpoint location request', args],
      });

      // sync breakpoints and get latest
      const bps = this._breakpoints.VSCodeBreakpoints;

      // populate body
      response.body = {
        breakpoints: bps
          .filter((bp) => bp?.source?.path === args?.source?.path)
          .map((breakpoint) => {
            return { line: breakpoint.line };
          }),
      };

      // send response
      this.sendResponse(response);
    } catch (err) {
      response.success = false;
      this.sendResponse(response);
      IDL_LOGGER.log({
        type: 'error',
        log: IDL_DEBUG_ADAPTER_LOG,
        content: [IDL_TRANSLATION.debugger.errors.breakpointLocations, err],
        alert: IDL_TRANSLATION.debugger.errors.breakpointLocations,
      });
    }
  }

  protected threadsRequest(response: DebugProtocol.ThreadsResponse) {
    try {
      // runtime supports no threads so just return a default thread.
      response.body = {
        threads: [new Thread(IDLDebugAdapter.THREAD_ID, 'thread 1')],
      };
      this.sendResponse(response);
    } catch (err) {
      this.sendResponse(response);
      IDL_LOGGER.log({
        type: 'error',
        log: IDL_DEBUG_ADAPTER_LOG,
        content: [IDL_TRANSLATION.debugger.errors.threads, err],
        alert: IDL_TRANSLATION.debugger.errors.threads,
      });
    }
  }

  /**
   * Handle when we are asked for variables
   */
  protected scopesRequest(
    response: DebugProtocol.ScopesResponse,
    args: DebugProtocol.ScopesArguments,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    request?: DebugProtocol.Request
  ) {
    try {
      IDL_LOGGER.log({
        log: IDL_DEBUG_ADAPTER_LOG,
        type: 'debug',
        content: ['Scopes request', args],
      });
      this.lastFrameId = args.frameId;
      response.body = {
        scopes: [new Scope('Local', 1, false)],
      };
      this.sendResponse(response);
    } catch (err) {
      this.sendResponse(response);
      IDL_LOGGER.log({
        type: 'error',
        log: IDL_DEBUG_ADAPTER_LOG,
        content: [IDL_TRANSLATION.debugger.errors.scopes, err],
        alert: IDL_TRANSLATION.debugger.errors.scopes,
      });
    }
  }

  /**
   * Get variables from IDL
   */
  protected async variablesRequest(
    response: DebugProtocol.VariablesResponse,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    args: DebugProtocol.VariablesArguments,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    request?: DebugProtocol.Request
  ) {
    try {
      IDL_LOGGER.log({
        log: IDL_DEBUG_ADAPTER_LOG,
        type: 'debug',
        content: ['Variables request', { frameId: this.lastFrameId }],
      });

      // update status bar
      IDL_STATUS_BAR.busy();

      // populate body
      response.body = {
        variables: MapVariables(
          await this._runtime.getVariables(this.lastFrameId)
        ),
      };

      // update status bar
      IDL_STATUS_BAR.ready();

      // respond
      this.sendResponse(response);
    } catch (err) {
      this.sendResponse(response);
      IDL_LOGGER.log({
        type: 'error',
        log: IDL_DEBUG_ADAPTER_LOG,
        content: [IDL_TRANSLATION.debugger.errors.variables, err],
        alert: IDL_TRANSLATION.debugger.errors.variables,
      });
    }
  }

  /**
   * Convert filepath to "Source" data type for
   */
  private fileToSource(filePath: string): Source {
    return new Source(
      basename(filePath),
      this.convertDebuggerPathToClient(filePath)
    );
  }

  /**
   * Get traceback for where we are in IDL
   */
  protected async stackTraceRequest(
    response: DebugProtocol.StackTraceResponse,
    args: DebugProtocol.StackTraceArguments,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    request?: DebugProtocol.Request
  ) {
    try {
      IDL_LOGGER.log({
        log: IDL_DEBUG_ADAPTER_LOG,
        type: 'debug',
        content: ['Stack trace request', args],
      });

      /** Scope level to get variables */
      const startFrame = args.startFrame !== undefined ? args.startFrame : 0;

      /** number of levels to retrieve variables for */
      const maxLevels = args.levels !== undefined ? args.levels : 1000;

      /** Last frame to get variables */
      const endFrame = startFrame + maxLevels;

      // get stack
      const stack = await this._runtime.getCallStack(startFrame, endFrame);

      // populate body
      response.body = {
        stackFrames: stack.frames.map(
          (frame) =>
            new StackFrame(
              frame.index,
              frame.name,
              this.fileToSource(frame.file),
              this.convertDebuggerLineToClient(frame.line)
            )
        ),
        totalFrames: stack.count,
      };

      IDL_LOGGER.log({
        type: 'debug',
        log: IDL_DEBUG_ADAPTER_LOG,
        content: ['Call stack', response.body.stackFrames],
      });

      // send response
      this.sendResponse(response);
    } catch (err) {
      this.sendResponse(response);
      IDL_LOGGER.log({
        type: 'error',
        log: IDL_DEBUG_ADAPTER_LOG,
        content: [IDL_TRANSLATION.debugger.errors.stackTrace, err],
        alert: IDL_TRANSLATION.debugger.errors.stackTrace,
      });
    }
  }

  /**
   * Continue processing after we have stopped
   */
  protected async continueRequest(
    response: DebugProtocol.ContinueResponse,
    args: DebugProtocol.ContinueArguments,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    request?: DebugProtocol.Request
  ) {
    try {
      IDL_LOGGER.log({
        log: IDL_DEBUG_ADAPTER_LOG,
        type: 'debug',
        content: ['Continue request', args],
      });
      // emit event and send response
      this.sendResponse(response);

      // actually tell IDL to do work, weird race condition if we do this first
      await this.evaluate('.continue', { silent: false, echo: true });
    } catch (err) {
      this.sendResponse(response);
      IDL_LOGGER.log({
        type: 'error',
        log: IDL_DEBUG_ADAPTER_LOG,
        content: [IDL_TRANSLATION.debugger.errors.continue, err],
        alert: IDL_TRANSLATION.debugger.errors.continue,
      });
    }
  }

  /**
   * Step over routine
   */
  protected async nextRequest(
    response: DebugProtocol.NextResponse,
    args: DebugProtocol.NextArguments,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    request?: DebugProtocol.Request
  ) {
    try {
      IDL_LOGGER.log({
        log: IDL_DEBUG_ADAPTER_LOG,
        type: 'debug',
        content: ['Step over request', args],
      });
      this.sendResponse(response);

      // actually tell IDL to do work, weird race condition if we do this first
      await this.evaluate('.stepover', { silent: false, echo: true });
    } catch (err) {
      this.sendResponse(response);
      IDL_LOGGER.log({
        type: 'error',
        log: IDL_DEBUG_ADAPTER_LOG,
        content: [IDL_TRANSLATION.debugger.errors.next, err],
        alert: IDL_TRANSLATION.debugger.errors.next,
      });
    }
  }

  /**
   * Step into routine
   */
  protected async stepInRequest(
    response: DebugProtocol.StepInResponse,
    args: DebugProtocol.StepInArguments,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    request?: DebugProtocol.Request
  ) {
    try {
      IDL_LOGGER.log({
        log: IDL_DEBUG_ADAPTER_LOG,
        type: 'debug',
        content: ['Step in request', args],
      });
      this.sendResponse(response);

      // actually tell IDL to do work, weird race condition if we do this first
      await this.evaluate('.step', { silent: false, echo: true });
    } catch (err) {
      this.sendResponse(response);
      IDL_LOGGER.log({
        type: 'error',
        log: IDL_DEBUG_ADAPTER_LOG,
        content: [IDL_TRANSLATION.debugger.errors.stepIn, err],
        alert: IDL_TRANSLATION.debugger.errors.stepIn,
      });
    }
  }

  /**
   * Step out of routine
   */
  protected async stepOutRequest(
    response: DebugProtocol.StepOutResponse,
    args: DebugProtocol.StepOutArguments,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    request?: DebugProtocol.Request
  ) {
    try {
      IDL_LOGGER.log({
        log: IDL_DEBUG_ADAPTER_LOG,
        type: 'debug',
        content: ['Step out request', args],
      });
      this.sendResponse(response);

      // actually tell IDL to do work, weird race condition if we do this first
      await this.evaluate('.out', { silent: false, echo: true });
    } catch (err) {
      this.sendResponse(response);
      IDL_LOGGER.log({
        type: 'error',
        log: IDL_DEBUG_ADAPTER_LOG,
        content: [IDL_TRANSLATION.debugger.errors.stepOut, err],
        alert: IDL_TRANSLATION.debugger.errors.stepOut,
      });
    }
  }

  /**
   * Pause IDL session
   */
  protected pauseRequest(
    response: DebugProtocol.PauseResponse,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    args: DebugProtocol.PauseArguments,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    request?: DebugProtocol.PauseRequest
  ) {
    try {
      IDL_LOGGER.log({
        log: IDL_DEBUG_ADAPTER_LOG,
        type: 'debug',
        content: ['Pause request', args],
      });

      // only pause if we are not on windows
      if (platform() !== 'win32') {
        this._runtime.pause();
      } else {
        vscode.window.showWarningMessage(
          IDL_TRANSLATION.debugger.adapter.noPauseOnWindows
        );
      }

      this.sendResponse(response);
    } catch (err) {
      this.sendResponse(response);
      IDL_LOGGER.log({
        type: 'error',
        log: IDL_DEBUG_ADAPTER_LOG,
        content: [IDL_TRANSLATION.debugger.errors.pause, err],
        alert: IDL_TRANSLATION.debugger.errors.pause,
      });
    }
  }

  /**
   * Wrapper method to stop our current IDL session
   */
  terminate() {
    this.sendEvent(
      new OutputEvent(`${IDL_TRANSLATION.debugger.adapter.stop}\n`)
    );

    // stop
    this._runtime.stop();

    // add to log
    LogSessionStop('stopped');

    // reset syntax problems
    IDL_DECORATIONS_MANAGER.reset('pro');

    // update status bar
    IDL_STATUS_BAR.resetPrompt();
    IDL_STATUS_BAR.setStoppedStatus(IDL_TRANSLATION.statusBar.stopped);

    // init promise for startup and resolver callback
    this._setStartupPromise(true);

    // alert vscode we have stopped
    this.sendEvent(new TerminatedEvent());
  }

  /**
   * Stop debug session
   */
  protected terminateRequest(
    response: DebugProtocol.TerminateResponse,
    args: DebugProtocol.TerminateArguments,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    request?: DebugProtocol.Request
  ) {
    try {
      IDL_LOGGER.log({
        log: IDL_DEBUG_ADAPTER_LOG,
        type: 'debug',
        content: ['Terminate request', args],
      });

      // stop IDL
      this.terminate();

      // send our response
      this.sendResponse(response);
    } catch (err) {
      this.sendResponse(response);
      IDL_LOGGER.log({
        type: 'error',
        log: IDL_DEBUG_ADAPTER_LOG,
        content: [IDL_TRANSLATION.debugger.errors.terminate, err],
        alert: IDL_TRANSLATION.debugger.errors.terminate,
      });
    }
  }

  protected cancelRequest(
    response: DebugProtocol.CancelResponse,
    args: DebugProtocol.CancelArguments,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    request?: DebugProtocol.Request
  ) {
    try {
      IDL_LOGGER.log({
        log: IDL_DEBUG_ADAPTER_LOG,
        type: 'debug',
        content: ['Cancel request', args],
      });

      this.sendResponse(response);
    } catch (err) {
      this.sendResponse(response);
      IDL_LOGGER.log({
        type: 'error',
        log: IDL_DEBUG_ADAPTER_LOG,
        content: [IDL_TRANSLATION.debugger.errors.cancel, err],
        alert: IDL_TRANSLATION.debugger.errors.cancel,
      });
    }
  }

  /**
   * Given a .compile or .edit command, extract the routine name
   * and open the file in the VS Code editor.
   */
  protected async editProCodeFile(editCommand: string) {
    let moduleName = editCommand.trim().split(' ').pop();
    if (!moduleName) {
      return;
    }
    moduleName = basename(moduleName.replace(/['"]/g, ''));
    if (!moduleName.endsWith('.pro')) {
      moduleName += '.pro';
    }

    /** Command that IDL will execute */
    const cmd = `print,(file_search(strtok(!path,'${delimiter}',/extract) + '/${moduleName}',/nosort))[0]`;

    // trim to remove any excess new lines and remove any new-lines that may have been
    // printed out
    const fullPath = CleanIDLOutput(
      await this.evaluate(cmd, {
        silent: true,
        echo: false,
      })
    );

    // attempt to open if we found a file
    if (fullPath) {
      const file = vscode.Uri.file(fullPath);
      vscode.commands.executeCommand(VSCODE_COMMANDS.OPEN_FILE, file, {
        preview: false,
      });
    } else {
      this.sendEvent(
        new OutputEvent(
          `${IDL_TRANSLATION.debugger.adapter.nothingToEdit}\n`,
          'stderr'
        )
      );
    }
  }

  /**
   * Runs a command manually typed into the debug console
   */
  protected async evaluateRequest(
    response: DebugProtocol.EvaluateResponse,
    args: DebugProtocol.EvaluateArguments,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    request?: DebugProtocol.EvaluateRequest
  ) {
    try {
      IDL_LOGGER.log({
        log: IDL_DEBUG_ADAPTER_LOG,
        type: 'debug',
        content: ['Evaluate request', args],
      });

      // dont evaluate watch variables
      if (args?.context !== 'watch') {
        // evaluate command
        await this.evaluate(args.expression, {
          silent: false,
          frameId: args.frameId,
          errorCheck: true,
        });
      }

      // TODO: figure out how to bypass this.
      // when wen stop debugging you get `Canceled` printed to the debug console for
      // as many commands as you executed
      // if we do use this then we get empty lines displayed in the debug console
      response.success = true;
      response.body = {
        result: '', // no string content since we send as it gets generated
        variablesReference: -1,
      };
      this.sendResponse(response);
    } catch (err) {
      this.sendResponse(response);
      IDL_LOGGER.log({
        type: 'error',
        log: IDL_DEBUG_ADAPTER_LOG,
        content: [IDL_TRANSLATION.debugger.errors.evaluate, err],
        alert: IDL_TRANSLATION.debugger.errors.evaluate,
      });
    }
  }
}
