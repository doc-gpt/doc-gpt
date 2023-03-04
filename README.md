# GPT Chat SDK

#### This is an _unofficial_ SDK for the OpenAI Chat Api

This library is made for ts/js developers who want to use the **OpenAI's Api** `/v1/chat/completion` with ease.

_For more informations about the underlay api, please refer to [OpenAI Chat Api Docs](https://platform.openai.com/docs/api-reference/chat/create)_

> This project is created and mantained by @doc-packages.  
> If you find a bug or have a suggestion, an Issue is very welcome!

> Note. OpenAI Chat Api is still in beta, and may change very quickly.
> If you notice some changes in the api that i've not implemented, please open an issue or propose a PR.


# Getting started

`GptChatSDK` offers a simple api to interact with **OpenAI Chat Api**.
You just need to configure the instance and start chatting with the methods avaliable:

- `Chat(messages, options)`
- `SimpleChat(messages, options)`
- Stream version of this methods are still to be done

> Note: If you use a static api key, it's better to use an environment variable.

#### Basic usage example:

If you just need the full response from the api, it's avaliable the `Chat` method.

```typescript
// Create the GptChatSDK instance with just the api key
const gpt = new GptChatSDK({
  apiKey: OPENAI_API_KEY,
});

// ...

try {
  // Get a full response from the api
  const res = await gpt.Chat([
    {
      role: 'user',
      content: prompt,
    },
  ]);

  // Handle the response

  // For example:
  // Get the first message object
  const firstMessage = res.choices[0].message;

  // For the full structure of the response, see the interface
  // or the response example in the OpenAI docs at:
  // https://platform.openai.com/docs/api-reference/chat/create
} catch (err) {
  // Handle Api errors
}
```

For the full structure of the response, see the interface `GptResponse`  
or the response example in the OpenAI docs at: [https://platform.openai.com/docs/api-reference/chat/create](https://platform.openai.com/docs/api-reference/chat/create)

#### Simple usage example:

If you just need the first message content from the response, it's avaliable the `SimpleChat` method, which wraps `Chat` with the same parameters and returns the first message string.

```typescript
// Create the GptChatSDK instance with just the api key
const gpt = new GptChatSDK({
  apiKey: OPENAI_API_KEY,
});

// ...

try {
  // Get a full response from the api
  const message = await gpt.SimpleChat([
    {
      role: 'user',
      content: prompt,
    },
  ]);

  // Use the message
} catch (err) {
  // Handle Api errors
}
```

#### Setting a default system message:

This will setup a default first message sent to the api, with role "system" in order to guide the behaviour of the model.

```typescript
const gpt = new GptChatSDK({
  apiKey: OPENAI_API_KEY,
  defaultSystemMessage: system,
});
// Chat...
```

> Note: This is added as first message only if the `messages` list has no system message

#### Setting a default model:

This will setup a default model to use for the requests.  
Default is `gpt-3.5-turbo`.
_It's possibile to override this in the `options` of each single Chat request_

```typescript
const gpt = new GptChatSDK({
  apiKey: OPENAI_API_KEY,
  defaultModel: 'gpt-3.5-turbo-0301', // or using the constant, like `GptModels["gpt-3.5-turbo"]`
});
// Chat...
```

# Methods

### Chat

```typescript
  // Get a full response
  public async Chat(
    messages: GptMessage[],
    options?: GptChatOptions
  ): Promise<GptResponse>

```

### SimpleChat

```typescript
  // Get the first choice message content.
  public async SimpleChat(
    messages: GptMessage[],
    options?: GptChatOptions
  ): Promise<GptResponse>
```

## Types

All the avaliable message roles
```ts
// Message Roles
type GptRole = 'system' | 'user' | 'assistant';
```

Chat Message 
```ts
// Chat Message
interface GptMessage {
  content: string;
  role?: GptRole;
}
```

Response
```ts
// OpenAI `/v1/chat/completion` api response
interface GptResponse {
  id: string;
  object: string;
  created: number;
  choices: GptResponseChoices[];
  usage: GetResponceUsage;
}

// Response Choice
interface GptResponseChoices {
  index: number;
  message: GptMessage;
  finish_reason: string;
}

// Response Usage
interface GetResponceUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}
```

## Utils

There is a const named `GptModels` you can import in order to refer to avaliable models.
*If a new model is release, and you want to try it, you can still pass any string to `model` option*.
```ts
export const GptModels = {
  'gpt-3.5-turbo': 'gpt-3.5-turbo' as GptModel,
  'gpt-3.5-turbo-0301': 'gpt-3.5-turbo-0301' as GptModel,
};

// Example 
const model = GptModels['gpt-3.5-turbo-0301'];
```



# Dependencies

This library depends on `axios` library.

[See axios-http website](https://axios-http.com/)
[See axios on NPM](https://www.npmjs.com/package/axios)
[See axios/axios repository](https://github.com/axios/axios)

Take a look at the file [THIRD_PARTY_LICENCES](./THIRD_PARTY_LICENCES) for the full licences.

---



Copyright (c) 2023-present, Francesco Bellini
