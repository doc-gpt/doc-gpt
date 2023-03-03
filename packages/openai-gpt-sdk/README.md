# OpenAI GPT SDK (Unofficial)

This library is made for developers who want to use the OpenAI's Api `/v1/chat/completion`.

# Examples

#### Basic usage example:

```typescript
const sdk = new GptSDK({
  apiKey: 'sk-**************************************',
});

sdk
  .Chat([
    {
      role: 'user',
      content: prompt,
    },
  ])
  .then((res) => console.log(res.choices[0].message.content));
```

#### Setting a default system message:

This will setup a default first message sent to the api, with role "system" in order to guide the behaviour of the model.

```typescript
const sdk = new GptSDK({
  apiKey: 'sk-**************************************',
  defaultSystemMessage: system,
});

// Chat...
```

#### Setting a default model:

This will setup a default model to use for the requests. Default is `gpt-3.5-turbo`.
*It's possibile to override this in the `options` of each single Chat request*

```typescript
const sdk = new GptSDK({
  apiKey: 'sk-**************************************',
  defaultModel: 'gpt-3.5-turbo-0301', // or using the constant, like `GptModels["gpt-3.5-turbo"]`
});

// Chat...
```
