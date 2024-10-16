// src/components/TopPage/PageLinks.tsx
import { useState } from 'react';
import styles from './search_button.module.css';
import { Yuji_Syuku } from 'next/font/google';
import SearchPopup from './Search_Popup_Button/search_popup';

const yuji_Syuku1 = Yuji_Syuku({
  subsets: ['latin'],
  weight: ['400'],
});

export default function SearchButton() {
  const [findPop, setFindPop] = useState(false);

  function findChanger() {
    if (findPop === false) {
      const timer = setTimeout(() => {
        setFindPop(true);
      }, 600);
      return () => clearTimeout(timer);
    }
  }
  function closeChanger() {
    if (findPop === true) {
      setFindPop(false);
    }
  }

  return (
    <>
      <SearchPopup closeChanger={closeChanger} findPop={findPop} />

      <div className={styles.searchRoom}>
        <button onClick={findChanger}>
          <div className={styles.linkContent}>
            <p className={yuji_Syuku1.className}>
              ルームを
              <br />
              さがす
            </p>
          </div>
        </button>
      </div>
    </>
  );
}
