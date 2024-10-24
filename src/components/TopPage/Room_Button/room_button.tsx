// src/components/TopPage/PageLinks.tsx

import { useState, useEffect } from 'react';
import styles from './room_button.module.css';
import CreateButton from './create_button';
import SearchButton from './search_button';

export default function RoomButton() {
  const [showLinks, setShowLinks] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLinks(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`${styles.pageLink} ${showLinks ? styles.visible : ''}`}>
      <div className={styles.createRoom}>
        <CreateButton />
      </div>
      <div className={styles.searchRoom}>
        <SearchButton />
      </div>
    </div>
  );
}
