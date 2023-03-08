// eslint-disable-next-line @typescript-eslint/no-unused-vars
import DocGptChat from 'chat';
import { useCallback, useState } from 'react';

function AppStream() {
  const [message, setMessage] = useState('Waiting for you');
  const [system, setSystem] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [prompt, setPrompt] = useState('');
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(() => {
    const gpt = new DocGptChat({
      apiKey: apiKey,
      defaultSystemMessage: system,
    });
    setMessage('');
    gpt
      .ChatStream([
        {
          role: 'user',
          content: prompt,
        },
      ])
      .onMessage((message) => {
        setMessage((val) => val + message);
      });
  }, [apiKey, system, prompt]);

  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '100px 20vw',
          color: 'white',
        }}
      >
        <label>OpenAI Api Key</label>
        <input
          type="password"
          placeholder="Set your OpenAI Api Key (required)"
          onChange={(ev) => setApiKey(ev.target.value)}
          value={apiKey}
          style={{ outlineColor: 'red' }}
        />

        <label>System</label>
        <textarea
          placeholder="Set an optional system message to set the behaviour"
          onChange={(ev) => setSystem(ev.target.value)}
          value={system}
          style={{ outlineColor: 'orange' }}
        />

        <label>Propmt</label>
        <textarea
          placeholder='Write your prompt and click "Get a response"'
          onChange={(ev) => setPrompt(ev.target.value)}
          value={prompt}
          style={{ outline: 'dashed 1px #9f9f9f' }}
        />

        <button style={{ margin: '50px 100px' }} onClick={generate}>
          Get a response
        </button>
      </div>

      <p
        style={{
          color: error ? 'red' : 'white',
          textAlign: 'center',
          padding: '0 20vw',
          marginBottom: '35vh',
        }}
      >
        {error || message}
      </p>
    </>
  );
}

export default AppStream;
