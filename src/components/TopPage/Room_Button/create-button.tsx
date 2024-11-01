import { useState } from 'react';
import CreatePopup from './Create_Popup_Button/create-popup';
import styles from './create-button.module.css';
import { Yuji_Syuku } from 'next/font/google';

const yuji_Syuku = Yuji_Syuku({
  subsets: ['latin'],
  weight: ['400'],
});

interface CreateButtonProps {
  playerName: string;
}

export default function CreateButton({ playerName }: CreateButtonProps) {
  const [createPop, setCreatePop] = useState(false);

  const createChanger = () => {
    setCreatePop(!createPop);
  };

  return (
    <>
      <CreatePopup
        closeChanger={createChanger}
        createPop={createPop}
        playerName={playerName}
      />
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
