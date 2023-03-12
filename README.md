# Doc GPT
#### Implement OpenAI APIs, with ease

**Doc GPT** is an open-source project that aims to provide clients and libraries to interact with OpenAI Apis.

> Actually, it's only avaliable the client for the new Chat api.  
*Further apis and implementations are work in progress.*

### Roadmap

Everything started with the new Chat Api Client, but other implementation are on their way...

*Here the actual work in progress*
- New React Component/Hook library for the Chat client

## Clients

Node.Js clients to interact with the apis from Typescript/Javascript projects.

#### Chat: `@doc-gpt/chat`

Typed client to interact with [OpenAI Chat API](https://platform.openai.com/docs/api-reference/chat/create).



*Install*
```bash
npm i @doc-gpt/chat
```
*Import*
```typescript
import DocGptChat from '@doc-gpt/chat';
```
*Underlay api*: `POST https://api.openai.com/v1/chat/completions` 

For more informations see the library [README.md](./packages/chat/README.md)



---

Copyright (c) 2023-present, Francesco Bellini
