import styles from './chat-react.module.scss';

/* eslint-disable-next-line */
export interface ChatReactProps {}

export function ChatReact(props: ChatReactProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to ChatReact!</h1>
    </div>
  );
}

export default ChatReact;
