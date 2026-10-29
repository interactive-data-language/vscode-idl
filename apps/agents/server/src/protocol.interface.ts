import type { IConfigProblem } from '@idl/mcp/agents-server';

/**
 * Bump when a change to the messages below is not backwards compatible.
 *
 * Hosts must not import this file at runtime, they keep their own copy of
 * these types and compare against `hello.protocolVersion`.
 */
export const AGENTS_SERVER_PROTOCOL_VERSION = 1;

/** Codes for `error` messages */
export type AgentsServerErrorCode =
  | 'ALREADY_STARTED'
  | 'INVALID_CONFIG'
  | 'REQUEST_FAILED'
  | 'START_FAILED';

/** Level for forwarded log messages */
export type AgentsServerLogLevel = 'debug' | 'error' | 'info' | 'log' | 'warn';

/** Server settings a host may override when starting */
export interface IAgentsServerStartOverrides {
  host?: string;
  port?: number;
}

// Host -> server. Every request carries an `id` that is echoed in the response.

export interface IGetConfigRequest {
  id: number;
  type: 'get-config';
}

export interface IUpdateConfigRequest {
  /** Partial config, deep-merged into the current config and saved to disk */
  config: Record<string, unknown>;
  id: number;
  type: 'update-config';
}

export interface IValidateRequest {
  id: number;
  type: 'validate';
}

export interface IStartRequest {
  id: number;
  overrides?: IAgentsServerStartOverrides;
  type: 'start';
}

export interface IStopRequest {
  type: 'stop';
}

export type AgentsServerRequest =
  | IGetConfigRequest
  | IStartRequest
  | IStopRequest
  | IUpdateConfigRequest
  | IValidateRequest;

// Server -> host

/** First message sent, before any request is accepted */
export interface IHelloMessage {
  protocolVersion: number;
  type: 'hello';
}

/** Response to `get-config` and `update-config` */
export interface IConfigMessage {
  config: Record<string, unknown>;
  id: number;
  type: 'config';
}

export interface IValidationMessage {
  id: number;
  problems: IConfigProblem[];
  type: 'validation';
}

/** Response to `start` once the server is listening */
export interface IReadyMessage {
  id: number;
  port: number;
  type: 'ready';
}

export interface IErrorMessage {
  code: AgentsServerErrorCode;
  /** Missing when the failure is not tied to a request */
  id?: number;
  message: string;
  /** Set for `INVALID_CONFIG` */
  problems?: IConfigProblem[];
  type: 'error';
}

export interface ILogMessage {
  content: unknown[];
  level: AgentsServerLogLevel;
  /** Name of the log, i.e. "idl-agent-server" */
  log: string;
  type: 'log';
}

export type AgentsServerMessage =
  | IConfigMessage
  | IErrorMessage
  | IHelloMessage
  | ILogMessage
  | IReadyMessage
  | IValidationMessage;
