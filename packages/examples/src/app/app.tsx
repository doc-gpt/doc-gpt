// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useCallback, useState } from 'react';
import GptSDK from 'packages/openai-gpt-sdk/src/lib/openai-gpt-sdk';

export function App() {
	const [message, setMessage] = useState('Waiting for you');
	const [system, setSystem] = useState('');
	const [apiKey, setApiKey] = useState('');
	const [prompt, setPrompt] = useState('');

	const generate = useCallback(() => {
		const sdk = new GptSDK({
			apiKey: apiKey,
			defaultSystemMessage: system,
		});

		sdk
			.Chat([
				{
					role: 'user',
					content: prompt,
				},
			])
			.then((res) => setMessage(res.choices[0].message.content));
	}, [apiKey, prompt, system, setMessage]);

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
				<label>ApiKey</label>
				<input
					type="password"
          placeholder='Set your OpenAI Api Key (required)'
					onChange={(ev) => setApiKey(ev.target.value)}
					value={apiKey}
          style={{outlineColor: 'red'}}
				/>

				<label>System</label>
				<textarea
          placeholder='Set an optional system message to set the behaviour'
					onChange={(ev) => setSystem(ev.target.value)}
					value={system}
          style={{outlineColor: 'orange'}}
				/>

				<label>Propmt</label>
				<textarea
          placeholder='Write your prompt and click "Get a response"'
					onChange={(ev) => setPrompt(ev.target.value)}
					value={prompt}
          style={{outline: 'dashed 1px #9f9f9f'}}
				/>

				<button style={{ margin: '50px 100px' }} onClick={generate}>
					Get a response
				</button>
			</div>

			<p style={{ color: 'white', textAlign: 'center', padding: '0 20vw', marginBottom: '35vh' }}>
				{message}
			</p>
		</>
	);
}

export default App;
