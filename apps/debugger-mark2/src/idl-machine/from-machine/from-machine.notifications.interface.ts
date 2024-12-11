import {
  BreakpointMovedNotification,
  BreakpointMovedParams,
} from './notifications/idl-machine.breakpoint-moved.interface';
import {
  CommandFinishedNotification,
  CommandFinishedParams,
} from './notifications/idl-machine.command-finished.interface';
import {
  CommandStartedNotification,
  CommandStartedParams,
} from './notifications/idl-machine.command-started.interface';
import {
  CompilerOpenFileNotification,
  CompilerOpenFileParams,
} from './notifications/idl-machine.compiler-open-file.interface';
import {
  DeathHintNotification,
  DeathHintParams,
} from './notifications/idl-machine.death-hint.interface';
import {
  DebugSendNotification,
  DebugSendParams,
} from './notifications/idl-machine.debug-send.interface';
import {
  ExitDoneNotification,
  ExitDoneParams,
} from './notifications/idl-machine.exit-done.interface';
import {
  HelpTopicNotification,
  HelpTopicParams,
} from './notifications/idl-machine.help-topic.interface';
import {
  InterpreterStoppedNotification,
  InterpreterStoppedParams,
} from './notifications/idl-machine.interpreter-stopped.interface';
import {
  ModalMessageNotification,
  ModalMessageParams,
} from './notifications/idl-machine.modal-message.interface';
import {
  OpenFileNotification,
  OpenFileParams,
} from './notifications/idl-machine.open-file.interface';
import {
  PathChangeNotification,
  PathChangeParams,
} from './notifications/idl-machine.path-change.interface';
import {
  PromptChangeNotification,
  PromptChangeParams,
} from './notifications/idl-machine.prompt-change.interface';
import {
  ResetSessionDoneNotification,
  ResetSessionDoneParams,
} from './notifications/idl-machine.reset-session-done.interface';
import {
  RuntimeErrorNotification,
  RuntimeErrorParams,
} from './notifications/idl-machine.runtime-error.interface';
import {
  ServerReadyNotification,
  ServerReadyParams,
} from './notifications/idl-machine.server-ready.interface';
import {
  ShowBreakpointNotification,
  ShowBreakpointParams,
} from './notifications/idl-machine.show-breakpoint.interface';
import {
  TOutNotification,
  TOutParams,
} from './notifications/idl-machine.tout.interface';
import {
  DeletedVariableNotification,
  DeletedVariableParams,
} from './notifications/idl-machine.variable-deleted.interface';
import {
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
  | ModalMessageNotification
  | OpenFileNotification
  | PathChangeNotification
  | PromptChangeNotification
  | ResetSessionDoneNotification
  | RuntimeErrorNotification
  | ServerReadyNotification
  | ShowBreakpointNotification
  | TOutNotification
  | WorkingDirChangeNotification;

/**
 * Parameters for notifications from the IDL Machine
 */
export type FromIDLMachineNotificationParams<
  T extends FromIDLMachineNotifications
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
  : T extends ServerReadyNotification
  ? ServerReadyParams
  : T extends ShowBreakpointNotification
  ? ShowBreakpointParams
  : T extends TOutNotification
  ? TOutParams
  : T extends WorkingDirChangeNotification
  ? WorkingDirChangeParams
  : never;
