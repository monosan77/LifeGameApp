import { useState } from 'react';
import styles from './name-popup.module.css';

interface NamePopups {
  createName: boolean;
  name: string;
  showLinks: boolean;
  userName: boolean;
  setUserName: (boolean: boolean) => void;
  setName: (value: string) => void;
  setCreateName: (boolean: boolean) => void;
  setShowLinks: (boolean: boolean) => void;
}

export default function NamePopup({
  createName,
  name,
  userName,
  setUserName,
  setName,
  setCreateName,
  setShowLinks,
  showLinks,
}: NamePopups) {
  const [rename, setRename] = useState(true);
  const [conformName, setConformName] = useState(false);

  const clickHandler = () => {
    if (rename && name) {
      setRename(false);
    } else if (!name) {
      alert('ユーザー名が入力されていません。');
    } else {
      setRename(true);
    }

    if (conformName) {
      setConformName(true);
    } else {
      setConformName(true);
    }
  };

  const reloadHandler = () => {
    if (createName) {
      setCreateName(false);
    }

    if (showLinks === false) {
      setShowLinks(true);
    }

    if (!userName) {
      setUserName(true);
    }
  };

  return (
    <>
      <div
        className={createName ? styles.userNamePage : styles.notUserNamePage}
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
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={5}
                  />
                  <button onClick={clickHandler}>OK</button>
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.conformName}>
              <p>&quot; {name} &quot;さんでよろしいですか？</p>
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
    </>
  );
}
