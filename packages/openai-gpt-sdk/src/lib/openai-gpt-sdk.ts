import axios, { Axios } from "axios";
import { OpenAIChatCompletionApi } from "./config";
import { GptInvalidApiKey, GptMissingOptions } from "./messages/errors";
import { GptChatOptions, GptChatRequest, GptMessage, GptModels, GptResponse, GptSDKOptions } from "./types";

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
 * Instance to interact with OpenAI `/v1/chat/completions` api.
 * 
 * *You will need a OpenAI api key in order to configure the instance.*
 * 
 * Use the `chat` method for interact with the api! 
 * 
 * Have fun!
 * 
 * For more informations about the api see [https://platform.openai.com/docs/api-reference/completions](https://platform.openai.com/docs/api-reference/completions)
 */
class GptSDK {
  /**
   * Instance configuration. (private)
   *
   * **See [`GptSDKOptions`](./types.ts) interface comment for the full description...**
   */
  private _options!: GptSDKOptions;

  private _axios!: Axios;

  /**
   * Instance to interact with OpenAI `/v1/chat/completions` api
   *
   * @param options Configure the GptSDK instance. You will need to provide at least your api key.
   */
  constructor(options: GptSDKOptions) {
    // Check for missing options
    if (!options) throw new Error(GptMissingOptions);

    // Check for nullish apyKey
    if (!options.apiKey || typeof options.apiKey !== "string")
      throw new Error(`${GptInvalidApiKey} ${options.apiKey}`);

    this._options = options;

    // Fallback model to gpt-3.5-turbo if missing
    if (!options.defaultModel) {
      this._options.defaultModel = GptModels["gpt-3.5-turbo"];
      if (process.env["NODE_ENV"] === "development")
        console.info(
          `No model provided. Fallback to 'gpt-3.5-turbo'. (You can override this. This is only visible in development environment)`
        );
    }

    this._initAxiosInstance();
  }

  public async Chat(messages: GptMessage[], options?: GptChatOptions): Promise<GptResponse> {
    const body: Partial<GptChatRequest> | GptChatRequest = {
      model: options?.model || this._options.defaultModel,
      messages: messages
    }

    // Add or Override System message
    if (options?.systemMessage || this._options.defaultSystemMessage) {
      body.messages = [
        {
          role: 'system',
          content: (options?.systemMessage || this._options.defaultSystemMessage) as string
        },
        ...messages.filter(msg => msg.role !== "system")
      ]
    }

    // Setting optional parameters

    if (options?.temperature) body.temperature = options.temperature;
    if (options?.top_p) body.top_p = options.top_p;
    if (options?.n) body.n = options.n;
    if (options?.stop) body.stop = options.stop;
    if (options?.max_tokens) body.max_tokens = options.max_tokens;
    if (options?.presence_penalty) body.presence_penalty = options.presence_penalty;
    if (options?.frequency_penalty) body.frequency_penalty = options.frequency_penalty;
    if (options?.logit_bias) body.logit_bias = options.logit_bias;
    if (options?.user) body.user = options.user;

    try {
      const res = await this._axios.post(OpenAIChatCompletionApi, body).then(res => res.data).catch(err => {
        throw err;
      });

      return res;
    } catch (error: unknown) {
      throw new Error(`${error}`);
    }
  }

  /**
   * Update the axios instace headers Authorizazion Bearer with the new api key.  
   * The update will be avaliable from the next `chat(...)` call
   * @param apiKey 
   */
  public SetApiKey(apiKey: string) {
    this._axios.defaults.headers.common.Authorization = `Bearer ${apiKey}`
  }

  /**
   * Initialize the axios instance setting the header with the apiKey
   * @param apiKey 
   */
  private _initAxiosInstance(): void {
    this._axios = axios.create({
      headers: {
        'Authorization': `Bearer ${this._options.apiKey}`
      }
    })
  }

}

export default GptSDK;
