import React from 'react';
import styles from './BottomBar.module.css';
import { Members } from '@/types/session';
import { formatMoney } from '@/utils/utils-function';

interface Props {
  yourInfo: Members;
  member: Members[];
  currentPlayer: number;
  pushDiceBtn: () => void;
  diceResult: number;
  moneys: number[];
  isTachDiceBtn: boolean;
  // isChat: boolean;
  // setIsChat: Dispatch<SetStateAction<boolean>>;
  // eventDetails: Event_Mold | null;
}

const BottomBar = ({
  yourInfo,
  member,
  currentPlayer,
  pushDiceBtn,
  moneys,
  // isChat,
  // setIsChat,
  isTachDiceBtn,
  // eventDetails,
}: Props) => {
  return (
    <section className={styles.bottomBar}>
      <div className={styles.usersTable}>
        {member.map((player, index) => (
          <div key={player.id} className={styles.userBox}>
            <div className={styles.userName}>{player.name}</div>
            <div className={styles.money}>
              {moneys && Array.isArray(moneys)
                ? formatMoney(moneys[index])
                : '???'}{' '}
              万円
            </div>
          </div>
        ))}
      </div>

      <button
        className={styles.dice}
        onClick={
          yourInfo.id === member[currentPlayer].id && isTachDiceBtn
            ? pushDiceBtn
            : undefined
        }
        // onClick={
        //   yourInfo.id === member[currentPlayer].id ? pushDiceBtn : undefined
        // }
      >
        dice
      </button>
    </section>
  );
};

export default BottomBar;
