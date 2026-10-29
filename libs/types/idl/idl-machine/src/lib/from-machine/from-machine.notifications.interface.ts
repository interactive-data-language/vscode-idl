import type {
  BreakpointMovedNotification,
  BreakpointMovedParams,
} from './notifications/idl-machine.breakpoint-moved.interface';
import type {
  CommandFinishedNotification,
  CommandFinishedParams,
} from './notifications/idl-machine.command-finished.interface';
import type {
  CommandStartedNotification,
  CommandStartedParams,
} from './notifications/idl-machine.command-started.interface';
import type {
  CompilerOpenFileNotification,
  CompilerOpenFileParams,
} from './notifications/idl-machine.compiler-open-file.interface';
import type {
  DeathHintNotification,
  DeathHintParams,
} from './notifications/idl-machine.death-hint.interface';
import type {
  DebugSendNotification,
  DebugSendParams,
} from './notifications/idl-machine.debug-send.interface';
import type {
  ServerExitNotification,
  ServerExitParams,
} from './notifications/idl-machine.erver-exit.interface';
import type {
  ExitDoneNotification,
  ExitDoneParams,
} from './notifications/idl-machine.exit-done.interface';
import type {
  HelpTopicNotification,
  HelpTopicParams,
} from './notifications/idl-machine.help-topic.interface';
import type {
  InterpreterStoppedNotification,
  InterpreterStoppedParams,
} from './notifications/idl-machine.interpreter-stopped.interface';
import type {
  LicensingEventNotification,
  LicensingEventParams,
} from './notifications/idl-machine.licensing-event.interface';
import type {
  ModalMessageNotification,
  ModalMessageParams,
} from './notifications/idl-machine.modal-message.interface';
import type {
  OpenFileNotification,
  OpenFileParams,
} from './notifications/idl-machine.open-file.interface';
import type {
  PathChangeNotification,
  PathChangeParams,
} from './notifications/idl-machine.path-change.interface';
import type {
  PromptChangeNotification,
  PromptChangeParams,
} from './notifications/idl-machine.prompt-change.interface';
import type {
  ResetSessionDoneNotification,
  ResetSessionDoneParams,
} from './notifications/idl-machine.reset-session-done.interface';
import type {
  RuntimeErrorNotification,
  RuntimeErrorParams,
} from './notifications/idl-machine.runtime-error.interface';
import type {
  ServerReadyNotification,
  ServerReadyParams,
} from './notifications/idl-machine.server-ready.interface';
import type {
  ShowBreakpointNotification,
  ShowBreakpointParams,
} from './notifications/idl-machine.show-breakpoint.interface';
import type {
  CompileOpenFileParams,
  ShowCompileErrorNotification,
} from './notifications/idl-machine.show-compile-error.interface';
import type {
  TOutNotification,
  TOutParams,
} from './notifications/idl-machine.tout.interface';
import type {
  DeletedVariableNotification,
  DeletedVariableParams,
} from './notifications/idl-machine.variable-deleted.interface';
import type {
  WorkingDirChangeNotification,
  WorkingDirChangeParams,
} from './notifications/idl-machine.working-dir-change.interface';

/**
 * All types of notifications from the IDL Machine
 */
export type FromIDLMachineNotifications =
  | BreakpointMovedNotification
  | CommandFinishedNotification
  | CommandStartedNotification
  | CompilerOpenFileNotification
  | DeathHintNotification
  | DebugSendNotification
  | DeletedVariableNotification
  | ExitDoneNotification
  | HelpTopicNotification
  | InterpreterStoppedNotification
  | LicensingEventNotification
  | ModalMessageNotification
  | OpenFileNotification
  | PathChangeNotification
  | PromptChangeNotification
  | ResetSessionDoneNotification
  | RuntimeErrorNotification
  | ServerExitNotification
  | ServerReadyNotification
  | ShowBreakpointNotification
  | ShowCompileErrorNotification
  | TOutNotification
  | WorkingDirChangeNotification;

/**
 * Parameters for notifications from the IDL Machine
 */
export type FromIDLMachineNotificationParams<
  T extends FromIDLMachineNotifications,
> = T extends BreakpointMovedNotification
  ? BreakpointMovedParams
  : T extends CommandFinishedNotification
    ? CommandFinishedParams
    : T extends CommandStartedNotification
      ? CommandStartedParams
      : T extends CompilerOpenFileNotification
        ? CompilerOpenFileParams
        : T extends DeathHintNotification
          ? DeathHintParams
          : T extends DebugSendNotification
            ? DebugSendParams
            : T extends DeletedVariableNotification
              ? DeletedVariableParams
              : T extends ExitDoneNotification
                ? ExitDoneParams
                : T extends HelpTopicNotification
                  ? HelpTopicParams
                  : T extends LicensingEventNotification
                    ? LicensingEventParams
                    : T extends InterpreterStoppedNotification
                      ? InterpreterStoppedParams
                      : T extends ModalMessageNotification
                        ? ModalMessageParams
                        : T extends OpenFileNotification
                          ? OpenFileParams
                          : T extends PathChangeNotification
                            ? PathChangeParams
                            : T extends PromptChangeNotification
                              ? PromptChangeParams
                              : T extends ResetSessionDoneNotification
                                ? ResetSessionDoneParams
                                : T extends RuntimeErrorNotification
                                  ? RuntimeErrorParams
                                  : T extends ServerExitNotification
                                    ? ServerExitParams
                                    : T extends ServerReadyNotification
                                      ? ServerReadyParams
                                      : T extends ShowBreakpointNotification
                                        ? ShowBreakpointParams
                                        : T extends ShowCompileErrorNotification
                                          ? CompileOpenFileParams
                                          : T extends TOutNotification
                                            ? TOutParams
                                            : T extends WorkingDirChangeNotification
                                              ? WorkingDirChangeParams
                                              : never;
