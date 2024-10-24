// src/components/TopPage/PageLinks.tsx
import Link from 'next/link';
import { useState } from 'react';
import styles from'./search_button.module.css';
import { Yuji_Syuku } from 'next/font/google';

const yuji_Syuku1 = Yuji_Syuku({
  subsets: ['latin'],
  weight: ['400']
});

export default function SearchButton() {

  //ポップアップのstate状態管理
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
      <div className={findPop ? styles.visibles : styles.hiddens}>
        <div className={findPop ? styles.findPop : styles.findNoPop}>
          <div className={styles.searchPop}>
            <div className={styles.close}>
              <button onClick={closeChanger}>X</button>
            </div>
            <p>ルームを検索してね！</p>
            <div className={styles.search}>
              <input
                type="text"
                placeholder="&nbsp;&nbsp;入力してください..."
              />
              <button>検索</button>
            </div>
          </div>
        </div>
      </div>
      <Link href="#" onClick={findChanger}>
        <div className={styles.linkContent}>
          <p className={yuji_Syuku1.className}>
            ルームを
            <br />
            さがす
          </p>
        </div>
      </Link>
      </>
  );
}
