import React from 'react';
import styles from './Roulette.module.css';

interface Prop {
  isRouletteAnimation: boolean;
  rouletteStyle: string;
}

const Roulette = ({ isRouletteAnimation, rouletteStyle }: Prop) => {
  return (
    <div
      className={isRouletteAnimation ? styles.background : styles.offBackground}
    >
      <div className={styles.container}>
        <div className={`${styles.roulette} ${styles[rouletteStyle]}`}>
          <div className={styles.cell1}></div>
          <div className={styles.cell2}></div>
          <div className={styles.cell3}></div>
          <div className={styles.cell4}></div>
          <div className={styles.cell5}></div>
          <div className={styles.cell6}></div>
        </div>
        <div className={styles.arrow}></div>
      </div>
    </div>
  );
};

export default Roulette;
