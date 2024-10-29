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

  function createChanger() {
    setCreatePop(!createPop);
  }

  return (
    <>
      <CreatePopup closeChanger={createChanger} createPop={createPop} />
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
