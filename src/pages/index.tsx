import Head from 'next/head';
import styles from './toppage.module.css';
import Video from '@/components/TopPage/video';
import RoomButton from '@/components/TopPage/Room_Button/room-button';
import Title from '@/components/TopPage/title';
import { useState, useEffect } from 'react';
import NamePopup from '@/components/TopPage/name-popup';
import UserName from '@/components/TopPage/user-name';

export default function Home() {
  const [createName, setCreateName] = useState(false);
  const [name, setName] = useState('');
  const [showLinks, setShowLinks] = useState(false);
  const [userName, setUsername] = useState(false);

  useEffect(() => {
    setCreateName(true);
  }, []);

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
            className={userName ? styles.displayName : styles.notDisplayName}
          >
            <UserName name={name} />
          </div>
          <div
            className={`${styles.pageLink} ${showLinks ? styles.visible : styles.hidden}`}
          >
            <RoomButton />
          </div>
        </div>
        <NamePopup
          createName={createName}
          name={name}
          setName={setName}
          setCreateName={setCreateName}
          showLinks={showLinks}
          setShowLinks={setShowLinks}
          userName={userName}
          setUserName={setUsername}
        />
      </div>
    </>
  );
}
