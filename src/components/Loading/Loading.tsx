import React from 'react';
import { PacmanLoader } from 'react-spinners';
import styles from './Loading.module.css';

interface Prop {
  loadingText: string;
}
const Loading = ({ loadingText }: Prop) => {
  return (
    <div className={styles.bg}>
      <div>
        <p className={styles.loadingText}>{loadingText}</p>
        <div className={styles.animation}>
          <PacmanLoader color="#ffff00" size={50} />
        </div>
      </div>
    </div>
  );
};

export default Loading;
