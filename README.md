# GPT SDK
#### This is an *unofficial* SDK for OpenAI Chat Api

This library is made for ts/js developers who want to use the **OpenAI's Api** `/v1/chat/completion` with easy.

> This project is created and mantained by @doc-packages.  
> If you find a bug or have a suggestion, an Issue is very welcome!

# Getting started

`GptSDK` offers a simple api to interact with **OpenAI Chat Api**. 
You just need to configure the instance and start chatting with the methods avaliable
`Chat(messages, options)`
`SimpleChat(messages, options)`


> Note: If you use a static api key, it's better to use an environment variable. 

#### Basic usage example:
If you just need the full response from the api, it's avaliable the `Chat` method.  
```typescript
// Create the GptSDK instance with just the api key
const gpt = new GptSDK({
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
} catch(err) {
    // Handle Api errors
}

```
For the full structure of the response, see the interface `GptResponse`  
or the response example in the OpenAI docs at: [https://platform.openai.com/docs/api-reference/chat/create](https://platform.openai.com/docs/api-reference/chat/create)

#### Simple usage example:
If you just need the first message content from the response, it's avaliable the `SimpleChat` method, which wraps `Chat` with the same parameters and returns the first message string.
```typescript
// Create the GptSDK instance with just the api key
const gpt = new GptSDK({
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
} catch(err) {
    // Handle Api errors
}

```

#### Setting a default system message:

This will setup a default first message sent to the api, with role "system" in order to guide the behaviour of the model.


```typescript
const gpt = new GptSDK({
  apiKey: OPENAI_API_KEY,
  defaultSystemMessage: system,
});
// Chat...
```
  > Note: This is added as first message only if the `messages` list has no system message

#### Setting a default model:

This will setup a default model to use for the requests. Default is `gpt-3.5-turbo`.
*It's possibile to override this in the `options` of each single Chat request*

```typescript
const gpt = new GptSDK({
  apiKey: OPENAI_API_KEY,
  defaultModel: 'gpt-3.5-turbo-0301', // or using the constant, like `GptModels["gpt-3.5-turbo"]`
});
// Chat...
```
