import React, { ChangeEvent, useState } from 'react';
import styles from './Chat.module.css';
import { Members } from '@/types/session';

interface MessageProps {
  name: string;
  message: string;
}

interface ChatProps {
  yourInfo: Members;
  chatMessageArray: MessageProps[];
  chatHandler: () => void;
  isOpen: boolean;
}

const Chat = ({
  yourInfo,
  chatMessageArray,
  chatHandler,
  isOpen,
}: ChatProps) => {
  const [message, setMessage] = useState<string>('');

  const sendingHandler = async () => {
    if (message.trim() === '') {
      return;
    }

    const MessageArray: MessageProps = {
      name: yourInfo.name,
      message: message,
    };

    try {
      const response = await fetch('/api/pusher/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(MessageArray),
      });

      if (!response.ok) {
        throw new Error(`エラーが発生しました: ${response.statusText}`);
      }
    } catch (error) {
      console.error('メッセージ送信に失敗しました:', error);
    }
    setMessage('');
  };

  return (
    <div className={`${styles.chat_container} ${isOpen ? styles.open : ''}`}>
      <button className={styles.toggle_button} onClick={chatHandler}>
        チャット
      </button>
      <div className={styles.chat_box}>
        {chatMessageArray.map((messages, index) => (
          <div key={index} className={styles.message}>
            {messages.name === yourInfo.name ? (
              <p className={styles.user_name}>あなた</p>
            ) : (
              <p className={styles.user_name}>{messages.name}</p>
            )}
            <p className={styles.message_bubble}>{messages.message}</p>
          </div>
        ))}
      </div>
      <div className={styles.input_box}>
        <input
          type="text"
          value={message}
          placeholder="メッセージを入力"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setMessage(e.target.value)
          }
        />
        <button type="submit" onClick={sendingHandler}>
          送信
        </button>
      </div>
    </div>
  );
};

export default Chat;
