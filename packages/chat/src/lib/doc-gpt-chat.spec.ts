import { GptInvalidApiKey, GptMissingOptions } from './messages/errors';
import DocGptChat from './doc-gpt-chat';

let TransformedStream;

if (typeof window === 'undefined') {
  // Se il test viene eseguito in ambiente Node.js, importa TransformedStream
  TransformedStream = import('stream/web').then(m => m.TransformStream);
} else {
  // Altrimenti, definisci una classe vuota al posto di TransformedStream
  TransformedStream = class {};
}

describe('GptSDK Class - Bad options', () => {
  it('Initialization without options should throw GptMissingOptions', () => {
    // Simulating pure js situation without typings so we can try pass no options
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(() => new (DocGptChat as any)()).toThrowError(GptMissingOptions);
  });

  it('Initialization with nullish api keys should throw GptInvalidApiKey', () => {
    const errorMessageRegex = new RegExp(`^${GptInvalidApiKey}`);
    expect(
      () =>
        new DocGptChat({
          apiKey: '',
        })
    ).toThrowError(errorMessageRegex);

    expect(
      () =>
        new DocGptChat({
          // Simulating pure js situation without typings
          apiKey: null as unknown as string, // force nullish value
        })
    ).toThrowError(errorMessageRegex);

    expect(
      () =>
        new DocGptChat({
          // Simulating pure js situation without typings
          apiKey: 0 as unknown as string, // force nullish value
        })
    ).toThrowError(errorMessageRegex);

    expect(
      () =>
        new DocGptChat({
          // Simulating pure js situation without typings
          apiKey: undefined as unknown as string, // force nullish value
        })
    ).toThrowError(errorMessageRegex);
  });
});

describe('GptSDK Class - Good options', () => {
  it('Initialization with minimal correct config', () => {
    const apiKey = 'sk-fake-api-key';
    expect(
      () =>
        new DocGptChat({
          apiKey,
        })
    );
  });
});
