// src/components/TopPage/PageLinks.tsx
import Link from 'next/link';
import { Yuji_Syuku } from 'next/font/google';
import { useState} from 'react';
import styles from './createButton.module.css';

const yuji_Syuku = Yuji_Syuku({
  subsets: ['latin'],
  weight: ['400'],
});

export default function CreateButton() {

  //ポップアップのstate状態管理
  const [createPop, setCreatePop] = useState(false);


  function closeChanger() {
    if(createPop){
      setCreatePop(false);
    }
  }

  function createChanger(){
    if(createPop === false){
        const timer = setTimeout(() => {
          setCreatePop(true);
        }, 600);
        return () => clearTimeout(timer);
    
    }
  }

  return (
    <>
      <div className={createPop ? styles.visibl : styles.hidde}>
        <div className={createPop ? styles.createPop : styles.createNoPop}>
          <div className={styles.friendPop}>
            <div className={styles.close}>
              <button onClick={closeChanger}>X</button>
            </div>
            <p>何人と遊ぶ？</p>
            <div className={styles.number}>
              <button>2人</button>
              <button>3人</button>
              <button>4人</button>
              <button>5人</button>
            </div>
          </div>
        </div>
      </div>
      <Link href="#" onClick={createChanger}>
        <div className={styles.linkContent}>
          <p className={yuji_Syuku.className}>
            ルームを
            <br />
            つくる
          </p>
        </div>
      </Link>
    </>
    
  );
}
