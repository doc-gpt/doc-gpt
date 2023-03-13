# Doc GPT - Chat SDK

#### Typed SDK for the OpenAI Chat Api

Use the new **OpenAI Chat Api** `/v1/chat/completion` with ease.

***Stream request are supported***

> Note: _OpenAI Chat Api is still in beta, and may change very quickly_.
> If you notice some changes in the api that has not been implemented, please open an issue or propose a PR.

_For more informations about the underlay api, please refer to [OpenAI Chat Api Docs](https://platform.openai.com/docs/api-reference/chat/create)_

# Install

The library is avaliable both on [NPM](https://www.npmjs.com/package/doc-gpt/chat) and [GitHub Packages](https://github.com/doc-gpt/doc-gpt/pkgs/npm/@doc-gpt/chat).

#### Install from NPM

```bash
npm i @doc-gpt/chat
```

#### Install from GitHub Packages

First of all, you need to add a `.npmrc` file, in the root of your project, with the following content:

```npmrc
@doc-gpt:registry=https://npm.pkg.github.com
```

Then install the package

```bash
npm install  @doc-gpt/chat@1.1.0
```

# Getting started

`DocGptChat` offers a simple api to interact with **OpenAI Chat Api**.
You just need to configure the instance and start chatting with the methods avaliable:

- `Chat(messages, options)`
- `SimpleChat(messages, options)`
- Stream version of this methods are still to be done

> Note: If you use a static api key, it's better to use an environment variable.

#### Import

```typescript
import DocGptChat from '@doc-gpt/chat';
```

#### Configure the instance

```typescript
const gpt = new DocGptChat({
  // Required,
  apiKey: OPENAI_API_KEY, // If static, it's highly recommended to use environment variable
  // Optional
  defaultModel: GptModels['gpt-3.5-turbo-0301'], // (default gpt-3.5-turbo)
  // Optional
  defaultSystemMessage: 'You are ChatGPT...',
});
```

#### Simple usage example:

If you just need the first message content from the response, it's avaliable the `SimpleChat` method, which wraps `Chat` with the same parameters and returns the first message string.

```typescript
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

#### Basic usage example:

If you just need the full response from the api, it's avaliable the `Chat` method.

```typescript
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
} catch (err) {
  // Handle Api errors
}
```

#### Stream usage example:

If you want to use stream response, you can use `ChatStream` method.

```typescript
// Message to increment
let message = '';

// Get a full response from the api
gpt
  .ChatStream([
    {
      role: 'user',
      content: prompt,
    },
  ])
  .onMessage((messageDelta, fullResponse) => {
    // Increment the response message
    message = message + messageDelta;
  })
  .onDone(() => {
    // Use the full message
    console.log(message);
  })
  .onError((err) => {
    // Handle errors
  });
```

## Methods

#### Chat

```typescript
  // Get a full response
  public async Chat(
    messages: GptMessage[],
    options?: GptChatOptions
  ): Promise<GptResponse>

```

#### SimpleChat

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
  message: GptMessage;
  index: number;
  finish_reason: string;
}

// Response Choice structure with stream mode
export interface GptResponseStreamChoices {
  delta: GptMessage; // delta instead of message
  index: number;
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
_If a new model is release, and you want to try it, you can still pass any string to `model` option_.

```ts
export const GptModels = {
  'gpt-3.5-turbo': 'gpt-3.5-turbo' as GptModel,
  'gpt-3.5-turbo-0301': 'gpt-3.5-turbo-0301' as GptModel,
};

// Example
const model = GptModels['gpt-3.5-turbo-0301'];
```

## Dependencies

##### Axios

This library depends on `axios` library.

[See axios-http website](https://axios-http.com/)  
[See axios on NPM](https://www.npmjs.com/package/axios)  
[See axios/axios repository](https://github.com/axios/axios)

##### TextLineStream class

This library has copied the class TextLineStream from [denoland/deno_std](https://github.com/denoland/deno_std/blob/main/streams/text_line_stream.ts) (MIT) project.

[See Deno website](https://deno.land/)  
[See denoland/deno_std repository](https://github.com/denoland/deno_std)  


---

Take a look at the file [THIRD_PARTY_LICENCES](./THIRD_PARTY_LICENCES) for the full licences.

### Notes

> This project is created and mantained by @doc-packages.  
> If you find a bug or have a suggestion, an Issue is very welcome!

Copyright (c) 2023-present, Francesco Bellini
