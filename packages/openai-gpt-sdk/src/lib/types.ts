/**
 * The configuration for the GptSDK instance.  
 * *If you don't have an OpenAI Api Key, see https://platform.openai.com/account/api-keys to find or create yours*
 *
 * **apiKey**: Your OpenAI api key (required)
 *
 * **model**: The default model used by the instance (optional)  
 * *(you can still override this in each single request)*.  
 * By default it's used `gpt-3.5-turbo`.
 *
 * **chatDefaultOptions**: Setup the default chat options (optional)
 */
export interface GptSDKOptions {
  apiKey: string;
  defaultModel?: GptModel;
  defaultSystemMessage?: string;
}

/**
 * The configuration for the chat.
 * 
*
* **systemMessage**: Automatically set or override the first 'system' message sent in the request (optional)  
* Quoting the OpenAI docs:  
* `the system message helps set the behavior of the assistant`   
* *It's very powerfull, but it will count as tokens, so choose well and be aware :)*
* 
 * From here, descriptions are from [openai docs](https://platform.openai.com/docs/api-reference/chat/create)
 * 
 * **model**:  
 * ID of the model to use. Currently, only gpt-3.5-turbo and gpt-3.5-turbo-0301 are supported.
 * 
 * **temperature**:  
 * What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic.  
 * We generally recommend altering this or top_p but not both.
 *
 * **top_p**:  
 * An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered.  
 * We generally recommend altering this or temperature but not both.
 * 
 * **n**:  
 * How many chat completion choices to generate for each input message.
 * 
 * **stop**:  
 * Up to 4 sequences where the API will stop generating further tokens.
 * 
 * **max_tokens**:  
 * The maximum number of tokens allowed for the generated answer. By default, the number of tokens the model can return will be (4096 - prompt tokens).
 * 
 * **presence_penalty**:  
 * Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.  
 * [See more information about frequency and presence penalties](https://platform.openai.com/docs/api-reference/parameter-details).
 * 
 * **frequency_penalty**:  
 * Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.  
 * [See more information about frequency and presence penalties](https://platform.openai.com/docs/api-reference/parameter-details).
 * 
 * **logit_bias**:  
 * Modify the likelihood of specified tokens appearing in the completion.
 * 
 * Accepts a json object that maps tokens (specified by their token ID in the tokenizer) to an associated bias value from -100 to 100.  
 * Mathematically, the bias is added to the logits generated by the model prior to sampling.  
 * The exact effect will vary per model, but values between -1 and 1 should decrease or increase likelihood of selection; values like -100 or 100 should result in a ban or exclusive selection of the relevant token.  
 * 
 * **user**:  
 * A unique identifier representing your end-user, which can help OpenAI to monitor and detect abuse. [Learn more](https://platform.openai.com/docs/guides/safety-best-practices/end-user-ids).
 * 
 * For more info about the request, see [https://platform.openai.com/docs/api-reference/chat/create](https://platform.openai.com/docs/api-reference/chat/create)
 */
export interface GptChatOptions {
  model?: GptModel;
  systemMessage?: string;
  temperature?: number;
  top_p?: number;
  n?: number;
  stop?: string | string[];
  max_tokens: number;
  presence_penalty?: number;
  frequency_penalty?: number;
  logit_bias?: {
    [key: string]: number;
  };
  user?: string;
}

export interface GptChatRequest {
  model: GptModel;
  messages: GptMessage[];
  temperature?: number;
  top_p?: number;
  stream?: boolean;
  n?: number;
  stop?: string | string[];
  max_tokens: number;
  presence_penalty?: number;
  frequency_penalty?: number;
  logit_bias?: {
    [key: string]: number;
  };
  user?: string;
}

/**
 * A Chat Message.
 * 
 * **message**: The content of the message (required)  
 * 
 * **role**: The message role
 */
export interface GptMessage {
  content: string;
  role?: GptRole;
}

/**
 * 
 */
export interface GptResponse {
  id: string;
  object: string;
  created: number;
  choices: GptResponseChoices[];
  usage: GetResponceUsage;
}

export interface GptResponseChoices {
  index: number;
  message: {
    role: string;
    content: string;
  };
  finish_reason: string;
}

export interface GetResponceUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

export type GptRole = 'system' | 'user' | 'assistant';

/**
 * Supported models for the api (with support for any string in case of last-moment new models you may want to try)
 */
export type GptModel = "gpt-3.5-turbo" | "gpt-3.5-turbo-0301" | string;

/**
 * Map of supported models for the api
 */
export const GptModels = {
  "gpt-3.5-turbo": "gpt-3.5-turbo" as GptModel,
  "gpt-3.5-turbo-0301": "gpt-3.5-turbo-0301" as GptModel,
};
