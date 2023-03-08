import axios, { Axios } from 'axios';
import { TextLineStream } from './classes/TextLineStream';
import { OpenAIChatCompletionApi } from './config';
import { GptInvalidApiKey, GptMissingOptions } from './messages/errors';
import { GptStreamHandler } from './classes/GptStreamHandler';
import {
  GptChatOptions,
  GptChatRequest,
  GptMessage,
  GptModels,
  GptResponse,
  GptSDKOptions,
  GptStreamResponse,
} from './types';

/**
 * --------------------
 * -- Doc GPT - Chat --
 * --------------------
 * -- Version: 1.1.0 --
 * --------------------
 *
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
export class DocGptChat {
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
    if (!options.apiKey || typeof options.apiKey !== 'string')
      throw new Error(`${GptInvalidApiKey} ${options.apiKey}`);

    this._options = options;

    // Fallback model to gpt-3.5-turbo if missing
    if (!options.defaultModel) {
      this._options.defaultModel = GptModels['gpt-3.5-turbo'];
      if (process.env['NODE_ENV'] === 'development')
        console.info(
          `No model provided. Fallback to 'gpt-3.5-turbo'. (You can override this. This is only visible in development environment)`
        );
    }

    this._initAxiosInstance();
  }

  /**
   * Make a `/v1/chat/completion` request and get a full response
   * @param messages The messages to sent in the request.
   * You can have messages with roles "system" | "user" | "assistant".
   * *Note: if you use `options.systemMessage`, all of the "system" messages from this list, will be ignored*
   * @param options With the options you can set request paramers and you can override the system message and the model used
   * @returns A full response. See `GptResponse` interface for the full structure.
   * See [https://platform.openai.com/docs/api-reference/chat/create](https://platform.openai.com/docs/api-reference/chat/create) for more details about the response
   */
  public async Chat(
    messages: GptMessage[],
    options?: GptChatOptions
  ): Promise<GptResponse> {
    const body: Partial<GptChatRequest> | GptChatRequest = {
      model: options?.model || this._options.defaultModel,
      messages: messages,
    };

    // Add or Override System message
    if (
      options?.systemMessage ||
      (this._options.defaultSystemMessage &&
        !messages.find((msg) => msg.role === 'system'))
    ) {
      // With systemMessage option in Chat call, it's override an eventual system messages from messages

      // The default system message is used only if messages has no system message.
      body.messages = [
        {
          role: 'system',
          content: (options?.systemMessage ||
            this._options.defaultSystemMessage) as string,
        },
        ...messages.filter((msg) => msg.role !== 'system'),
      ];
    }
    // If message

    // Setting optional parameters

    if (options?.temperature) body.temperature = options.temperature;
    if (options?.top_p) body.top_p = options.top_p;
    if (options?.n) body.n = options.n;
    if (options?.stop) body.stop = options.stop;
    if (options?.max_tokens) body.max_tokens = options.max_tokens;
    if (options?.presence_penalty)
      body.presence_penalty = options.presence_penalty;
    if (options?.frequency_penalty)
      body.frequency_penalty = options.frequency_penalty;
    if (options?.logit_bias) body.logit_bias = options.logit_bias;
    if (options?.user) body.user = options.user;

    try {
      const res = await this._axios
        .post(OpenAIChatCompletionApi, body)
        .then((res) => res.data)
        .catch((err) => {
          throw err;
        });

      return res;
    } catch (error: unknown) {
      throw new Error(`${error}`);
    }
  }

  /**
  * Make a `/v1/chat/completion` request in stream mode and consume the events.  
  * 
  * You can use the methods `onMessage`, `onDone` and `onError` to register your callback and consume the response stream.
  * 
  * Example: 
  * ```
  * let message = '';
  * gpt.ChatStream([{role: 'user', content: prompt,}])
      .onMessage((messageDelta, fullResChunk) => {
        message = val + messageDelta;
      });
  * ```
  * @param messages The messages to sent in the request.
  * You can have messages with roles "system" | "user" | "assistant".
  * *Note: if you use `options.systemMessage`, all of the "system" messages from this list, will be ignored*
  * @param options With the options you can set request paramers and you can override the system message and the model used
  * @param onMessageDelta Callback used when a new chunk from the stream is received. The first parameter is the delta of the first choice message, the second is the full response of the chunk, with all the information and choices included
  * @param onDone Callback used when the api stream ends. It provides the stop_reason as parameter. (Note: IT'S NOT CALLED WITH ERRORS)
  * @param onError Callback used when the api gives an error, or something else goes wrong...
  * @returns A GptStreamHandler. You can use the methods `onMessage`, `onDone` and `onError` to register your callback and consume the response stream.
  * See [https://platform.openai.com/docs/api-reference/chat/create](https://platform.openai.com/docs/api-reference/chat/create) for more details about the response (Note that stream response has different Choices structure [`delta` instead of `message`])
  */
  public ChatStream(
    messages: GptMessage[],
    options?: GptChatOptions,
    onMessageDelta?: (firstMessageDelta: string, fullChunk: GptStreamResponse) => void,
    onDone?: (stop_reason: string) => void,
    onError?: (err: string | Error) => void,
  ): GptStreamHandler {
    const body: Partial<GptChatRequest> | GptChatRequest = {
      model: options?.model || this._options.defaultModel,
      messages: messages,
    };

    // Add or Override System message
    if (
      options?.systemMessage ||
      (this._options.defaultSystemMessage &&
        !messages.find((msg) => msg.role === 'system'))
    ) {
      // With systemMessage option in Chat call, it's override an eventual system messages from messages

      // The default system message is used only if messages has no system message.
      body.messages = [
        {
          role: 'system',
          content: (options?.systemMessage ||
            this._options.defaultSystemMessage) as string,
        },
        ...messages.filter((msg) => msg.role !== 'system'),
      ];
    }
    // If message

    // Setting optional parameters

    if (options?.temperature) body.temperature = options.temperature;
    if (options?.top_p) body.top_p = options.top_p;
    if (options?.n) body.n = options.n;
    if (options?.stop) body.stop = options.stop;
    if (options?.max_tokens) body.max_tokens = options.max_tokens;
    if (options?.presence_penalty)
      body.presence_penalty = options.presence_penalty;
    if (options?.frequency_penalty)
      body.frequency_penalty = options.frequency_penalty;
    if (options?.logit_bias) body.logit_bias = options.logit_bias;
    if (options?.user) body.user = options.user;

    try {
      const gptStreamHandler = new GptStreamHandler();


      // Get the stream from the api
      fetch(OpenAIChatCompletionApi, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: "Bearer " + this._options.apiKey,
        },
        body: JSON.stringify({
          ...body,
          stream: true,
        }),
      }).then(async res => {

        // Check if response is ok
        if (!res.ok) {
          const json = await res.json()
          if (json.error) {
            // Send api error
            if (onError) onError(json.error);
            gptStreamHandler._notifyError(json.error);
            // throw new Error(`API error ${json.error.code}`);
          } else {
            // Send unknown error
            const err = new Error(`Unknown API response.`);
            if (onError) onError(err);
            gptStreamHandler._notifyError(err);
            // throw err;
          }
          return;
        }

        for await (const json of readStreamAsEvents(res.body as ReadableStream<Uint8Array>)) {
          console.log(json)
          const { delta, finish_reason } = json.choices[0];
          const { content } = delta;
          if (finish_reason) {
            if (onDone) onDone(finish_reason)
            gptStreamHandler._notifyDone(finish_reason)
            break;
          }
          if (content) {
            console.log(content);
            if (onMessageDelta) onMessageDelta(content, json)
            gptStreamHandler._notifyMessage(content, json)
          } else {
            if (onMessageDelta) onMessageDelta('', json)
            gptStreamHandler._notifyMessage('', json)
          }
        }

      });

      return gptStreamHandler;
    } catch (error: unknown) {
      throw new Error(`${error}`);
    }
  }

  /**
   * Make a Chat/Completion request and get the first message content.
   * This method just wraps `Chat` and returns `res.choices[0].message.content`.  
   * 
   * Example:
   * ```
      const message = await gpt.SimpleChat([{role: 'user', content: prompt}]);
    ```
   * @param messages The messages to sent in the request.
   * You can have messages with roles "system" | "user" | "assistant".
   * *Note: if you use `options.systemMessage`, all of the "system" messages from this list, will be ignored*
   * @param options With the options you can set request paramers and you can override the system message and the model used
   * @returns The first message content from the Chat response.
   * See [https://platform.openai.com/docs/api-reference/chat/create](https://platform.openai.com/docs/api-reference/chat/create) for more details about the response
   */
  public async SimpleChat(
    messages: GptMessage[],
    options?: GptChatOptions
  ): Promise<string> {
    try {
      const res = await this.Chat(messages, options);
      const firstMessage = res.choices[0].message.content;
      return firstMessage;
    } finally {
      // Just let Chat(...) throw Error, eventually
    }
  }

  /**
   * Update the axios instace headers Authorizazion Bearer with the new api key.
   * The update will be avaliable from the next `chat(...)` call
   * @param apiKey
   */
  public SetApiKey(apiKey: string) {
    this._axios.defaults.headers.common.Authorization = `Bearer ${apiKey}`;
  }

  /**
   * Initialize the axios instance setting the header with the apiKey
   * @param apiKey
   */
  private _initAxiosInstance(): void {
    this._axios = axios.create({
      headers: {
        Authorization: `Bearer ${this._options.apiKey}`,
      },
    });
  }
}

async function* readStreamAsEvents(stream: ReadableStream<Uint8Array>): AsyncGenerator<GptStreamResponse> {
  for await (const text of readStreamAsTextLines(stream)) {
    if (!text) continue;
    if (text === "data: [DONE]") break;
    if (!text.startsWith("data: ")) throw new Error("Unexpected text: " + text);
    const json = JSON.parse(text.slice(6));
    yield json;
  }
}

async function* readStreamAsTextLines(stream: ReadableStream<Uint8Array>): AsyncGenerator<string> {
  const linesReader = stream
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(new TextLineStream() as ReadableWritablePair<string | undefined, string>)
    .getReader();
  while (true) {
    const { value, done } = await linesReader.read();
    if (done) break;
    yield value as string;
  }
}

export default DocGptChat;

