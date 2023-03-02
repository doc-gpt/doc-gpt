import { GptInvalidApiKey, GptMissingOptions } from './errors';

/**
 * --------------------
 * -- OpenAI GPT SDK --
 * --------------------
 * -- Version: 0.0.1 --
 * --------------------
 *
 * SDK for easily interact with gpt-3.5-turbo apis (aka Chat Apis)
 *
 */

/**
 * Chat apis documentation
 * https://platform.openai.com/docs/api-reference/chat/create
 */

export type GptModel = 'gpt-3.5-turbo' | 'gpt-3.5-turbo-0301';

export const GptModels = {
  'gpt-3.5-turbo': 'gpt-3.5-turbo' as GptModel,
  'gpt-3.5-turbo-0301': 'gpt-3.5-turbo-0301' as GptModel,
};

export interface GptSDKOptions {
  apiKey: string;
  model?: GptModel | string;
}

class GptSDK {
  options!: GptSDKOptions;

  /**
   * Instance to interact with OpenAI `/v1/chat/completions` api
   *
   * @param options Configure the GptSDK instance. You will need to provide at least your api key.
   */
  constructor(options: GptSDKOptions) {
    // Check for missing options
    if (!options) throw new Error(GptMissingOptions);

    // Check for nullish apyKey
    if (!options.apiKey || typeof options.apiKey !== 'string')
      throw new Error(`${GptInvalidApiKey} ${options.apiKey}`);

    // Fallback model to gpt-3.5-turbo if missing
    if (!options.model) {
      if (process.env['NODE_ENV'] === 'development') console.info(`No model provided. Fallback to 'gpt-3.5-turbo'. (You can override this. This is only visible in development environment)`);
    }

    this.options = options;
  }
}

export default GptSDK;
