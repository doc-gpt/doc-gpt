# Doc GPT - SDK

#### Typed SDKs for the OpenAI Apis

This library is made for ts/js developers who want to use the **OpenAI's Api** `/v1/chat/completion` with ease.


> This project is created and mantained by @doc-packages.  
> If you find a bug or have a suggestion, an Issue is very welcome!

_For more informations about the underlay api, please refer to [OpenAI Chat Api Docs](https://platform.openai.com/docs/api-reference/chat/create)_

> Note: OpenAI Chat Api is still in beta, and may change very quickly.
> If you notice some changes in the api, that i've not implemented, please open an issue or propose a PR.


# Install

The library is avaliable both on [NPM](https://www.npmjs.com/package/doc-gpt/chat) and [GitHub Packages](https://github.com/doc-gpt/doc-gpt/pkgs/npm/@doc-gpt/chat).

### Install from NPM

```
npm i @doc-gpt/chat
```

### Install from GitHub Packages

First of all, you need to add a `.npmrc` file, in the root of your project, with the following content:
```
@doc-packages:registry=https://npm.pkg.github.com
```

Then install the package (replace \<VERSION> with the version you need, or latest)
```
npm install  @doc-gpt/chat@<VERSION>
```


# Getting started

`DocGptChat` offers a simple api to interact with **OpenAI Chat Api**.

First of all [install](#install) the library.

Then you can start by importing the DocGptChat with:
```typescript
import { DocGptChat } from '@doc-gpt/chat';
```

You just need to configure the instance and start chatting with the methods avaliable:

- `Chat(messages, options)`
- `SimpleChat(messages, options)`
- Stream version of this methods are still to be done

> Note: If you use a static api key, it's better to use an environment variable.

For a simple example on a React app, see `App.tsx` from `/packages/examples` folder

#### Basic usage example:

If you just need the full response from the api, it's avaliable the `Chat` method.

```typescript
// Create the DocGptChat instance with just the api key
const gpt = new DocGptChat({
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

} catch (err) {
  // Handle Api errors
}
```

For the full structure of the response, see the interface `GptResponse`  
or the response example in the OpenAI docs at: [https://platform.openai.com/docs/api-reference/chat/create](https://platform.openai.com/docs/api-reference/chat/create)

#### Simple usage example:

If you just need the first message content from the response, it's avaliable the `SimpleChat` method, which wraps `Chat` with the same parameters and returns the first message string.

```typescript
// Create the DocGptChat instance with just the api key
const gpt = new DocGptChat({
  apiKey: OPENAI_API_KEY,
});

// ...

try {
  // Get the first choice message text from the api
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

#### Advanced usage example:

```typescript
// Create the DocGptChat instance with just the api key
const gpt = new DocGptChat({
  apiKey: OPENAI_API_KEY,
  defaultSystemMessage: 'You are ChatGPT and you are a helpfull assistant.', 
});

const previousMessages = [
  {
    role: 'user',
    content: 'Who are you?'
  },
  {
    role: 'assistant',
    content: `I am ChatGPT, a helpful assistant designed to interact with people and provide assistance with various topics in a conversational manner. How can I assist you today?`
  },
]

try {
  // Get the choices generated (3 expected)
  const { choices } = await gpt.Chat([
    ...previousMessages,
    {
      role: 'user',
      content: 'How can i install @doc-gpt/chat from npm?',
    },
  ], {
    // Automatically override system role message
    max_tokens: 512, // Limit the number of max tokens
    stop: '\n\n', // Stopping when model produce '\n\n'
    n: 3, // Number of choices the model will generate
    user: userUid // for security. let OpenAI check for abuses from users
  });

  // Get all the content from the messages
  const messages = choices.map(choice => choice.message.content);

  console.log(messages);
  // Expect something like
  // [
  //   'To install `@doc-gpt/chat`...', 
  //   'To install the @doc-gpt/chat...',
  //   'To install @doc-gpt/chat...'
  // ]  
    
} catch (err) {
  // Handle Api errors
}
```

## SDK Utils

#### Setting a default system message:

This will setup a default first message sent to the api, with role "system", in order to guide the behaviour of the model.
_It's possibile to override this in the `options.systemMessage` of each single Chat request_
```typescript
const gpt = new DocGptChat({
  apiKey: OPENAI_API_KEY,
  defaultSystemMessage: 'Your name is DocGptChat. You are a helpful assistant.',
});
// Chat...
```

> Note: This is added as first message only if the `messages` list has no system message (when calling the chat methods)

#### Setting a default model:

This will setup a default model to use for the requests.  
Default is `gpt-3.5-turbo`, *so if you need that one, you don't need to set this*.
_It's possibile to override this in the `options.model` of each single Chat request_

```typescript
const gpt = new DocGptChat({
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


#### Chat Options
All the avaliable options in the chat methods:

```typescript
interface GptChatOptions {
  // Overrides the default model (default gpt-3.5-turbo or the one set in the instance options)
  model?: GptModel;
  // Override the default system message and remove any system message from the "messages"
  systemMessage?: string;

  // Api Options

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
```
For the description of the properties, see the interface in `types.ts` (which has comments from the docs) or see [https://platform.openai.com/docs/api-reference/chat/create](https://platform.openai.com/docs/api-reference/chat/create).


All the avaliable message roles:
```ts
// Message Roles
type GptRole = 'system' | 'user' | 'assistant';
```

Chat Message:
```ts
// Chat Message
interface GptMessage {
  content: string;
  role?: GptRole;
}
```

Api Response:
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
