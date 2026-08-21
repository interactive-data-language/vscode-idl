type IDLMachineMode = 'idl-machine';
// eslint-disable-next-line @typescript-eslint/ban-types
type IDLMachineConfig = {};

type WebsocketMode = 'websocket';
type WebsocketConfig = {
  /** URL to connect to for websocket-based processing */
  url: string;
};

/** What is the mode for running processing */
export type ProcessingMode = IDLMachineMode | WebsocketMode;

export type ProcessingModeConfig<T extends ProcessingMode> =
  T extends IDLMachineMode
    ? IDLMachineConfig
    : T extends WebsocketMode
      ? WebsocketConfig
      : never;

export type ProcessingModeWithConfig<
  T extends ProcessingMode = ProcessingMode,
> = T extends ProcessingMode
  ? { mode: T; config: ProcessingModeConfig<T> }
  : never;
