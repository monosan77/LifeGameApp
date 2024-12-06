import styles from './toppage.module.css';
import Video from '@/components/TopPage/Video/video';
import RoomButton from '@/components/TopPage/Room_Button/room-button';
import Title from '@/components/TopPage/Title/title';
import { useEffect, useState } from 'react';
import NamePopup from '@/components/TopPage/NamePopup/name-popup';
import UserName from '@/components/TopPage/UserName/user-name';
import NameChangeBtn from '@/components/TopPage/NameChangeBtn/NameChangeBtn';

export default function Home() {
  const [playerName, setPlayerName] = useState('');
  const [showLinks, setShowLinks] = useState(false);
  const [conformName, setConformName] = useState(false);
  const [namePopUp, setIsNamePopUp] = useState(false);

  useEffect(() => {
    const userInfo = sessionStorage.getItem('userInfo');
    if (userInfo) {
      setPlayerName(JSON.parse(userInfo).name);
      setShowLinks(true);
      setConformName(true);
      // console.log(JSON.parse(userInfo));
    } else {
      setTimeout(() => {
        setIsNamePopUp(true);
      }, 2000);
    }
  }, []);

  function handleOpen() {
    setIsNamePopUp(true);
  }

  return (
    <>
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
          <NameChangeBtn handleOpen={handleOpen} showLinks={showLinks} />
        </div>

        <NamePopup
          playerName={playerName}
          setPlayerName={setPlayerName}
          setShowLinks={setShowLinks}
          setConformName={setConformName}
          namePopUp={namePopUp}
          setIsNamePopUp={setIsNamePopUp}
        />
      </div>
    </>
  );
}
