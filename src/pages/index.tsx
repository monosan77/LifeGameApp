import Head from 'next/head';
import styles from './toppage.module.css';
import Video from '@/components/TopPage/video';
import RoomButton from '@/components/TopPage/Room_Button/room-button';
import Title from '@/components/TopPage/title';
import { useState, useEffect } from 'react';


export default function Home() {
  const [createName, setCreateName] = useState(false);
  const [conformName, setConformName] = useState(false);
  const [name, setName] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setCreateName(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

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

  function returnHandler(){
    if(conformName){
      const timer1 = setTimeout(() => {
        setConformName(false);
        const timer2 = setTimeout(() => {
          setCreateName(true);
        }, 600);
        return () => clearTimeout(timer2);
      }, 600);
      return () => clearTimeout(timer1);
    }
  }

  return (
    <>
      <Head>
        <meta name="description" content="This is life of game Application" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.topPage_contents}>
        <Video />
        <div className={styles.component}>
          <Title />
          <p></p>
          <RoomButton />
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

        <div
          className={conformName ? styles.conformName : styles.notConformName}
        >
          <div className={styles.userNames}>
            <p>&quot; {name} &quot;さんでいいですね？</p>
            <div className={styles.decideBtn}>
              <button className={styles.returnBtn} onClick={returnHandler}>戻る</button>
              <button className={styles.OkBtn} onClick={closeHandler}>
                確定
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
