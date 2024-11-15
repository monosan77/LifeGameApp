import React from 'react';
import styles from './BottomBar.module.css';
import { Members } from '@/types/session';

interface Props {
  yourInfo: Members;
  member: Members[];
  currentPlayer: number;
  rollDice: () => void;
  diceResult: number;
}

const BottomBar = ({
  yourInfo,
  member,
  currentPlayer,
  rollDice,
  diceResult,
}: Props) => {
  return (
    <section className={styles.bottomBar}>
      <button className={styles.chat}>chat</button>
      <div className={styles.usersTable}>
        <div className={styles.userBox}>
          <div className={styles.money}>money</div>
          <div className={styles.userName}>user1</div>
        </div>
        <div className={styles.userBox}>
          <div className={styles.money}>money</div>
          <div className={styles.userName}>user2</div>
        </div>
        <div className={styles.userBox}>
          <div className={styles.money}>money</div>
          <div className={styles.userName}>user3</div>
        </div>
        <div className={styles.userBox}>
          <div className={styles.money}>money</div>
          <div className={styles.userName}>user4</div>
        </div>
        <div className={styles.userBox}>
          <div className={styles.money}>money</div>
          <div className={styles.userName}>user5</div>
        </div>
      </div>

      <button
        className={styles.dice}
        onClick={
          yourInfo.id === member[currentPlayer].id ? rollDice : undefined
        }
      >
        dice
      </button>
      {diceResult && (
        <div className={styles.diceResult}>Dice: {diceResult}</div>
      )}
    </section>
  );
};

export default BottomBar;