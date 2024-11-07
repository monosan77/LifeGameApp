import Head from 'next/head';
import styles from './toppage.module.css';
import Video from '@/components/TopPage/Video/video';
import RoomButton from '@/components/TopPage/Room_Button/room-button';
import Title from '@/components/TopPage/Title/title';
import { useState } from 'react';
import NamePopup from '@/components/TopPage/NamePopup/name-popup';
import UserName from '@/components/TopPage/UserName/user-name';

export default function Home() {
  const [playerName, setPlayerName] = useState('');
  const [showLinks, setShowLinks] = useState(false);
  const [conformName, setConformName] = useState(false);

  // console.log('index.tsx - playerName (initial render):', playerName);

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
          <div
            className={conformName ? styles.displayName : styles.notDisplayName}
          >
            <UserName playerName={playerName} />
          </div>
          <div
            className={`${styles.pageLink} ${showLinks ? styles.visible : styles.hidden}`}
          >
            <RoomButton playerName={playerName} />
          </div>
        </div>
        <NamePopup
          playerName={playerName}
          setPlayerName={setPlayerName}
          setShowLinks={setShowLinks}
          setConformName={setConformName}
        />
      </div>
    </>
  );
}
