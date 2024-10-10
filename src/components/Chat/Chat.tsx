import React, { ChangeEvent, useState } from 'react';
import styles from './Chat.module.css';
const Chat = () => {
  const [message, setMessage] = useState<string>();
  console.log(message);
  // function handleChange(e: ChangeEvent<HTMLInputElement>) {
  //   setMessage(e.target.value);
  // }
  return (
    <div className={styles.body}>
      <div className={styles.chat_container}>
        <div className={styles.chat_box}>
          <div className={styles.message}>
            <p className={styles.user_name}>ユーザ1</p>
            <p className={styles.message_bubble}>メッセージ内容</p>
          </div>

          <div className={styles.message}>
            <p className={styles.user_name}>自分</p>
            <p className={styles.message_bubble}>メッセージ内容</p>
          </div>
        </div>
        <div className={styles.input_box}>
          <input
            type="text"
            value={message}
            placeholder="メッセージを入力"
            // onChange={handleChange}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setMessage(e.target.value)
            }
          />
          <button type="submit">送信</button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
