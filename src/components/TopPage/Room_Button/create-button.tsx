import { Yuji_Syuku } from 'next/font/google';
import { useState } from 'react';
import styles from './create-button.module.css';
import CreatePopup from './Create_Popup_Button/create-popup';

const yuji_Syuku = Yuji_Syuku({
  subsets: ['latin'],
  weight: ['400'],
});

export default function CreateButton() {
  //ポップアップのstate状態管理
  const [createPop, setCreatePop] = useState(false);

  function closeChanger() {
    if (createPop) {
      setCreatePop(false);
    }
  }

  function createChanger() {
    if (createPop === false) {
      const timer = setTimeout(() => {
        setCreatePop(true);
      }, 600);
      return () => clearTimeout(timer);
    }
  }

  return (
    <>
      <CreatePopup closeChanger={closeChanger} createPop={createPop} />
      <div className={styles.createRoom}>
        <button onClick={createChanger} className={styles.linkContent}>
          <p className={yuji_Syuku.className}>
            ルームを
            <br />
            つくる
          </p>
        </button>
      </div>
    </>
  );
}
