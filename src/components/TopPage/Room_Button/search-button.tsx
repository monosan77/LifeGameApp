// src/components/TopPage/PageLinks.tsx
import { useState } from 'react';
import styles from './search-button.module.css';
import { Yuji_Syuku } from 'next/font/google';
import SearchPopup from './Search_Popup_Button/search-popup';

const yuji_Syuku1 = Yuji_Syuku({
  subsets: ['latin'],
  weight: ['400'],
});

interface PlayedNameProps{
  playerName:string;
}

export default function SearchButton({playerName}:PlayedNameProps) {
  const [findPop, setFindPop] = useState(false);

  function findChanger() {
    setFindPop(!findPop);
  }

  return (
    <>
      <SearchPopup closeChanger={findChanger} findPop={findPop}  playerName={playerName}/>

      <div className={styles.searchRoom}>
        <button onClick={findChanger} className={styles.linkContent}>
          <p className={yuji_Syuku1.className}>
            ルームを
            <br />
            さがす
          </p>
        </button>
      </div>
    </>
  );
}
