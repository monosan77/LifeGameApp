import React from 'react';
import styles from './BottomBar.module.css';
import { Members } from '@/types/session';
import { formatNumber } from '@/utils/utils-function';
import CountUp from 'react-countup';

interface Props {
  yourInfo: Members;
  member: Members[];
  currentPlayer: number;
  pushDiceBtn: () => void;
  diceResult: number;
  moneys: number[];
  // eventDetails: Event_Mold | null;
}

const BottomBar = ({
  yourInfo,
  member,
  currentPlayer,
  pushDiceBtn,
  moneys,
  // eventDetails,
}: Props) => {
  return (
    <section className={styles.bottomBar}>
      <button className={styles.chat}>chat</button>
      <div className={styles.usersTable}>
        {member.map((player, index) => (
          <div key={player.id} className={styles.userBox}>
            <div className={styles.userName}>{player.name}</div>
            <div className={styles.money}>{moneys[index]} 万円</div>
            {/* <div className={styles.money}>
              {formatNumber(moneys[index])}万円
            </div> */}
          </div>
        ))}
      </div>

      <button
        className={styles.dice}
        onClick={
          yourInfo.id === member[currentPlayer].id ? pushDiceBtn : undefined
        }
      >
        dice
      </button>
      {/* {diceResult && (
        <div className={styles.diceResult}>Dice: {diceResult}</div>
      )} */}
    </section>
  );
};

export default BottomBar;
