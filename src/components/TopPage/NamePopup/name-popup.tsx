import { useState } from 'react';
import styles from './name-popup.module.css';

interface NamePopups {
  playerName: string;
  setPlayerName: (value: string) => void;
  setShowLinks: (boolean: boolean) => void;
  setConformName: (boolean: boolean) => void;
  setIsNamePopUp: (boolean: boolean) => void;
  namePopUp: boolean;
}

export default function NamePopup({
  playerName,
  setPlayerName,
  setShowLinks,
  setConformName,
  namePopUp,
  setIsNamePopUp,
}: NamePopups) {
  const [rename, setRename] = useState(true);
  // const [createName, setCreateName] = useState(true);
  const [alertMessage, setAlertMessage] = useState('');

  const clickHandler = () => {
    if (rename && playerName) {
      setRename(false);
    } else if (!playerName) {
      setAlertMessage('ユーザー名が入力されていません。');
    } else {
      setRename(true);
    }
  };

  const reloadHandler = () => {
    // setCreateName(false);
    setIsNamePopUp(false);
    setShowLinks(true);
    setConformName(true);
    setRename(true);
  };

  return (
    <div
      className={namePopUp ? styles.userNamePage : styles.notUserNamePage}
      id="NamePopupPage"
    >
      <div className={styles.userNames}>
        {rename ? (
          <div className={styles.rename}>
            <div className={styles.userName}>
              <p>名前を決めよう！</p>
              <div className={styles.userInput}>
                <input
                  type="text"
                  name="userName"
                  placeholder="ユーザー名を入力してください(5文字まで)"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  maxLength={5}
                />

                <button onClick={clickHandler}>OK</button>
                <p className={styles.alert}>
                  {alertMessage ? `${alertMessage}` : ''}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.conformName}>
            <p>&quot; {playerName} &quot;さんでよろしいですか？</p>
            <div className={styles.decideBtn}>
              <button className={styles.returnBtn} onClick={clickHandler}>
                戻る
              </button>
              <button className={styles.OkBtn} onClick={reloadHandler}>
                確定
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
