interface IBaseModelConfig {
  defaultModel: string;
  utilityModel: string;
}

interface IBaseModelAPIConfig {
  apiKey: string;
}

type CopilotModel = 'copilot';
type CopilotConfig = {
  /** GitHub token used to authenticate the Copilot SDK client */
  gitHubToken: string;
};

type OpenAIModel = 'openai';
type OpenAIModelConfig = IBaseModelAPIConfig & IBaseModelConfig;

type OllamaModel = 'ollama';
type OllamaModelConfig = {
  /** URL to OpenAI REST API */
  url: string;
  /** Max input tokens */
  maxPromptTokens: number;
  /** Max output tokens */
  maxOutputTokens: number;
} & IBaseModelConfig;

export type ModelType = CopilotModel | OllamaModel | OpenAIModel;

export type ModelConfig<T extends ModelType> = T extends CopilotModel
  ? CopilotConfig
  : T extends OpenAIModel
    ? OpenAIModelConfig
    : T extends OllamaModel
      ? OllamaModelConfig
      : never;

export type ModelWithConfig<T extends ModelType = ModelType> =
  T extends ModelType ? { model: T; config: ModelConfig<T> } : never;
