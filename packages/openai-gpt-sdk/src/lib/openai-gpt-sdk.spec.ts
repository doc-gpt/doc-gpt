import { GptInvalidApiKey, GptMissingOptions } from './errors';
import GptSDK from './openai-gpt-sdk';

describe('openaiGptSdk', () => {
  it('Initialization without options should throw GptMissingOptions', () => {
    // Simulating pure js situation without typings so we can try pass no options
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(() => new (GptSDK as any)()).toThrowError(GptMissingOptions);
  });

  it('Initialization with nullish api keys should throw GptInvalidApiKey', () => {
    const errorMessageRegex = new RegExp(`^${GptInvalidApiKey}`);
    expect(
      () =>
        new GptSDK({
          apiKey: '',
        })
    ).toThrowError(errorMessageRegex);

    expect(
      () =>
        new GptSDK({
          // Simulating pure js situation without typings
          apiKey: null as unknown as string, // force nullish value
        })
    ).toThrowError(errorMessageRegex);

    expect(
      () =>
        new GptSDK({
          // Simulating pure js situation without typings
          apiKey: 0 as unknown as string, // force nullish value
        })
    ).toThrowError(errorMessageRegex);

    expect(
      () =>
        new GptSDK({
          // Simulating pure js situation without typings
          apiKey: undefined as unknown as string, // force nullish value
        })
    ).toThrowError(errorMessageRegex);
  });
});
