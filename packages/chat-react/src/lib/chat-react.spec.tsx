import { render } from '@testing-library/react';

import ChatReact from './chat-react';

describe('ChatReact', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ChatReact />);
    expect(baseElement).toBeTruthy();
  });
});
