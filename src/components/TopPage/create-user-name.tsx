import { useState } from 'react';
import styles from './create-user-name.module.css';

export default function CreateUserName() {
  const [createName, setCreateName] = useState(true);
  const [conformName, setConformName] = useState(false);
  const [name, setName] = useState('');

  function nameClickHandler() {
    if (createName) {
      const timer1 = setTimeout(() => {
        setCreateName(false);
        const timer2 = setTimeout(() => {
          setConformName(true);
        }, 600);
        return () => clearTimeout(timer2);
      }, 600);
      return () => clearTimeout(timer1);
    }
  }

  function closeHandler() {
    if (conformName) {
      setConformName(false);
    }
  }
  return (
    <>
      <div className={conformName ? styles.conformName : styles.notConformName}>
        <div className={styles.userNames}>
          <p>{name}さんでいいですね？</p>
          <button id="button" onClick={closeHandler}>
            確定
          </button>
        </div>
      </div>

      <div
        className={createName ? styles.userNamePage : styles.notUserNamePage}
      >
        <div className={styles.userName}>
          <p>名前を決めよう！</p>
          <div className={styles.userInput}>
            <input
              type="text"
              name="userName"
              placeholder="&nbsp;&nbsp;ユーザー名を入力してください..."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button onClick={nameClickHandler}>OK</button>
          </div>
        </div>
      </div>
    </>
  );
}
